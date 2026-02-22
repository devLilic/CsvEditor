// src/ui/components/EntityTypeActionBar.tsx
import type { EntityType } from '@/features/csv-editor'
import { useEntities, useActiveEntityType, useSelectedEntity } from '@/features/csv-editor'

export function EntityTypeActionBar() {
    const { activeSection } = useEntities()
    const { setActiveEntityType, activeEntityType } = useActiveEntityType()
    const { clearSelection } = useSelectedEntity()

    if (!activeSection) return null

    const isInvited = activeSection.kind === 'invited'

    const buttons: Array<{ type: EntityType; label: string }> = [
        { type: 'titles', label: '+ Titlu' },
        { type: 'persons', label: '+ Nume' },
        { type: 'locations', label: '+ Locație' },
        { type: 'hotTitles', label: '+ Ultima Oră' },
        ...(isInvited
            ? ([
                { type: 'waitTitles', label: '+ Titlu Așteptare' },
                { type: 'waitLocations', label: '+ Locație Așteptare' },
            ] as Array<{ type: EntityType; label: string }>)
            : []),
    ]

    return (
        <div className="flex flex-wrap gap-2">
            {buttons.map((b) => (
                <button
                    key={b.type}
                    onClick={() => {
                        clearSelection()
                        setActiveEntityType(b.type)
                    }}
                    className={`px-3 py-1 rounded text-sm border ${
                        activeEntityType === b.type ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'
                    }`}
                >
                    {b.label}
                </button>
            ))}
        </div>
    )
}