// src/ui/components/layout/EditorHeader.tsx
import { useEntities } from '@/features/csv-editor'
import { createEmptyEntitiesState } from '@/features/csv-editor'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { EditModeToggle } from '@/ui/components/EditModeToggle'
import { Link } from 'react-router-dom'
import {SectionsTabs} from "@/ui/components/SectionsTabs";

export function EditorHeader() {
    const { clearAll, loadCsv, activeSectionId } = useEntities()

    return (
        <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
            <SectionsTabs />

            <div className="flex gap-2 items-center">
                <EditModeToggle />

                <button onClick={loadCsv} className="bg-blue-600 text-white px-4 py-1 rounded">
                    Load CSV
                </button>

                <ConfirmDialog
                    title="Ștergi tot conținutul?"
                    description="Această acțiune nu poate fi anulată."
                    onConfirm={() => clearAll(createEmptyEntitiesState(activeSectionId || 'invited'))}
                >
                    <button className="bg-red-600 text-white px-4 py-1 rounded">Clear All</button>
                </ConfirmDialog>

                <Link to="/settings" className="px-3 py-1 rounded border bg-white hover:bg-gray-50">
                    Settings
                </Link>
            </div>
        </div>
    )
}