// src/ui/template-editor/components/nodes/TextNode.tsx

import { Text } from 'react-konva'
import type { TextLayer } from '@/features/template-editor/domain/template.types'

export function TextNode({
                             layer,
                             selected,
                             onSelect,
                             onMove,
                         }: {
    layer: TextLayer
    selected: boolean
    onSelect: () => void
    onMove: (x: number, y: number) => void
}) {
    return (
        <Text
            x={layer.x}
            y={layer.y}
            width={layer.width}
            height={layer.height}
            text={layer.binding || 'TEXT'}
            fontFamily={layer.textStyle.fontFamily}
            fontSize={layer.textStyle.fontSize}
            fontStyle={layer.textStyle.fontWeight >= 600 ? 'bold' : 'normal'}
            fill={layer.textStyle.color}
            align={layer.textStyle.align}
            draggable
            onClick={onSelect}
            onTap={onSelect}
            onDragEnd={(e) => {
                onMove(e.target.x(), e.target.y())
            }}
            stroke={selected ? '#3b82f6' : undefined}
            strokeWidth={selected ? 1 : 0}
        />
    )
}
