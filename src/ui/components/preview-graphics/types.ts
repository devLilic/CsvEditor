// src/ui/components/preview-graphics/types.ts
import type { ReactNode } from 'react'

export interface GraphicsProps {
    content: ReactNode
    containerRef: React.RefObject<HTMLDivElement>
    textRef: React.RefObject<HTMLSpanElement>
    scaleX: number
    isLayoutReady: boolean
}