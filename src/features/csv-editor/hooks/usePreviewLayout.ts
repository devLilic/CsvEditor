// src/features/csv-editor/hooks/usePreviewLayout.ts
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

type Size = { width: number; height: number }
type Debug = {
    preview: Size
    titleContainer: Size
}

/**
 * Single Source of Truth for preview layout sizes.
 *
 * Measures:
 * - preview width/height (root container)
 * - title container bounds (the block that contains the title text)
 *
 * Recalculates on:
 * - mount (with stabilization)
 * - ResizeObserver (preview + title container)
 * - window resize
 * - visualViewport resize (DPI / scaling / monitor changes)
 *
 * Safe against loops:
 * - rAF throttling
 * - ignores insignificant deltas (< 0.5px)
 */
export function usePreviewLayout<
    TPreview extends HTMLElement = HTMLDivElement,
    TTitle extends HTMLElement = HTMLDivElement,
>() {
    const previewRef = useRef<TPreview | null>(null)
    const titleContainerRef = useRef<TTitle | null>(null)

    const [previewSize, setPreviewSize] = useState<Size>({ width: 0, height: 0 })
    const [titleSize, setTitleSize] = useState<Size>({ width: 0, height: 0 })

    const updateIfChanged = (setter: (s: Size) => void, prev: Size, next: Size) => {
        const dw = Math.abs(prev.width - next.width)
        const dh = Math.abs(prev.height - next.height)
        if (dw < 0.5 && dh < 0.5) return
        setter(next)
    }

    const measure = useCallback(() => {
        const previewEl = previewRef.current
        const titleEl = titleContainerRef.current

        const p: Size = previewEl
            ? { width: previewEl.getBoundingClientRect().width, height: previewEl.getBoundingClientRect().height }
            : { width: 0, height: 0 }

        const t: Size = titleEl
            ? { width: titleEl.getBoundingClientRect().width, height: titleEl.getBoundingClientRect().height }
            : { width: 0, height: 0 }

        setPreviewSize((prev) => {
            updateIfChanged(setPreviewSize, prev, p)
            return prev
        })
        setTitleSize((prev) => {
            updateIfChanged(setTitleSize, prev, t)
            return prev
        })
        // Note: we intentionally avoid returning new objects from setState callbacks to prevent loops.
    }, [])

    useLayoutEffect(() => {
        let raf = 0
        const schedule = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(() => {
                measure()
                // Stabilization: one extra frame helps when first layout is 0 or not final
                requestAnimationFrame(measure)
            })
        }

        schedule()

        const ro = new ResizeObserver(() => schedule())
        if (previewRef.current) ro.observe(previewRef.current)
        if (titleContainerRef.current) ro.observe(titleContainerRef.current)

        const onWindowResize = () => schedule()
        window.addEventListener('resize', onWindowResize)

        const vv = window.visualViewport
        const onVVResize = () => schedule()
        vv?.addEventListener?.('resize', onVVResize)

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            window.removeEventListener('resize', onWindowResize)
            vv?.removeEventListener?.('resize', onVVResize)
        }
    }, [measure])

    const debug: Debug = {
        preview: previewSize,
        titleContainer: titleSize,
    }

    return {
        previewRef,
        titleContainerRef,
        previewSize,
        titleSize,
        debug,
    }
}
