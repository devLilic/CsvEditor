// src/features/csv-editor/hooks/useScaleToFit.ts
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

type DebugInfo = {
    containerWidth: number
    textWidth: number
}

type ScaleToFitOptions = {
    /**
     * Single Source of Truth width (recommended).
     * If provided, the hook uses this instead of container.offsetWidth.
     */
    availableWidth?: number
    deps?: readonly unknown[]
}

/**
 * Scales text horizontally (scaleX) so it fits inside a fixed-width container.
 *
 * Important architectural rule:
 * - "Layout measurement" (container widths) should come from a dedicated layout hook (ResizeObserver-based).
 * - This hook focuses on text width + final scaleX.
 *
 * Recalculates on:
 * - text changes
 * - availableWidth changes (if provided)
 * - ResizeObserver changes on text/container (fallback safety)
 * - window resize
 * - font loading events (where supported)
 */
export function useScaleToFit<
    TContainer extends HTMLElement = HTMLDivElement,
    TText extends HTMLElement = HTMLSpanElement,
>(text: string, deps?: readonly unknown[]): {
    containerRef: React.RefObject<TContainer | null>
    textRef: React.RefObject<TText | null>
    scaleX: number
    debug: DebugInfo
}
export function useScaleToFit<
    TContainer extends HTMLElement = HTMLDivElement,
    TText extends HTMLElement = HTMLSpanElement,
>(text: string, options?: ScaleToFitOptions): {
    containerRef: React.RefObject<TContainer>
    textRef: React.RefObject<TText>
    scaleX: number
    debug: DebugInfo
}
export function useScaleToFit<
    TContainer extends HTMLElement = HTMLDivElement,
    TText extends HTMLElement = HTMLSpanElement,
>(text: string, depsOrOptions: readonly unknown[] | ScaleToFitOptions = []) {
    const containerRef = useRef<TContainer>(null as unknown as TContainer)
    const textRef = useRef<TText>(null as unknown as TText)


    const [scaleX, setScaleX] = useState(1)
    const [debug, setDebug] = useState<DebugInfo>({ containerWidth: 0, textWidth: 0 })

    // @ts-ignore
    const options: ScaleToFitOptions = (() => {
        if (Array.isArray(depsOrOptions)) return { deps: depsOrOptions }
        return depsOrOptions ?? {}
    })()

    const deps = options.deps ?? []
    const availableWidth = options.availableWidth

    // Keep deps stable if caller passes a literal array
    const depsKey = useMemo(() => deps, deps)

    const measure = useCallback(() => {
        const container = containerRef.current
        const textEl = textRef.current

        // If we have SSoT width, we can still proceed even if containerRef is missing.
        if (!textEl) {
            setScaleX(1)
            return
        }

        const raw = text ?? ''
        if (!raw.trim()) {
            setScaleX(1)
            setDebug({ containerWidth: availableWidth ?? container?.offsetWidth ?? 0, textWidth: 0 })
            return
        }

        const containerWidth = (() => {
            if (typeof availableWidth === 'number' && Number.isFinite(availableWidth)) return availableWidth
            return container?.offsetWidth ?? 0
        })()

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
    }, [text, availableWidth])

    useLayoutEffect(() => {
        // Measure after layout (and allow initial layout to settle)
        let raf = 0
        const schedule = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(measure)
        }

        schedule()

        const onResize = () => schedule()
        window.addEventListener('resize', onResize)

        // Observe actual DOM changes as a safety net (layout hook should be primary)
        const ro = new ResizeObserver(() => schedule())
        if (containerRef.current) ro.observe(containerRef.current)
        if (textRef.current) ro.observe(textRef.current)

        // Recalculate on font load changes (where supported)
        const fonts = (document as any).fonts as FontFaceSet | undefined
        const onFontsDone = () => schedule()
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
    }, [measure, depsKey, availableWidth])

    return { containerRef, textRef, scaleX, debug }

}
