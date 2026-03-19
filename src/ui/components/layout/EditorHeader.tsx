// src/ui/components/layout/EditorHeader.tsx
import { useEntities } from '@/features/csv-editor'
import { Link } from 'react-router-dom'
import { EditModeToggle } from '@/ui/components/EditModeToggle'
import { useTitleFilter } from '@/ui/context/TitleFilterContext'
import { SectionsTabs } from '@/ui/components/SectionsTabs'
import { ConfirmDialog } from '../common/ConfirmDialog'

function FileIcon() {
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
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 2v6h6"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 13h8"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 17h5"
            />
        </svg>
    )
}

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
    const { clearAll, loadCsv } = useEntities()
    const { titleFilter, setTitleFilter } = useTitleFilter()

    return (
        <div className="flex items-center justify-between gap-4 border-b bg-white px-4 py-2">
            <SectionsTabs />

            <div className='relative flex items-center'>
                <input
                    type="text"
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                    placeholder="Caută titlul"
                    className="w-64 rounded border border-gray-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={(e) => setTitleFilter('')}
                        className='absolute right-1 px-2 py-2 text-sm text-gray-500 bg-transparent hover:bg-blue-100 hover:bg-gray-100'
                ><TrashIcon /></button>
            </div>

            <div className="flex items-center gap-2">


                <EditModeToggle />

                <button
                    onClick={loadCsv}
                    className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-1 text-white"
                >
                    <FileIcon />
                    Selecteaza CSV
                </button>

                <ConfirmDialog
                    title="Stergi tot continutul?"
                    description="Aceasta actiune nu poate fi anulata."
                    onConfirm={() => clearAll()}
                >
                    <button className="inline-flex items-center gap-2 rounded bg-red-600 px-4 py-1 text-white">
                        <TrashIcon />
                        Sterge
                    </button>
                </ConfirmDialog>

            </div>
        </div>
    )
}
