// src/ui/components/Preview16x9.tsx
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { EntityType } from '@/features/csv-editor'
import { useScaleToFit } from '@/features/csv-editor/hooks/useScaleToFit'
import { usePreviewLayout } from '@/features/csv-editor/hooks/usePreviewLayout'

// Importăm componentele grafice
import type { GraphicsProps } from './preview-graphics/types'
import { TitleGraphics } from './preview-graphics/TitleGraphics'
import { PersonGraphics } from './preview-graphics/PersonGraphics'
import { LocationGraphics } from './preview-graphics/LocationGraphics'
import { FallbackGraphics } from './preview-graphics/FallbackGraphics'
import {HotTitleGraphics} from "@/ui/components/preview-graphics/HotTitleGraphics";
import {WaitLocationGraphics, WaitTitleGraphics} from "@/ui/components/preview-graphics/WaitGraphics";

interface PreviewProps {
    content: ReactNode
    entityType: EntityType
    measureText: string
}

// ==========================================
// 🗺️ MAPAREA ENTITĂȚILOR LA COMPONENTE
// ==========================================
const GRAPHICS_MAP: Record<string, React.FC<GraphicsProps>> = {
    titles: TitleGraphics,
    persons: PersonGraphics,
    locations: LocationGraphics,
    hotTitles: HotTitleGraphics,
    waitTitles: WaitTitleGraphics,
    waitLocations: WaitLocationGraphics,
}

// ==========================================
// ⚙️ COMPONENTA PRINCIPALĂ WRAPPER
// ==========================================
export function Preview16x9({ content, entityType, measureText }: PreviewProps) {
    const { previewRef, titleContainerRef, titleSize } = usePreviewLayout()
    const availableWidth = titleSize.width
    const isLayoutReady = availableWidth > 0

    const textForMeasure = useMemo(() => {
        const t = measureText ?? ''
        return t.toUpperCase()
    }, [measureText])

    const { textRef, scaleX } = useScaleToFit(textForMeasure, {
        deps: [entityType, availableWidth, textForMeasure],
        availableWidth,
    })

    // Selectăm componenta grafică bazată pe tipul entității
    const ActiveGraphicsComponent = GRAPHICS_MAP[entityType] || FallbackGraphics

    return (
        <div
            ref={previewRef}
            className="
                relative w-full max-w-[1000px] aspect-video
                rounded overflow-hidden mx-auto
                bg-black
                bg-center bg-no-repeat bg-contain
            "
            style={{ backgroundImage: "url('./news.png')" }}
        >
            {/* Tag-ul de debug pentru a vedea ce preview e activ */}
            <span className="absolute top-2 left-2 text-xs text-white/70 z-10 bg-black/50 px-1 rounded">
                PREVIEW – {entityType.toUpperCase()}
            </span>

            {/* Aici randăm componenta specifică și îi pasăm funcțiile de redimensionare */}
            <ActiveGraphicsComponent
                content={content}
                containerRef={titleContainerRef}
                textRef={textRef}
                scaleX={scaleX}
                isLayoutReady={isLayoutReady}
            />
        </div>
    )
}