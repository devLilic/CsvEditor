// src/ui/components/EditorActionsBar.tsx
import type { EntityType } from '@/features/csv-editor'
import { useActiveEntityType, useSelectedEntity, useEntities } from '@/features/csv-editor'

type Action = { type: EntityType; label: string }

const BETA_ACTIONS: Action[] = [
    { type: 'titles', label: '+ Titlu' },
    { type: 'persons', label: '+ Nume' },
    { type: 'locations', label: '+ Locație' },
    { type: 'hotTitles', label: '+ Ultima Oră' },
]

const INVITED_ACTIONS: Action[] = [
    ...BETA_ACTIONS,
    { type: 'waitTitles', label: '+ Titlu Așteptare' },
    { type: 'waitLocations', label: '+ Locație Așteptare' },
]

export function EditorActionsBar() {
    const { activeSection } = useEntities()
    const { setActiveEntityType } = useActiveEntityType()
    const { clearSelection } = useSelectedEntity()

    const actions = activeSection?.kind === 'invited' ? INVITED_ACTIONS : BETA_ACTIONS

    const onAction = (t: EntityType) => {
        clearSelection()
        setActiveEntityType(t)
    }

    return (
        <div className="flex gap-2 flex-wrap">
            {actions.map((a) => (
                <button
                    key={a.type}
                    onClick={() => onAction(a.type)}
                    className="px-3 py-1 rounded text-sm border bg-white hover:bg-gray-50"
                >
                    {a.label}
                </button>
            ))}
        </div>
    )
}