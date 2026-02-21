// src/ui/components/Preview16x9.tsx
import type {ReactNode} from 'react'
import {useMemo, useState} from 'react'
import type {EntityType} from '@/features/csv-editor'
import {useScaleToFit} from '@/features/csv-editor/hooks/useScaleToFit'
import {usePreviewLayout} from '@/features/csv-editor/hooks/usePreviewLayout'

interface PreviewProps {
    content: ReactNode
    entityType: EntityType

    /**
     * IMPORTANT:
     * Text simplu folosit DOAR pentru măsurare în useScaleToFit.
     * (content poate fi JSX -> altfel toPlainText devine '' și scaleX nu se recalculează)
     */
    measureText: string
}

export function Preview16x9({content, entityType, measureText}: PreviewProps) {
    // ✅ Single Source of Truth for layout (măsurat real, DPI/monitor safe)
    const {previewRef, titleContainerRef, titleSize} = usePreviewLayout()
    const availableWidth = titleSize.width
    const isLayoutReady = availableWidth > 0

    /**
     * ✅ UI TUNING STATE (local, fără logic)
     * Modifici rapid poziția/dimensiunea containerului și stilul textului.
     */
    const [tuning] = useState(() => ({
        // container positioning / sizing (procente față de preview)
        leftPct: 5,
        bottomPct: 11.8,
        widthPct: 73.5,

        // typography
        fontFamily: 'Arial',
        fontSizePx: 32, // pornește cu ce corespunde template-ului tău
        trackingEm: -0.006,

        // optional: debug
        showDebugBorder: false,
    }))

    // ⚠️ Normalize measure text (uppercase preview rule)
    const textForMeasure = useMemo(() => {
        const t = measureText ?? ''
        return t.toUpperCase()
    }, [measureText])

    // ✅ scaleX depends ONLY on availableWidth + real text width
    const {textRef, scaleX} = useScaleToFit(textForMeasure, {
        deps: [entityType, availableWidth, textForMeasure],
        availableWidth,
    })

    return (
        <div
            ref={previewRef}
            className="
                relative w-full max-w-[1000px] aspect-video
                rounded overflow-hidden mx-auto
                bg-black
                bg-center bg-no-repeat bg-contain
            "
            style={{backgroundImage: "url('./news.png')"}}
        >
            <span className="absolute top-2 left-2 text-xs text-white/70">
                PREVIEW – {entityType.toUpperCase()}
            </span>

            {/* Title container (SSoT: width is measured via ref; UI tuning only changes placement/size) */}
            <div
                ref={titleContainerRef}
                className={`
                    absolute
                    overflow-hidden
                    whitespace-nowrap
                    text-blue-900
                    font-bold
                    ${tuning.showDebugBorder ? 'ring-2 ring-fuchsia-500' : ''}
                `}
                style={{
                    left: `${tuning.leftPct}%`,
                    bottom: `${tuning.bottomPct}%`,
                    width: `${tuning.widthPct}%`,
                    fontFamily: tuning.fontFamily,
                    letterSpacing: `${tuning.trackingEm}em`,
                }}>
                {/* scaleX ONLY on text element */}
                <span
                    ref={textRef}
                    className="inline-block origin-left leading-none"
                    style={{
                        transform: `scaleX(${scaleX})`,
                        opacity: isLayoutReady ? 1 : 0, // anti-jump
                        fontSize: `${tuning.fontSizePx}px`,
                    }}>
                    {content ?? <span className="opacity-40">Preview</span>}
                </span>
            </div>
        </div>
    )
}
