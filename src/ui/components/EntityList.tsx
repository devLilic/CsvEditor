// src/ui/components/EntityList.tsx
import {
    useEntities,
    useSelectedEntity,
    useActiveEntityType,
    useOnAir,
} from '@/features/csv-editor'
import { EmptyState } from './common/EmptyState'
import { useEditMode } from '@/ui/context/EditModeContext'
import type { EntityType } from '@/features/csv-editor'

export function EntityList() {
    const { activeSectionId, activeSection, getBlockItems, deleteEntity } =
        useEntities()

    const { activeEntityType } = useActiveEntityType()
    const { select, isSelected } = useSelectedEntity()
    const { isOnAir, setOnAir, clearOnAir } = useOnAir()
    const { editMode } = useEditMode()

    const sectionId = activeSectionId ?? activeSection?.id ?? ''
    if (!sectionId) {
        return <EmptyState text="Nu există secțiune activă." />
    }

    const items = getBlockItems(sectionId, activeEntityType)

    if (!items.length) {
        return <EmptyState text="Nu există elemente în această secțiune." />
    }

    let titleNr = 0
    const showNr = activeEntityType === 'titles'

    return (
        <div className="h-full min-h-0 overflow-y-auto">
            <div className="bg-white rounded border">
                {items.map((item: any) => {
                    const selected = isSelected(
                        sectionId,
                        item.entityType as EntityType,
                        item.id
                    )

                    const active = isOnAir(item.entityType, item.id)

                    const isTitle = item.entityType === 'titles'
                    const isPersons = item.entityType === 'persons'

                    const displayNr = isTitle ? ++titleNr : null

                    const mainText =
                        isPersons
                            ? item.data?.name ?? ''
                            : item.data?.title ?? item.data?.location ?? ''

                    const subText =
                        isPersons ? item.data?.occupation ?? '' : ''

                    return (
                        <div
                            key={item.id}
                            onClick={() =>
                                select(sectionId, item.entityType, item.id)
                            }
                            className={`px-3 py-2 cursor-pointer flex justify-between items-center gap-3 border-b border-l-4
                                ${
                                selected
                                    ? 'bg-blue-100 border-l-blue-600'
                                    : 'hover:bg-gray-100 border-l-transparent'
                            }
                                ${
                                active
                                    ? 'border-l-red-600 bg-red-50'
                                    : ''
                            }
                            `}
                        >
                            <div className="flex gap-2 overflow-hidden min-w-0">
                                {editMode && (
                                    <button
                                        title="Șterge"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            deleteEntity(
                                                sectionId,
                                                item.entityType,
                                                item.id
                                            )
                                        }}
                                        className="text-xs text-white bg-red-500 hover:bg-red-800 border px-2 rounded border-red-700"
                                    >
                                        ✕
                                    </button>
                                )}

                                <div className="min-w-0 overflow-hidden">
                                    {showNr && displayNr !== null ? (
                                        <div className="flex gap-2 min-w-0">
                                            <span className="shrink-0 font-semibold text-gray-500">
                                                {displayNr}.
                                            </span>
                                            <span className="truncate font-bold">
                                                {mainText}
                                            </span>
                                        </div>
                                    ) : isPersons ? (
                                        <div className="flex flex-col min-w-0">
                                            <span className="truncate font-bold">
                                                {mainText}
                                            </span>
                                            <span className="truncate text-sm text-gray-600">
                                                {subText}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="truncate font-bold">
                                            {mainText}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* -------- ON AIR CONTROL -------- */}
                            <div className="flex items-center gap-2 shrink-0">
                                {active ? (
                                    <>
                                        <span className="text-xs font-semibold text-red-600">
                                            ● ON AIR
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                clearOnAir(
                                                    item.entityType
                                                )
                                            }}
                                            className="text-xs px-2 py-1 rounded border border-gray-500 bg-gray-200 hover:bg-gray-300"
                                        >
                                            STOP
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setOnAir(
                                                item.entityType,
                                                item.id
                                            )
                                        }}
                                        className="text-xs px-2 py-1 rounded border text-red-500 border-red-500 hover:text-white hover:bg-red-700"
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