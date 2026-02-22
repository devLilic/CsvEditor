// src/ui/components/EntityListBlock.tsx
import type { EntityType } from '@/features/csv-editor'
import { useEntities, useActiveEntityType, useSelectedEntity, useOnAir } from '@/features/csv-editor'
import { useEditMode } from '@/ui/context/EditModeContext'

type BlockItem = {
    entityType: EntityType
    id: string
    rowId: string
    data: any
}

interface Props {
    sectionId: string
    entityType: EntityType
    title: string
    showNumber?: boolean // doar pentru titles
}

export function EntityListBlock({ sectionId, entityType, title, showNumber }: Props) {
    const { getBlockItems, deleteEntity } = useEntities()
    const { setActiveEntityType } = useActiveEntityType()
    const { select, isSelected } = useSelectedEntity()
    const { editMode } = useEditMode()
    const { isOnAir, setOnAir, clearOnAir } = useOnAir()

    const items = getBlockItems(sectionId, entityType) as BlockItem[]

    let nr = 0

    return (
        <div className="bg-white rounded border overflow-hidden flex flex-col min-h-0">
            <div className="px-3 py-2 border-b bg-gray-50 flex items-center justify-between">
                <div className="text-sm font-semibold">{title}</div>
                <div className="text-xs text-gray-500">{items.length}</div>
            </div>

            <div className="flex-1 overflow-auto">
                {items.map((it) => {
                    if (showNumber) nr += 1

                    const active = isOnAir(entityType, it.id)
                    const selected = isSelected(sectionId, entityType, it.id)

                    const primaryText =
                        entityType === 'persons'
                            ? it.data?.name ?? ''
                            : entityType === 'locations' || entityType === 'waitLocations'
                                ? it.data?.location ?? ''
                                : it.data?.title ?? ''

                    const secondaryText = entityType === 'persons' ? it.data?.occupation ?? '' : ''

                    return (
                        <div
                            key={it.id}
                            onClick={() => {
                                setActiveEntityType(entityType)
                                select(sectionId, entityType, it.id)
                            }}
                            className={`px-3 py-2 cursor-pointer flex justify-between items-start gap-3 border-l-4
                                ${selected ? 'bg-blue-100' : 'hover:bg-gray-100'}
                                ${active ? 'border-red-600 bg-red-50' : 'border-transparent'}
                            `}
                        >
                            <div className="flex gap-2 overflow-hidden">
                                {editMode && (
                                    <button
                                        title="Șterge"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            deleteEntity(sectionId, entityType, it.id)
                                        }}
                                        className="text-xs text-white bg-red-500 hover:bg-red-700 px-2 py-1 rounded"
                                    >
                                        ✕
                                    </button>
                                )}

                                <div className="min-w-0 flex flex-col overflow-hidden">
                                    <div className="flex gap-2 min-w-0">
                                        {showNumber && (
                                            <span className="shrink-0 font-semibold text-gray-500">
                                                {nr}.
                                            </span>
                                        )}
                                        <span className="font-bold truncate">
                                            {entityType === 'persons' ? (primaryText || '—') : (primaryText || '—')}
                                        </span>
                                    </div>

                                    {entityType === 'persons' && (
                                        <span className="text-sm text-gray-600 truncate">
                                            {secondaryText || ''}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* ON AIR */}
                            <div className="flex items-center gap-2 shrink-0">
                                {active ? (
                                    <>
                                        <span className="text-xs font-semibold text-red-600">● ON AIR</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                clearOnAir(entityType)
                                            }}
                                            className="text-xs px-2 py-1 rounded border bg-gray-200 hover:bg-gray-300"
                                        >
                                            STOP
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setOnAir(entityType, it.id)
                                        }}
                                        className="text-xs px-2 py-1 rounded border text-red-600 border-red-500 hover:bg-red-700 hover:text-white"
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