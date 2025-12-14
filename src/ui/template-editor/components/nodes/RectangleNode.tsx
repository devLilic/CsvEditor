// src/ui/template-editor/components/nodes/RectangleNode.tsx

import { Rect } from 'react-konva'
import type { RectangleLayer } from '@/features/template-editor/domain/template.types'

export function RectangleNode({
                                  layer,
                                  selected,
                                  onSelect,
                                  onMove,
                              }: {
    layer: RectangleLayer
    selected: boolean
    onSelect: () => void
    onMove: (x: number, y: number) => void
}) {
    const fill =
        layer.fill.type === 'solid'
            ? layer.fill.value
            : layer.fill.value.stops[0]?.color ?? '#000'

    return (
        <Rect
            x={layer.x}
            y={layer.y}
            width={layer.width}
            height={layer.height}
            fill={fill}
            draggable
            onClick={onSelect}
            onTap={onSelect}
            onDragEnd={(e) => {
                onMove(e.target.x(), e.target.y())
            }}
            stroke={selected ? '#3b82f6' : undefined}
            strokeWidth={selected ? 2 : 0}
        />
    )
}
