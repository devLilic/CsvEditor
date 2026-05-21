// src/ui/components/preview-graphics/TitleGraphics.tsx
import type { GraphicsProps } from './types'

// ⚙️ CONFIGURAȚIE LOCALĂ
const CONFIG = {
    leftPct: 31,
    bottomPct: 11.4,
    widthPct: 64,
    color: '#000',
    fontSizePx: 36,
    trackingEm: -0.08,
    fontWeight: 'bold',
    lineHeight: 1.1, // ✅ Adăugat
}

export const TitleGraphics = ({ content, containerRef, textRef, scaleX, isLayoutReady }: GraphicsProps) => (
    <div
        ref={containerRef}
        className="absolute overflow-hidden whitespace-nowrap border border-1"
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