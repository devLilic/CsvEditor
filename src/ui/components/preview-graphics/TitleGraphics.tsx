// src/ui/components/preview-graphics/TitleGraphics.tsx
import type { GraphicsProps } from './types'

// ⚙️ CONFIGURAȚIE LOCALĂ
const CONFIG = {
    leftPct: 5,
    bottomPct: 11.8,
    widthPct: 73.5,
    color: '#1e3a8a',
    fontSizePx: 32,
    trackingEm: -0.006,
    fontWeight: 'bold',
    lineHeight: 1, // ✅ Adăugat
}

export const TitleGraphics = ({ content, containerRef, textRef, scaleX, isLayoutReady }: GraphicsProps) => (
    <div
        ref={containerRef}
        className="absolute overflow-hidden whitespace-nowrap"
        style={{
            left: `${CONFIG.leftPct}%`,
            bottom: `${CONFIG.bottomPct}%`,
            width: `${CONFIG.widthPct}%`,
            color: CONFIG.color,
            fontWeight: CONFIG.fontWeight,
            textAlign: 'left',
        }}
    >
        <span
            ref={textRef}
            className="inline-block origin-left"
            style={{
                transform: `scaleX(${scaleX})`,
                opacity: isLayoutReady ? 1 : 0,
                fontSize: `${CONFIG.fontSizePx}px`,
                letterSpacing: `${CONFIG.trackingEm}em`,
                lineHeight: CONFIG.lineHeight, // ✅ Aplicat
            }}
        >
            {content ?? <span className="opacity-40">Preview Title</span>}
        </span>
    </div>
)