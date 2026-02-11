// src/ui/components/Preview16x9.tsx
import type { ReactNode } from 'react'
import type { EntityType } from '@/features/csv-editor'
import {useScaleToFit} from "@/features/csv-editor/hooks/useScaleToFit";

interface PreviewProps {
    content: ReactNode
    entityType: EntityType
}

function toPlainText(node: ReactNode): string {
    if (typeof node === 'string') return node
    if (typeof node === 'number') return String(node)
    // For complex JSX, we can’t reliably measure rendered width from data alone.
    // In that case, keep scaleX=1 (no scaling) and let the UI pass a plain string.
    return ''
}

export function Preview16x9({ content, entityType }: PreviewProps) {
    const textForMeasure = toPlainText(content)
    const { containerRef, textRef, scaleX } = useScaleToFit(textForMeasure, [entityType])

    return (
        <div
            className="relative w-full max-w-[1000px] aspect-video bg-black rounded text-[32px] leading-9 overflow-x-auto flex mx-auto items-center justify-center bg-cover"
            style={{ backgroundImage: "url('../public/news.png')" }}
        >
      <span className="absolute top-2 left-2 text-xs text-white opacity-60">
        PREVIEW – {entityType.toUpperCase()}
      </span>

            <div className="w-full h-[24%] bg-white absolute bottom-0 left-0 opacity-75" />

            {/* Fixed container; only the text scales on X */}
            <div
                ref={containerRef}
                className="w-[79.8%] px-1 text-blue-900 mr-4 border text-[2rem] absolute bottom-[12%] left-[5%] font-bold -tracking-[0.006em]"
                style={{ fontFamily: 'Arial' }}
            >
        <span
            ref={textRef}
            style={{
                display: 'inline-block',
                transform: `scaleX(${scaleX})`,
                transformOrigin: 'left',
                whiteSpace: 'nowrap',
            }}
        >
          {content ?? <span className="opacity-40">Preview</span>}
        </span>
            </div>
        </div>
    )
}
