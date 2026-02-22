// src/ui/components/SectionsTabs.tsx
import { useMemo, useState } from 'react'
import { useEntities, useSelectedEntity, useActiveEntityType } from '@/features/csv-editor'
import type { CsvSection, EntityType } from '@/features/csv-editor'
import { ConfirmDialog } from '@/ui/components/common/ConfirmDialog'
import { TextPromptDialog } from '@/ui/components/common/TextPromptDialog'

const DEFAULT_ENTITY: EntityType = 'titles'

function isBeta(section: CsvSection) {
    return section.kind === 'beta'
}

export function SectionsTabs() {
    const {
        sections,
        activeSectionId,
        setActiveSection,
        addBetaSection,
        renameBetaSection,
        deleteBetaSection,
    } = useEntities()

    const { clearSelection } = useSelectedEntity()
    const { setActiveEntityType } = useActiveEntityType()

    // ---- Add dialog ----
    const [addOpen, setAddOpen] = useState(false)

    // ---- Rename dialog ----
    const [renameOpen, setRenameOpen] = useState(false)
    const [renameSectionId, setRenameSectionId] = useState<string | null>(null)

    const activeSection = useMemo(
        () => sections.find((s) => s.id === activeSectionId) ?? null,
        [sections, activeSectionId]
    )

    const handleSwitchSection = (sectionId: string) => {
        if (sectionId === activeSectionId) return

        clearSelection()
        setActiveEntityType(DEFAULT_ENTITY)
        setActiveSection(sectionId)
    }

    const openRename = (sectionId: string) => {
        setRenameSectionId(sectionId)
        setRenameOpen(true)
    }

    const renameInitialValue = useMemo(() => {
        if (!renameSectionId) return ''
        const s = sections.find((x) => x.id === renameSectionId)
        if (!s || !isBeta(s)) return ''
        return s.betaTitle ?? ''
    }, [renameSectionId, sections])

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {sections.map((section) => {
                const isActive = section.id === activeSectionId

                if (section.kind === 'beta') {
                    // ✅ canonical: partea numerică vine din betaIndex, partea editabilă = betaTitle
                    const label = `${section.betaTitle ?? 'Titlu'}`

                    return (
                        <div
                            key={section.id}
                            className={`flex items-center gap-1 rounded border px-2 py-1 ${
                                isActive ? 'bg-blue-600 text-white border-blue-700' : 'bg-white hover:bg-gray-50'
                            }`}
                        >
                            <button
                                onClick={() => handleSwitchSection(section.id)}
                                className="text-sm"
                                title={label}
                            >
                                {label}
                            </button>

                            {/* Rename */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    openRename(section.id)
                                }}
                                className={`ml-1 text-xs px-2 py-0.5 rounded border ${
                                    isActive ? 'border-white/50 hover:bg-white/10' : 'border-gray-200 hover:bg-gray-100'
                                }`}
                                title="Rename"
                            >
                                ✎
                            </button>

                            {/* Delete (confirm) */}
                            <ConfirmDialog
                                title="Ștergi secțiunea BETA?"
                                description="Conținutul din această secțiune va fi șters. INVITAȚI rămâne mereu."
                                onConfirm={() => {
                                    clearSelection()
                                    // dacă ștergi secțiunea activă, logic va reindexa; UI doar cere delete
                                    deleteBetaSection(section.id)
                                    // fallback: dacă ștergeai activul, setează default după ce logic actualizează
                                    setActiveEntityType(DEFAULT_ENTITY)
                                }}
                            >
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className={`text-xs px-2 py-0.5 rounded border ${
                                        isActive ? 'border-white/50 hover:bg-white/10' : 'border-gray-200 hover:bg-gray-100'
                                    }`}
                                    title="Delete"
                                >
                                    🗑
                                </button>
                            </ConfirmDialog>
                        </div>
                    )
                }

                // invited
                return (
                    <button
                        key={section.id}
                        onClick={() => handleSwitchSection(section.id)}
                        className={`px-3 py-1 rounded text-sm border ${
                            isActive ? 'bg-blue-600 text-white border-blue-700' : 'bg-white hover:bg-gray-50 border-gray-200'
                        }`}
                    >
                        PLATOU
                    </button>
                )
            })}

            {/* Add BETA (max 5 control e în logic; UI doar cere) */}
            <button
                onClick={() => setAddOpen(true)}
                className="px-3 py-1 rounded text-sm border bg-white border border-green-300 hover:bg-green-500 hover:text-white"
                title="Add BETA"
            >
                ADAUGĂ BETA
            </button>

            {/* ADD DIALOG */}
            <TextPromptDialog
                open={addOpen}
                title="Creează secțiune BETA"
                description="Introdu un titlu scurt (editabil). Partea „BETA X” se generează automat."
                placeholder="Ex: Consiliu UE"
                initialValue=""
                confirmText="Creează"
                onClose={() => setAddOpen(false)}
                onConfirm={(v) => {
                    const betaTitle = (v ?? '').trim() || ''
                    // ✅ NU trimite “BETA 1” etc. – doar titlul editabil
                    addBetaSection(betaTitle)
                }}
            />

            {/* RENAME DIALOG */}
            <TextPromptDialog
                open={renameOpen}
                title="Redenumește titlul BETA"
                description="Se schimbă doar partea editabilă (betaTitle)."
                placeholder="Titlu scurt…"
                initialValue={renameInitialValue || 'Titlu'}
                confirmText="Salvează"
                onClose={() => {
                    setRenameOpen(false)
                    setRenameSectionId(null)
                }}
                onConfirm={(v) => {
                    if (!renameSectionId) return
                    const nextTitle = (v ?? '').trim() || 'Titlu'
                    renameBetaSection(renameSectionId, nextTitle)
                }}
            />
        </div>
    )
}