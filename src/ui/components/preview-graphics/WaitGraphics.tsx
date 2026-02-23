// src/ui/components/preview-graphics/WaitGraphics.tsx
import type { GraphicsProps } from './types'

// ⚙️ CONFIGURAȚIE COMUNĂ PENTRU BLOCUL ALB (Wait)
const CONTAINER_CONFIG = {
    rightPct: 1,         // Poziționat în dreapta
    topPct: 46,          // Pe mijlocul ecranului (ajustează procentul pentru a-l centra vertical perfect)
    widthPct: 33,        // Lățimea blocului alb
    backgroundColor: '#fff', // Fundal alb
    padding: '0 10px 0 10px',// Spațiere interioară
    borderRadius: '0', // Colțuri rotunjite
    boxShadow: 'none', // O umbră pentru a-l scoate în evidență peste video
    heightPx: 40,       // ✅ Înălțime FIXĂ pentru ca blocul să nu își schimbe forma
}

// ⚙️ CONFIGURAȚIE ZONA 1: LOCAȚIE (Sus)
const LOCATION_CONFIG = {
    color: '#1e3a8a',    // Un gri/negru mai deschis sau poți pune roșu
    fontSizePx: 14,
    fontWeight: 'bold',
    heightPx: 20,        // Spațiul rezervat doar pentru locație
    lineHeight: 1
}

// ⚙️ CONFIGURAȚIE ZONA 2: TITLU (Jos)
const TITLE_CONFIG = {
    color: '#1e3a8a',    // Negru
    fontSizePx: 14,
    fontWeight: 'bold',
    heightPx: 20,        // Spațiu mai mare pentru titlu (poate avea 2 rânduri)
}

// ==========================================
// 1. COMPONENTA PENTRU WAIT LOCATION
// ==========================================
export const WaitLocationGraphics = ({ content, containerRef, textRef, scaleX, isLayoutReady }: GraphicsProps) => (
    <div
        ref={containerRef}
        className="absolute flex flex-col"
        style={{
            right: `${CONTAINER_CONFIG.rightPct}%`,
            top: `${CONTAINER_CONFIG.topPct}%`,
            width: `${CONTAINER_CONFIG.widthPct}%`,
            height: `${CONTAINER_CONFIG.heightPx}px`,
            backgroundColor: CONTAINER_CONFIG.backgroundColor,
            padding: CONTAINER_CONFIG.padding,
            borderRadius: CONTAINER_CONFIG.borderRadius,
            boxShadow: CONTAINER_CONFIG.boxShadow,
            textAlign: 'left',
        }}
    >
        {/* ZONA SUS (Locația) -> Aici aplicăm scalarea (textRef) */}
        <div className="w-full " style={{ height: `${LOCATION_CONFIG.heightPx}px` }}>
            <span
                ref={textRef}
                className="max-w-full inline-block origin-left leading-none uppercase text-nowrap"
                style={{
                    transform: `scaleX(${scaleX})`,
                    opacity: isLayoutReady ? 1 : 0,
                    color: LOCATION_CONFIG.color,
                    fontSize: `${LOCATION_CONFIG.fontSizePx}px`,
                    fontWeight: LOCATION_CONFIG.fontWeight,
                    lineHeight: LOCATION_CONFIG.lineHeight,
                }}
            >
                {content ?? <span className="opacity-40">Locaite</span>}
            </span>
        </div>

        {/* ZONA JOS (Titlu Placeholder) -> Este afișat semi-transparent ca referință vizuală */}
        <div className="w-full mt-[2px] opacity-40" style={{ height: `${TITLE_CONFIG.heightPx}px` }}>
            <span
                className="inline-block origin-left leading-tight uppercase"
                style={{
                    color: TITLE_CONFIG.color,
                    fontSize: `${TITLE_CONFIG.fontSizePx}px`,
                    fontWeight: TITLE_CONFIG.fontWeight,
                }}
            >
                [ TITLU AȘTEPTARE ]
            </span>
        </div>
    </div>
)

// ==========================================
// 2. COMPONENTA PENTRU WAIT TITLE
// ==========================================
export const WaitTitleGraphics = ({ content, containerRef, textRef, scaleX, isLayoutReady }: GraphicsProps) => (
    <div
        ref={containerRef}
        className="absolute flex flex-col"
        style={{
            right: `${CONTAINER_CONFIG.rightPct}%`,
            top: `${CONTAINER_CONFIG.topPct}%`,
            width: `${CONTAINER_CONFIG.widthPct}%`,
            height: `${CONTAINER_CONFIG.heightPx}px`,
            backgroundColor: CONTAINER_CONFIG.backgroundColor,
            padding: CONTAINER_CONFIG.padding,
            borderRadius: CONTAINER_CONFIG.borderRadius,
            boxShadow: CONTAINER_CONFIG.boxShadow,
            textAlign: 'left',
        }}
    >
        {/* ZONA SUS (Locație Placeholder) -> Afișată semi-transparent ca referință */}
        <div className="w-full opacity-20" style={{ height: `${LOCATION_CONFIG.heightPx}px` }}>
            <span
                className="inline-block origin-left leading-none uppercase"
                style={{
                    color: LOCATION_CONFIG.color,
                    fontSize: `${LOCATION_CONFIG.fontSizePx}px`,
                    fontWeight: LOCATION_CONFIG.fontWeight,
                }}
            >
                [ LOCAȚIE AȘTEPTARE ]
            </span>
        </div>

        {/* ZONA JOS (Titlul) -> Aici aplicăm scalarea (textRef) pentru Titlu */}
        <div className="w-full text-nowrap" style={{ height: `${TITLE_CONFIG.heightPx}px` }}>
            <span
                ref={textRef}
                className="max-w-full inline-block origin-left leading-tight uppercase "
                style={{
                    transform: `scaleX(${scaleX})`,
                    opacity: isLayoutReady ? 1 : 0,
                    color: TITLE_CONFIG.color,
                    fontSize: `${TITLE_CONFIG.fontSizePx}px`,
                    fontWeight: TITLE_CONFIG.fontWeight,
                }}
            >
                {content ?? <span className="opacity-40">DECLARAȚIILE PREȘEDINTELUI</span>}
            </span>
        </div>
    </div>
)