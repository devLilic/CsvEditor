// src/ui/components/preview-graphics/LocationGraphics.tsx
import type { GraphicsProps } from './types'

// ⚙️ CONFIGURAȚIE LOCALĂ: Ajustată pentru locația de lângă TELEJURNAL MOLDOVA
const CONFIG = {
    leftPct: 26.5,
    bottomPct: 21,
    widthPct: 20,
    backgroundColor: 'transparent',
    textColor: 'black',
    padding: '0',
    borderRadius: '0',
    fontSizePx: 13,
    fontWeight: 'bold',
    lineHeight: 1,

    // 🔲 Configurarea pătratului (ajustată pentru fontul de 14px)
    squareColor: 'black', // Roșu (poți schimba dacă în grafică are altă culoare)
    squareSizePx: 11,       // Pătrat puțin mai mic decât textul pentru a arăta elegant
    gapPx: 4,               // Spațiul dintre pătrat și text
}

export const LocationGraphics = ({ content, containerRef, textRef, scaleX, isLayoutReady }: GraphicsProps) => (
    <div
        ref={containerRef}
        // ✅ Acum folosim `justify-start` (implicit) pentru că poziționăm la stânga
        className="absolute text-nowrap whitespace-nowrap flex items-center"
        style={{
            // ✅ Modificat din right/top în left/bottom
            left: `${CONFIG.leftPct}%`,
            bottom: `${CONFIG.bottomPct}%`,
            width: `${CONFIG.widthPct}%`,
            backgroundColor: CONFIG.backgroundColor,
            color: CONFIG.textColor,
            padding: CONFIG.padding,
            borderRadius: CONFIG.borderRadius,
            fontWeight: CONFIG.fontWeight,
        }}
    >
        {/* ======================= */}
        {/* 1. PĂTRATUL GRAFIC      */}
        {/* ======================= */}
        <div
            className="shrink-0"
            style={{
                width: `${CONFIG.squareSizePx}px`,
                height: `${CONFIG.squareSizePx}px`,
                backgroundColor: CONFIG.squareColor,
                marginRight: `${CONFIG.gapPx}px`,
                opacity: isLayoutReady ? 1 : 0,
            }}
        />

        {/* ======================= */}
        {/* 2. TEXTUL (Scalabil)    */}
        {/* ======================= */}
        <span
            ref={textRef}
            // ✅ Modificat din origin-right în origin-left
            className="max-w-full w-full inline-block origin-left"
            style={{
                transform: `scaleX(${scaleX})`,
                opacity: isLayoutReady ? 1 : 0,
                fontSize: `${CONFIG.fontSizePx}px`,
                lineHeight: CONFIG.lineHeight,
                // Am lăsat umbra dacă vrei, dar dacă fundalul este deja luminos poți să o ștergi (textShadow: 'none')
            }}
        >
            {content ?? <span className="opacity-40">LOCAȚIE</span>}
        </span>
    </div>
)