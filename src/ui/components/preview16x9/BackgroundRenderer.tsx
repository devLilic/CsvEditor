import type { BroadcastBackground } from '@/shared/preview/templateContract'

type BackgroundRendererProps = {
    background?: BroadcastBackground
}

export function BackgroundRenderer({ background }: BackgroundRendererProps) {
    if (!background) {
        return (
            <div
                aria-hidden="true"
                data-preview-background="fallback"
                className="absolute inset-0"
                style={{ backgroundColor: '#000000' }}
            />
        )
    }

    if (background.type === 'color') {
        return (
            <div
                aria-hidden="true"
                data-preview-background="color"
                className="absolute inset-0"
                style={{ backgroundColor: background.value || '#000000' }}
            />
        )
    }

    return (
        <img
            aria-hidden="true"
            data-preview-background="image"
            className="absolute inset-0 h-full w-full"
            src={background.value}
            style={{ objectFit: background.objectFit ?? 'cover' }}
            alt=""
        />
    )
}
