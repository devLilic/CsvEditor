// src/ui/template-editor/components/TemplateCanvas.tsx

import { Stage, Layer as KonvaLayer } from 'react-konva'
import { useTemplateEditorContext } from '@/features/template-editor'
import {RectangleNode} from "@/ui/template-editor/components/nodes/RectangleNode";
import {TextNode} from "@/ui/template-editor/components/nodes/TextNode";

export function TemplateCanvas() {
    const {
        template,
        selectedLayerId,
        selectLayer,
        moveLayer,
    } = useTemplateEditorContext()

    return (
        <Stage
            width={template.canvas.width}
            height={template.canvas.height}
            style={{
                background:
                    template.canvas.background.type === 'color'
                        ? template.canvas.background.value
                        : `url(${template.canvas.background.value}) center / cover no-repeat`,
            }}
        >
            <KonvaLayer>
                {template.layers.map(layer => {
                    if (!layer.visible) return null

                    if (layer.type === 'rectangle') {
                        return (
                            <RectangleNode
                                key={layer.id}
                                layer={layer}
                                selected={layer.id === selectedLayerId}
                                onSelect={() => selectLayer(layer.id)}
                                onMove={(x, y) => moveLayer(layer.id, x, y)}
                            />
                        )
                    }

                    if (layer.type === 'text') {
                        return (
                            <TextNode
                                key={layer.id}
                                layer={layer}
                                selected={layer.id === selectedLayerId}
                                onSelect={() => selectLayer(layer.id)}
                                onMove={(x, y) =>
                                    moveLayer(layer.id, x, y)
                                }
                            />
                        )
                    }
                    return null
                })}

            </KonvaLayer>
        </Stage>
    )
}
