// src/ui/components/EntityTypeTabsLeft.tsx
import type { EntityType } from '@/features/csv-editor'
import { useActiveEntityType, useSelectedEntity, useEntities } from '@/features/csv-editor'

const INVITED_TABS: { type: EntityType; label: string }[] = [
    { type: 'titles', label: 'Titluri' },
    { type: 'persons', label: 'Persoane' },
    { type: 'locations', label: 'Locații' },
    { type: 'hotTitles', label: 'Ultima oră' },
    { type: 'waitTitles', label: 'Titluri așteptare' },
    { type: 'waitLocations', label: 'Locații așteptare' },
]

const BETA_TABS: { type: EntityType; label: string }[] = [
    { type: 'titles', label: 'Titluri' },
    { type: 'persons', label: 'Persoane' },
]

export function EntityTypeTabsLeft() {
    const { activeSection } = useEntities()
    const { activeEntityType, setActiveEntityType } = useActiveEntityType()
    const { clearSelection } = useSelectedEntity()

    const tabs = activeSection?.kind === 'beta' ? BETA_TABS : INVITED_TABS

    const handleChange = (type: EntityType) => {
        if (type === activeEntityType) return
        clearSelection()
        setActiveEntityType(type)
    }

    return (
        <div className="flex gap-2 flex-wrap">
            {tabs.map((t) => (
                <button
                    key={t.type}
                    onClick={() => handleChange(t.type)}
                    className={`px-3 py-1 rounded text-sm ${
                        activeEntityType === t.type
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    )
}