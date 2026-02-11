// src/ui/components/layout/EditorHeader.tsx
import { Tabs } from '../Tabs'
import { useEntities } from '@/features/csv-editor'
import { createEmptyEntitiesState } from '@/features/csv-editor'
import { ConfirmDialog } from '../common/ConfirmDialog'
import {EditModeToggle} from "@/ui/components/EditModeToggle";
import { Link } from 'react-router-dom'

export function EditorHeader() {
    const { clearAll, loadCsv } = useEntities()

    return (
        <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
            <Tabs />
            <div className="flex gap-2">
                <EditModeToggle/>

                <button
                    onClick={loadCsv}
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                    Load CSV
                </button>

                <ConfirmDialog
                    title="Ștergi tot conținutul?"
                    description="Această acțiune nu poate fi anulată."
                    onConfirm={() =>
                        clearAll(createEmptyEntitiesState())
                    }
                >
                    <button className="bg-red-600 text-white px-4 py-1 rounded">
                        Clear All
                    </button>
                </ConfirmDialog>
            </div>
        </div>
    )
}
