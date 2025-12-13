// src/ui/components/Tabs.tsx
import type { EntityType } from '@/features/csv-editor'
import {
    useActiveEntityType,
    useSelectedEntity,
} from '@/features/csv-editor'

const TABS: { type: EntityType; label: string }[] = [
    { type: 'titles', label: 'Titluri' },
    { type: 'persons', label: 'Persoane' },
    { type: 'locations', label: 'Locații' },
    { type: 'hotTitles', label: 'Ultima oră' },
    { type: 'waitTitles', label: 'Titluri așteptare' },
    { type: 'waitLocations', label: 'Locații așteptare' },
]

export function Tabs() {
    const {
        activeEntityType,
        setActiveEntityType,
    } = useActiveEntityType()

    const { clearSelection } = useSelectedEntity()

    const handleTabChange = (type: EntityType) => {
        if (type === activeEntityType) return

        // 🔑 IEȘIM DIN EDIT MODE
        clearSelection()

        // 🔁 SCHIMBĂM CONTEXTUL
        setActiveEntityType(type)
    }

    return (
        <div className="flex gap-2">
            {TABS.map((t) => (
                <button
                    key={t.type}
                    onClick={() => handleTabChange(t.type)}
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
