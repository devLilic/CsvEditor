// src/ui/template-editor/components/nodes/KonvaImageNode.tsx

import { Image as KonvaImage } from 'react-konva'
import useImage from 'use-image'

export function KonvaImageNode({ src }: { src: string }) {
    const [image] = useImage(src)
    if (!image) return null

    return (
        <KonvaImage
            image={image}
            x={0}
            y={0}
            width={image.width}
            height={image.height}
            listening={false}
        />
    )
}
