import type { BroadcastImageLayer } from '@/shared/preview/templateContract'

type ImageLayerRendererProps = {
    layer: BroadcastImageLayer
}

export function ImageLayerRenderer({ layer }: ImageLayerRendererProps) {
    const objectFit = layer.objectFit ?? 'contain'

    if (!layer.src.trim()) {
        return (
            <div
                data-layer-id={layer.id}
                data-empty-image-layer="true"
                style={{
                    position: 'absolute',
                    left: layer.x,
                    top: layer.y,
                    width: layer.width,
                    height: layer.height,
                    opacity: layer.opacity,
                    transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
                    overflow: 'hidden',
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                }}
            />
        )
    }

    return (
        <img
            data-layer-id={layer.id}
            src={layer.src}
            alt=""
            style={{
                position: 'absolute',
                left: layer.x,
                top: layer.y,
                width: layer.width,
                height: layer.height,
                opacity: layer.opacity,
                transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
                objectFit,
                display: 'block',
                overflow: 'hidden',
            }}
        />
    )
}
