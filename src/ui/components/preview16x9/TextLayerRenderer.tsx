import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { BroadcastTextLayer } from '@/shared/preview/templateContract'
import { calculateTextScale, resolveLayerText } from '@/shared/preview/previewMath'

type TextLayerRendererProps = {
    layer: BroadcastTextLayer
    data?: Record<string, unknown>
    sampleData?: Record<string, unknown>
}

export function TextLayerRenderer({ layer, data, sampleData }: TextLayerRendererProps) {
    const textRef = useRef<HTMLSpanElement | null>(null)
    const [scaleX, setScaleX] = useState(1)
    const text = resolveLayerText({
        fieldId: layer.fieldId,
        data,
        sampleData,
        fieldDefaultValue: layer.fieldDefaultValue,
        fallbackText: layer.fallbackText,
    })
    const displayText = layer.textStyle.transform === 'uppercase' ? text.toUpperCase() : text
    const fitEnabled = layer.fitInBox !== false
    const transformOrigin = layer.textStyle.align === 'right'
        ? 'right center'
        : layer.textStyle.align === 'center'
            ? 'center center'
            : 'left center'

    const measureText = useCallback(() => {
        if (!fitEnabled) {
            setScaleX(1)
            return
        }

        const textElement = textRef.current
        if (!textElement) return

        const nextScale = calculateTextScale({
            textWidth: textElement.scrollWidth,
            boxWidth: layer.width,
            minScaleX: layer.minScaleX,
        })

        setScaleX((prev) => (Math.abs(prev - nextScale) < 0.001 ? prev : nextScale))
    }, [fitEnabled, layer.minScaleX, layer.width])

    useLayoutEffect(() => {
        let raf = 0
        const schedule = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(measureText)
        }

        schedule()

        const textElement = textRef.current
        const observer = new ResizeObserver(schedule)
        if (textElement) observer.observe(textElement)

        const fonts = (document as any).fonts as FontFaceSet | undefined
        fonts?.addEventListener?.('loadingdone', schedule)
        fonts?.addEventListener?.('loadingerror', schedule)

        return () => {
            cancelAnimationFrame(raf)
            observer.disconnect()
            fonts?.removeEventListener?.('loadingdone', schedule)
            fonts?.removeEventListener?.('loadingerror', schedule)
        }
    }, [displayText, measureText])

    return (
        <div
            data-layer-id={layer.id}
            style={{
                position: 'absolute',
                left: layer.x,
                top: layer.y,
                width: layer.width,
                height: layer.height,
                opacity: layer.opacity,
                transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
                overflow: 'hidden',
                color: layer.textStyle.color,
                fontFamily: layer.textStyle.fontFamily,
                fontSize: layer.textStyle.fontSize,
                fontWeight: layer.textStyle.fontWeight,
                textAlign: layer.textStyle.align,
            }}
        >
            <span
                ref={textRef}
                style={{
                    display: 'inline-block',
                    maxWidth: 'none',
                    whiteSpace: 'nowrap',
                    transform: `scaleX(${scaleX})`,
                    transformOrigin,
                }}
            >
                {displayText}
            </span>
        </div>
    )
}
