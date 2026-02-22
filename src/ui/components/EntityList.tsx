// src/ui/components/EntityList.tsx
import type { EntityType, Person, Location, SimpleTitle } from '@/features/csv-editor'
import { useEntities, useSelectedEntity, useOnAir } from '@/features/csv-editor'
import { EmptyState } from './common/EmptyState'
import { useEditMode } from '@/ui/context/EditModeContext'

type BlockItem =
    | { entityType: 'titles'; id: string; rowId: string; data: SimpleTitle }
    | { entityType: 'persons'; id: string; rowId: string; data: Person }
    | { entityType: 'locations'; id: string; rowId: string; data: Location }
    | { entityType: 'hotTitles'; id: string; rowId: string; data: SimpleTitle }
    | { entityType: 'waitTitles'; id: string; rowId: string; data: SimpleTitle }
    | { entityType: 'waitLocations'; id: string; rowId: string; data: Location }

interface EntityListProps {
    sectionId: string
    entityType: EntityType
    title?: string
}

const LABELS: Record<EntityType, string> = {
    titles: 'Titluri',
    persons: 'Persoane',
    locations: 'Locații',
    hotTitles: 'Ultima Oră',
    waitTitles: 'Titluri Așteptare',
    waitLocations: 'Locații Așteptare',
}

export function EntityList({ sectionId, entityType, title }: EntityListProps) {
    const { getBlockItems, deleteEntity } = useEntities()
    const { select, isSelected } = useSelectedEntity()
    const { isOnAir, setOnAir, clearOnAir } = useOnAir()
    const { editMode } = useEditMode()

    const items = getBlockItems(sectionId, entityType) as BlockItem[]

    if (!items || items.length === 0) {
        return (
            <div className="bg-white rounded border">
                <div className="px-3 py-2 text-sm font-semibold border-b bg-gray-50 flex items-center justify-between">
                    <span>{title ?? LABELS[entityType]}</span>
                    <span className="text-xs text-gray-400">0</span>
                </div>
                <div className="p-3">
                    <EmptyState text="Nu există elemente în această listă." />
                </div>
            </div>
        )
    }

    // 🔢 Numerotare DOAR pentru TITLES (per secțiune, corespunde cu CSV „Nr”)
    let nr = 0

    return (
        <div className="bg-white rounded border overflow-hidden">


            <div className="max-h-[320px] overflow-y-auto">
                {items.map((item) => {
                    const active = isOnAir(entityType, item.id)
                    const selected = isSelected(sectionId, entityType, item.id)

                    if (entityType === 'titles') nr += 1

                    return (
                        <div
                            key={item.id}
                            onClick={() => select(sectionId, entityType, item.id)}
                            className={`px-3 py-2 cursor-pointer flex justify-between items-center gap-3 border-l-4
                                ${selected ? 'bg-blue-100' : 'hover:bg-gray-100'}
                                ${active ? 'border-red-600 bg-red-50' : 'border-transparent'}`}
                        >
                            <div className="flex gap-2 overflow-hidden items-start">
                                {editMode && (
                                    <button
                                        title="Șterge"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            deleteEntity(sectionId, entityType, item.id)
                                        }}
                                        className="text-xs text-white bg-red-500 hover:bg-red-700 px-2 py-0.5 rounded"
                                    >
                                        ✕
                                    </button>
                                )}

                                <div className="min-w-0">
                                    {entityType === 'persons' ? (
                                        <>
                                            <div className="font-bold truncate">
                                                {(item.data as Person).name}
                                            </div>
                                            <div className="text-xs text-gray-600 truncate">
                                                {(item.data as Person).occupation}
                                            </div>
                                        </>
                                    ) : entityType === 'locations' || entityType === 'waitLocations' ? (
                                        <div className="font-bold truncate">
                                            {(item.data as Location).location}
                                        </div>
                                    ) : (
                                        <div className="font-bold truncate flex gap-2">
                                            {entityType === 'titles' && (
                                                <span className="shrink-0 text-gray-600">
                                                    {nr}.
                                                </span>
                                            )}
                                            <span className="truncate">
                                                {(item.data as SimpleTitle).title}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ON AIR (max 1 per EntityType) */}
                            <div className="flex items-center gap-2 shrink-0">
                                {active ? (
                                    <>
                                        <span className="text-xs font-semibold text-red-600">
                                            ● ON AIR
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                clearOnAir(entityType)
                                            }}
                                            className="text-xs px-2 py-1 rounded border border-gray-400 bg-gray-100 hover:bg-gray-200"
                                        >
                                            STOP
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setOnAir(entityType, item.id)
                                        }}
                                        className="text-xs px-2 py-1 rounded border border-red-500 text-red-500 hover:bg-red-600 hover:text-white"
                                    >
                                        ON AIR
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}