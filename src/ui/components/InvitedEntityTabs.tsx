// src/ui/components/InvitedEntityTabs.tsx
import type { EntityType } from '@/features/csv-editor'
import { useActiveEntityType } from '@/features/csv-editor'
import { useSelectedEntity } from '@/features/csv-editor'

const INVITED_TABS: { type: EntityType; label: string }[] = [
    { type: 'titles', label: 'Titluri' },
    { type: 'persons', label: 'Persoane' },
    { type: 'locations', label: 'Locații' },
    { type: 'hotTitles', label: 'Ultima Oră' },
    { type: 'waitTitles', label: 'Titluri Așteptare' },
    { type: 'waitLocations', label: 'Locații Așteptare' },
]

export function InvitedEntityTabs() {
    const { activeEntityType, setActiveEntityType } = useActiveEntityType()
    const { clearSelection } = useSelectedEntity()

    const onChange = (type: EntityType) => {
        if (type === activeEntityType) return
        clearSelection()
        setActiveEntityType(type)
    }

    return (
        <div className="flex gap-2 flex-wrap">
            {INVITED_TABS.map((t) => (
                <button
                    key={t.type}
                    onClick={() => onChange(t.type)}
                    className={`px-3 py-1 rounded text-sm border ${
                        activeEntityType === t.type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'
                    }`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    )
}