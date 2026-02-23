// src/ui/components/preview-graphics/FallbackGraphics.tsx
import type { GraphicsProps } from './types'

export const FallbackGraphics = ({ content, containerRef, textRef, scaleX, isLayoutReady }: GraphicsProps) => (
    <div ref={containerRef} className="absolute left-[5%] bottom-[5%] w-[50%] bg-black/50 text-white p-2">
         <span ref={textRef} className="inline-block origin-left" style={{ transform: `scaleX(${scaleX})`, opacity: isLayoutReady ? 1 : 0 }}>
            {content}
         </span>
    </div>
)