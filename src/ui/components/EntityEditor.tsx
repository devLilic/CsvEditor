// src/ui/components/EntityEditor.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useEntities, useSelectedEntity, useActiveEntityType } from '@/features/csv-editor'
import { createPreviewData, getTemplateForEntityType } from '@/templates/broadcast'
import { Preview16x9 } from './Preview16x9'
import { QuickTitlesBar } from './QuickTitlesBar'
import { InputField } from './common/InputField'

type FormState = {
    title?: string
    name?: string
    occupation?: string
    location?: string
}

export function EntityEditor() {
    const { activeSectionId, activeSection, getBlockItems, addEntity, updateEntity } = useEntities()

    const { selected, clearSelection } = useSelectedEntity()
    const { activeEntityType } = useActiveEntityType()

    const [showInvalid, setShowInvalid] = useState(false)
    const [form, setForm] = useState<FormState>({})

    // refs focus
    const titleRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const occupationRef = useRef<HTMLInputElement>(null)
    const locationRef = useRef<HTMLInputElement>(null)

    const sectionId = activeSectionId ?? activeSection?.id ?? ''
    // ✅ memoize list + selectedItem (prevents "Maximum update depth exceeded")
    const selectedItems = useMemo(() => {
        if (!selected) return []
        return getBlockItems(selected.sectionId, selected.entityType)
    }, [getBlockItems, selected?.sectionId, selected?.entityType])

    const selectedItem = useMemo(() => {
        if (!selected) return null
        return selectedItems.find((x: any) => x.id === selected.id) ?? null
    }, [selectedItems, selected?.id])

    // ---- helpers ----
    const focusPrimaryInput = useCallback(() => {
        let el: HTMLInputElement | null = null

        if (activeEntityType === 'persons') el = nameRef.current
        else if (activeEntityType === 'locations') el = locationRef.current
        else el = titleRef.current

        if (!el) return
        el.focus()
        const len = el.value.length
        try {
            el.setSelectionRange(len, len)
        } catch {
            // ignore (some inputs might not support selection range)
        }
    }, [activeEntityType])

    const focusTitleInput = useCallback(() => {
        const el = titleRef.current
        if (!el) return
        el.focus()
        const len = el.value.length
        try {
            el.setSelectionRange(len, len)
        } catch {
            // ignore
        }
    }, [])

    // ✅ populate form (ONLY when selection identity changes)
    useEffect(() => {
        if (!selected || !selectedItem) {
            setForm({})
            return
        }

        const data = (selectedItem as any).data

        switch (selected.entityType) {
            case 'persons':
                setForm({
                    name: data?.name ?? '',
                    occupation: data?.occupation ?? '',
                })
                break

            case 'locations':
                setForm({
                    location: data?.location ?? '',
                })
                break

            default:
                setForm({
                    title: data?.title ?? '',
                })
        }
    }, [selected?.id, selected?.entityType, selected?.sectionId, selectedItem])

    // ✅ autofocus whenever context changes (tab, selection, section)
    useEffect(() => {
        focusPrimaryInput()
    }, [focusPrimaryInput, activeEntityType, selected?.id, selected?.sectionId])

    // ✅ ESC clears selection + resets editor
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return
            if (!selected) return

            e.preventDefault()
            clearSelection()
            setForm({})
            // keep same activeEntityType, but return to create mode
            requestAnimationFrame(() => focusPrimaryInput())
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [selected, clearSelection, focusPrimaryInput])

    const updateField = (key: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    // ✅ normalize only at SAVE time (prevents cursor jumping while editing)
    const normalizeForm = (f: FormState): FormState => {
        const next = { ...f }
        if (next.title) next.title = next.title.toUpperCase()
        if (next.name) next.name = next.name.toUpperCase()
        if (next.location) next.location = next.location.toUpperCase()
        // occupation stays mixed-case
        return next
    }

    const isFormValid = (): boolean => {
        switch (activeEntityType) {
            case 'persons':
                return Boolean(form.name?.trim())

            case 'locations':
                return Boolean(form.location?.trim())

            case 'titles':
            default:
                return Boolean(form.title?.trim())
        }
    }

    const saveEntity = () => {
        if (!isFormValid()) {
            setShowInvalid(true)
            setTimeout(() => setShowInvalid(false), 600)
            return
        }

        const payload = normalizeForm(form)

        if (selected && selectedItem) {
            updateEntity(selected.sectionId, selected.entityType, selected.id, payload)
            clearSelection()
        } else {
            // create mode: use active section + active entity type
            addEntity(sectionId, activeEntityType, payload)
        }

        setForm({})
        requestAnimationFrame(() => focusPrimaryInput())
    }

    // ✅ QuickTitle: insert at beginning; if already has "XXX: " prefix, replace it
    const applyQuickTitle = (prefix: string) => {
        setForm((prev) => {
            const current = prev.title ?? ''
            const cleaned = current.replace(/^[^:]+:\s*/, '')
            const nextTitle = `${prefix} ${cleaned}`.trim()
            return { ...prev, title: nextTitle }
        })

        requestAnimationFrame(() => focusTitleInput())
    }

    const previewTemplate = getTemplateForEntityType(activeEntityType)
    const previewData = createPreviewData(activeEntityType, form)

    return (
        <div className="bg-white rounded border p-4 flex flex-col gap-4 min-h-0 min-w-0 max-w-full overflow-hidden">

            <div
                data-testid="entity-preview-container"
                className="min-h-0 min-w-0 overflow-hidden"
            >
                <Preview16x9
                    template={previewTemplate}
                    data={previewData}
                    fitMode="width"
                    maxHeight={700}
                />
            </div>

            {/* inputs */}
            <div className="flex flex-col gap-3 w-full font-bold shrink-0">
                {activeEntityType === 'persons' && (
                    <>
                        <InputField
                            label="Nume"
                            value={form.name ?? ''}
                            uppercase
                            inputRef={nameRef}
                            onChange={(v) => updateField('name', v)}
                            onEnter={() => occupationRef.current?.focus()}
                            invalid={showInvalid}
                        />

                        <InputField
                            label="Funcție"
                            value={form.occupation ?? ''}
                            inputRef={occupationRef}
                            onChange={(v) => updateField('occupation', v)}
                            onEnter={saveEntity}
                        />
                    </>
                )}

                {activeEntityType === 'locations' && (
                    <InputField
                        label="Locație"
                        value={form.location ?? ''}
                        uppercase
                        inputRef={locationRef}
                        onChange={(v) => updateField('location', v)}
                        onEnter={saveEntity}
                        invalid={showInvalid}
                    />
                )}

                {activeEntityType === 'titles' && (
                    <InputField
                        label="Titlu"
                        value={form.title ?? ''}
                        inputRef={titleRef}
                        onChange={(v) => updateField('title', v)}
                        onEnter={saveEntity}
                        invalid={showInvalid}
                    />
                )}
            </div>

            <button
                onClick={saveEntity}
                disabled={!isFormValid()}
                className={`py-2 rounded text-white ${
                    isFormValid() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                } shrink-0`}
            >
                {selected ? 'Update' : 'Adaugă'}
            </button>

            {/* QuickTitles doar la TITLES */}
            {activeEntityType === 'titles' && (
                <div className="border-t pt-3 mt-2 shrink-0">
                    <div className="text-xs text-gray-500 mb-2">Prefixe rapide</div>
                    <QuickTitlesBar onApplyPrefix={applyQuickTitle} focusEditor={focusTitleInput} />
                </div>
            )}
        </div>
    )
}
