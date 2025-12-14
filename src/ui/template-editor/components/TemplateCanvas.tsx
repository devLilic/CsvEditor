// src/ui/template-editor/components/TemplateCanvas.tsx

import { Stage, Layer as KonvaLayer, Rect, Image as KonvaImage } from 'react-konva'
import { useTemplateEditor } from '@/features/template-editor'
import useImage from 'use-image'

export function TemplateCanvas() {

    const {
        template,
        selectedLayerId,
        selectLayer,
        moveLayer,
    } = useTemplateEditor()

    const { canvas, layers } = template
    console.log('LAYERS', layers)

    const [bgImage] =
        canvas.background.type === 'image'
            ? useImage(canvas.background.value)
            : [null]

    return (
        <Stage
            width={canvas.width}
            height={canvas.height}
            onMouseDown={(e) => {
                if (e.target === e.target.getStage()) {
                    selectLayer(null)
                }
            }}
        >
            <KonvaLayer>
                {/* BACKGROUND COLOR */}
                {canvas.background.type === 'color' && (
                    <Rect
                        x={0}
                        y={0}
                        width={canvas.width}
                        height={canvas.height}
                        fill={canvas.background.value}
                        listening={false}
                    />
                )}

                {/* BACKGROUND IMAGE */}
                {canvas.background.type === 'image' && bgImage && (
                    <KonvaImage
                        image={bgImage}
                        x={0}
                        y={0}
                        width={canvas.width}
                        height={canvas.height}
                        listening={false}
                    />
                )}

                {/* LAYERS */}
                {layers.map((layer) => {
                    if (!layer.visible) return null
                    // layer rendering (rectangle / text) rămâne neschimbat
                    return null
                })}
            </KonvaLayer>
        </Stage>
    )
}
