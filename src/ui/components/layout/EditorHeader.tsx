// src/ui/components/layout/EditorHeader.tsx
import { useState } from 'react'
import { useEntities } from '@/features/csv-editor'
import { EditModeToggle } from '@/ui/components/EditModeToggle'
import { useTitleFilter } from '@/ui/context/TitleFilterContext'
import { SectionsTabs } from '@/ui/components/SectionsTabs'
import { useWorkingCsvInfo } from '@/features/csv-editor/hooks/useWorkingCsvInfo'
import { ConfirmDialog } from '../common/ConfirmDialog'

function TrashIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6h18"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 6V4h8v2"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 6l-1 14H6L5 6"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 11v6"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 11v6"
            />
        </svg>
    )
}

export function EditorHeader() {
    const { startNewProject } = useEntities()
    const { titleFilter, setTitleFilter } = useTitleFilter()
    const [newProjectError, setNewProjectError] = useState<string | null>(null)
    const workingCsvInfo = useWorkingCsvInfo()

    const handleStartNewProject = async () => {
        setNewProjectError(null)
        const result = await startNewProject()
        if (!result.ok) {
            setNewProjectError(
                result.error.startsWith('Backup failed:')
                    ? 'Backup CSV nu a putut fi creat. Proiectul nu a fost resetat. Verifica folderul de backup din Setari.'
                    : `Nu s-a putut porni proiectul nou: ${result.error}`
            )
        }
    }

    return (
        <div className="relative flex items-center justify-between gap-4 border-b bg-white px-4 py-2">
            <SectionsTabs />

            <div className="relative flex items-center">
                <input
                    type="text"
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                    placeholder="Cauta titlul"
                    className="w-64 rounded border border-gray-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => setTitleFilter('')}
                    className="absolute right-1 bg-transparent px-2 py-2 text-sm text-gray-500 hover:bg-gray-100"
                    aria-label="Curata filtrul"
                >
                    <TrashIcon />
                </button>
            </div>

            <div className="flex min-w-0 items-center gap-2">
                <span className="max-w-48 truncate rounded border border-gray-300 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
                    CSV: {workingCsvInfo.filename}
                </span>

                <EditModeToggle />

                <ConfirmDialog
                    title="Incepi un proiect nou?"
                    description="Se va crea un backup CSV in folderul setat in Setari. Doar dupa backup, fisierul de lucru va fi resetat cu continutul standard. Daca backup-ul esueaza, resetarea nu se face."
                    onConfirm={handleStartNewProject}
                >
                    <button className="inline-flex items-center gap-2 rounded bg-red-600 px-4 py-1 text-white">
                        <TrashIcon />
                        Proiect nou
                    </button>
                </ConfirmDialog>
            </div>

            {newProjectError && (
                <div
                    role="alert"
                    className="absolute right-4 top-14 max-w-md rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 shadow-sm"
                >
                    {newProjectError}
                </div>
            )}
        </div>
    )
}
