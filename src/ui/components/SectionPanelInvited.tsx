// src/ui/components/SectionPanelInvited.tsx
import { InvitedEntityTabs } from './InvitedEntityTabs'
import { EntityList } from './EntityList'
import { useEntities } from '@/features/csv-editor'
import { useActiveEntityType } from '@/features/csv-editor'

export function SectionPanelInvited() {
    const { activeSectionId, activeSection } = useEntities()
    const { activeEntityType } = useActiveEntityType()

    if (!activeSectionId || !activeSection) return null

    return (
        <div className="flex flex-col gap-3">
            <div className="bg-white rounded border p-2">
                <InvitedEntityTabs />
            </div>

            <div className="bg-white rounded border">
                
                <div className="p-2">
                    <EntityList
                        sectionId={activeSectionId}
                        entityType={activeEntityType}
                        showTitleNumbering={activeEntityType === 'titles'}
                    />
                </div>
            </div>
        </div>
    )
}