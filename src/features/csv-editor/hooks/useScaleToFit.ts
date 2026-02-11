// src/hooks/useScaleToFit.ts
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

type DebugInfo = {
    containerWidth: number
    textWidth: number
}

/**
 * Scales text horizontally (scaleX) so it fits inside a fixed-width container.
 * - Measures: text.scrollWidth vs container.offsetWidth
 * - scaleX = min(1, containerWidth / textWidth)
 * - Recalculates on: text change, window resize, ResizeObserver changes, and font loading.
 */
export function useScaleToFit<
    TContainer extends HTMLElement = HTMLDivElement,
    TText extends HTMLElement = HTMLSpanElement,
>(text: string, deps: readonly unknown[] = []) {
    const containerRef = useRef<TContainer | null>(null)
    const textRef = useRef<TText | null>(null)

    const [scaleX, setScaleX] = useState(1)
    const [debug, setDebug] = useState<DebugInfo>({ containerWidth: 0, textWidth: 0 })

    // Keep deps stable if caller passes a literal array
    const depsKey = useMemo(() => deps, deps)

    const measure = useCallback(() => {
        const container = containerRef.current
        const textEl = textRef.current

        if (!container || !textEl) {
            setScaleX(1)
            return
        }

        const raw = text ?? ''
        if (!raw.trim()) {
            setScaleX(1)
            setDebug({ containerWidth: container.offsetWidth, textWidth: 0 })
            return
        }

        const containerWidth = container.offsetWidth
        const textWidth = textEl.scrollWidth

        if (containerWidth <= 0 || textWidth <= 0) {
            setScaleX(1)
            setDebug({ containerWidth, textWidth })
            return
        }

        const next = Math.min(1, containerWidth / textWidth)

        // Avoid jitter / re-render loops from tiny float diffs
        setScaleX((prev) => {
            if (Math.abs(prev - next) < 0.001) return prev
            return next
        })
        setDebug({ containerWidth, textWidth })
    }, [text])

    useLayoutEffect(() => {
        // Measure after layout
        let raf = requestAnimationFrame(measure)

        const onResize = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(measure)
        }

        window.addEventListener('resize', onResize)

        // ResizeObserver catches container/text width changes (including font-size changes)
        const ro = new ResizeObserver(() => onResize())
        if (containerRef.current) ro.observe(containerRef.current)
        if (textRef.current) ro.observe(textRef.current)

        // Recalculate on font load changes (where supported)
        const fonts = (document as any).fonts as FontFaceSet | undefined
        const onFontsDone = () => onResize()
        fonts?.addEventListener?.('loadingdone', onFontsDone)
        fonts?.addEventListener?.('loadingerror', onFontsDone)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', onResize)
            ro.disconnect()
            fonts?.removeEventListener?.('loadingdone', onFontsDone)
            fonts?.removeEventListener?.('loadingerror', onFontsDone)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [measure, depsKey])

    return { containerRef, textRef, scaleX, debug }
}
