// src/ui/components/preview-graphics/HotTitleGraphics.tsx
import type { GraphicsProps } from './types'

// ⚙️ CONFIGURAȚIE LOCALĂ: Ajustează blocul roșu (Ultima Oră)
const CONFIG = {
    rightPct: 21.4,         // Aliniat la stânga
    btmPct: 19.6,          // Sus pe ecran
    widthPct: 15,       // Lățimea casetei
    // backgroundColor: 'transparent', // Roșu (Tailwind red-600)
    backgroundColor: '#dc2626', // Roșu (Tailwind red-600)
    textColor: 'white', // Text alb
    padding: '0',// Spațiere interioară
    borderRadius: '0',// Colțuri ușor rotunjite (pune '0' pentru pătrat perfect)
    fontSizePx: 15,     // Mărimea fontului
    fontWeight: 'bold', // Font îngroșat
    lineHeight: 0.9,    // Spațiere pe verticală
}

export const HotTitleGraphics = ({ content, containerRef, textRef, scaleX, isLayoutReady }: GraphicsProps) => (
    <div
        ref={containerRef}
        className="absolute whitespace-nowrap"
        style={{
            right: `${CONFIG.rightPct}%`,
            bottom: `${CONFIG.btmPct}%`,
            width: `${CONFIG.widthPct}%`,
            backgroundColor: CONFIG.backgroundColor,
            color: CONFIG.textColor,
            padding: CONFIG.padding,
            borderRadius: CONFIG.borderRadius,
            fontWeight: CONFIG.fontWeight,
            textAlign: 'center', // Aliniem textul pe centru în caseta roșie
        }}
    >
        <span
            ref={textRef}
            className="inline-block origin-left w-full mx-[2px]" // Originea la centru pentru o scalare simetrică
            style={{
                transform: `scaleX(${scaleX})`,
                opacity: isLayoutReady ? 1 : 0,
                fontSize: `${CONFIG.fontSizePx}px`,
                lineHeight: CONFIG.lineHeight,
                letterSpacing: '0.05em', // Puțin spațiu între litere pentru un aspect de Breaking News
            }}
        >
            {content ?? <span className="opacity-40">ULTIMA ORĂ</span>}
        </span>
    </div>
)