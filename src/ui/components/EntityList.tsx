// src/ui/components/EntityList.tsx
import {
    useEntities,
    useSelectedEntity,
    useActiveEntityType,
    useOnAir,
} from '@/features/csv-editor'
import {EmptyState} from './common/EmptyState'
import {useEditMode} from "@/ui/context/EditModeContext";

export function EntityList() {
    const {getEntities, deleteEntity} = useEntities()
    const {select, isSelected} = useSelectedEntity()
    const {activeEntityType} = useActiveEntityType()
    const {isOnAir, setOnAir, clearOnAir} = useOnAir()
    const {editMode} = useEditMode()

    const items = getEntities<any>(activeEntityType)

    if (items.length === 0) {
        return (
            <EmptyState text="Nu există elemente în această secțiune."/>
        )
    }

    return (
        <div className="bg-white rounded border overflow-y-auto">
            {items.map((item) => {
                const active = isOnAir(activeEntityType, item.id)

                return (
                    <div
                        key={item.id}
                        onClick={() => select(activeEntityType, item.id)}
                        className={`px-3 py-2 cursor-pointer flex justify-between items-center gap-3
              ${isSelected(activeEntityType, item.id) ? 'bg-blue-100' : 'hover:bg-gray-100'}
              ${active ? 'border-l-4 border-red-600 bg-red-50' : ''}
            `}
                    >
                        <div className="flex gap-2 overflow-hidden">
                            {editMode && (
                                <button
                                    title="Șterge"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deleteEntity(activeEntityType, item.id)
                                    }}
                                    className="text-xs text-white bg-red-500 hover:bg-red-800 border px-2  rounded border-red-700"
                                >
                                    ✕
                                </button>
                            )}

                            {/* TEXT */}
                            <div className="flex flex-col overflow-hidden">
                                {activeEntityType === 'persons' ? (
                                    <>
                                  <span className="font-medium truncate">
                                    {item.name}
                                  </span>
                                        <span className="text-sm text-gray-600 truncate">
                                    {item.occupation}
                                  </span>
                                    </>
                                ) : (
                                    <span className="truncate">
                  {item.title || item.location}
                </span>
                                )}
                            </div>
                        </div>

                        {/* ON AIR CONTROL */}
                        <div className="flex items-center gap-2 shrink-0">
                            {active ? (
                                <>
                  <span className="text-xs font-semibold text-red-600">
                    ● ON AIR
                  </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            clearOnAir(activeEntityType)
                                        }}
                                        className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                                    >
                                        STOP
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setOnAir(activeEntityType, item.id)
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
    )
}
