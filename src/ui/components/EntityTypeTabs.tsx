// src/ui/components/EntityTypeTabs.tsx
import type { EntityType } from '@/features/csv-editor'
import { useActiveEntityType, useSelectedEntity, useEntities } from '@/features/csv-editor'

const INVITED_TABS: { type: EntityType; label: string }[] = [
    { type: 'titles', label: 'Titluri' },
    { type: 'persons', label: 'Persoane' },
    { type: 'locations', label: 'Locații' },
    { type: 'hotTitles', label: 'Ultima Oră' },
    { type: 'waitTitles', label: 'Titlu Așteptare' },
    { type: 'waitLocations', label: 'Locație Așteptare' },
]

export function EntityTypeTabs() {
    const { activeEntityType, setActiveEntityType } = useActiveEntityType()
    const { clearSelection } = useSelectedEntity()
    const { activeSection } = useEntities()

    // Safety: tab-urile astea sunt doar pentru INVITATI
    if (!activeSection || activeSection.kind !== 'invited') return null

    const handleChange = (type: EntityType) => {
        if (type === activeEntityType) return
        clearSelection()
        setActiveEntityType(type)
    }

    return (
        <div className="flex flex-wrap gap-2">
            {INVITED_TABS.map((t) => (
                <button
                    key={t.type}
                    onClick={() => handleChange(t.type)}
                    className={`px-3 py-1 rounded text-sm border ${
                        activeEntityType === t.type
                            ? 'bg-blue-600 text-white border-blue-700'
                            : 'bg-white hover:bg-gray-50 border-gray-300'
                    }`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    )
}