// src/ui/components/layout/EditorBody.tsx
import { EntityEditor } from '../EntityEditor'
import { EditorActionsBar } from '@/ui/components/EditorActionsBar'
import { SectionPanelBeta } from '@/ui/components/SectionPanelBeta'
import { SectionPanelInvited } from '@/ui/components/SectionPanelInvited'
import { useEntities } from '@/features/csv-editor'

export function EditorBody() {
    const { activeSection } = useEntities()

    return (
        <div className="flex-1 grid grid-cols-[720px_1fr] gap-4 p-4">
            {/* LEFT */}
            <div className="min-h-0">
                {activeSection?.kind === 'invited' ? <SectionPanelInvited /> : <SectionPanelBeta />}
            </div>

            {/* RIGHT */}
            <div className="min-h-0 flex flex-col gap-3">
                {activeSection?.kind !== 'invited' ? <div className="bg-white rounded border p-2">
                    <EditorActionsBar />
                </div> : <div className="bg-white rounded border p-2 h-12">

                </div>}


                <EntityEditor />
            </div>
        </div>
    )
}