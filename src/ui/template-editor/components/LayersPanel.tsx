// src/ui/template-editor/components/LayersPanel.tsx

import { useRef, useState } from 'react'
import { useTemplateEditorContext } from '@/features/template-editor'

export function LayersPanel() {
    const {
        template,
        selectedLayerId,
        selectLayer,
        reorderLayer,
        deleteLayer
    } = useTemplateEditorContext()

    const layers = template.layers

    // DOAR UI state temporar (drag intent) — permis
    const draggingIdRef = useRef<string | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

    const onDragStart = (id: string) => {
        draggingIdRef.current = id
    }

    const onDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault() // NECESAR pentru drop
        setDragOverIndex(index)
    }

    const onDrop = (index: number) => {
        const draggingId = draggingIdRef.current
        if (!draggingId) return

        reorderLayer(draggingId, index)

        draggingIdRef.current = null
        setDragOverIndex(null)
    }

    const onDragEnd = () => {
        draggingIdRef.current = null
        setDragOverIndex(null)
    }

    return (
        <div className="h-full flex flex-col">
            <div className="px-3 py-2 text-sm font-semibold border-b bg-gray-50">
                Layers (drag to reorder)
            </div>

            <div className="flex-1 overflow-auto">
                {layers.map((layer, index) => {
                    const isSelected = layer.id === selectedLayerId
                    const isDragOver = dragOverIndex === index

                    return (
                        <div
                            key={layer.id}
                            draggable
                            onDragStart={() => onDragStart(layer.id)}
                            onDragOver={(e) => onDragOver(e, index)}
                            onDrop={() => onDrop(index)}
                            onDragEnd={onDragEnd}
                            onClick={() => selectLayer(layer.id)}
                            className={`
                                px-3 py-2 text-sm cursor-pointer flex items-center justify-between gap-2 border-b
                                ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}
                                ${isDragOver ? 'ring-2 ring-blue-400' : ''}
                            `}
                        >
                            <div className="min-w-0 flex items-center gap-2">
                                <span className="text-xs px-1.5 py-0.5 rounded border bg-white">
                                    z:{layer.zIndex}
                                </span>

                                <span className="truncate font-medium">
                                    {layer.type === 'rectangle'
                                        ? 'Rectangle'
                                        : 'Text'}
                                </span>

                                {isSelected && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white">
                                        Selected
                                    </span>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deleteLayer(layer.id)
                                    }}
                                    className="text-xs px-2 py-0.5 rounded bg-red-500 text-white hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <span className="text-gray-400 cursor-grab">⋮⋮</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
