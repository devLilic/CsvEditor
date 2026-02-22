// src/ui/components/SectionListsPanel.tsx
import type { EntityType } from '@/features/csv-editor'
import { useEntities } from '@/features/csv-editor'
import { EntityListBlock } from './EntityListBlock'
import { EmptyState } from './common/EmptyState'

export function SectionListsPanel() {
    const { activeSection } = useEntities()

    if (!activeSection) {
        return <EmptyState text="Nu există secțiune activă." />
    }

    const isInvited = activeSection.kind === 'invited'
    const sectionId = activeSection.id

    const betaLists: Array<{ type: EntityType; title: string; showNumber?: boolean }> = [
        { type: 'titles', title: 'Titluri', showNumber: true },
        { type: 'persons', title: 'Persoane' },
        { type: 'locations', title: 'Locații' },
        { type: 'hotTitles', title: 'Ultima Oră' },
    ]

    const invitedLists: Array<{ type: EntityType; title: string; showNumber?: boolean }> = [
        ...betaLists,
        { type: 'waitTitles', title: 'Titluri Așteptare' },
        { type: 'waitLocations', title: 'Locații Așteptare' },
    ]

    const lists = isInvited ? invitedLists : betaLists

    return (
        <div className="h-full min-h-0 grid grid-cols-1 gap-3">
            {/* grid responsive: 2 coloane pe ecrane late */}
            <div className={`grid gap-3 ${isInvited ? 'grid-cols-2' : 'grid-cols-2'}`}>
                {lists.map((l) => (
                    <div key={l.type} className="min-h-0 h-[300px]">
                        <EntityListBlock
                            sectionId={sectionId}
                            entityType={l.type}
                            title={l.title}
                            showNumber={l.showNumber}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}