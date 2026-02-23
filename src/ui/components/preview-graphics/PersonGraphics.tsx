// src/ui/components/preview-graphics/PersonGraphics.tsx
import type { GraphicsProps } from './types'

// ⚙️ CONFIGURAȚIE PENTRU BLOCUL 1: NUME
const NAME_CONFIG = {
    leftPct: 5.3,
    bottomPct: 14.3,
    widthPct: 73.5,
    backgroundColor: '#1e3a8a',
    textColor: 'white',
    padding: '3px 10px',
    borderRadius: '0',
    fontSizePx: 18,
    fontWeight: 'bold',
    lineHeight: 1, // ✅ NOU: Controlează înălțimea liniei
}

// ⚙️ CONFIGURAȚIE PENTRU BLOCUL 2: FUNCȚIE
const ROLE_CONFIG = {
    leftPct: 5.3,
    bottomPct: 10.5,
    widthPct: 73.5,
    backgroundColor: '#1e3a8a',
    textColor: '#fff',
    padding: '2px 10px',
    borderRadius: '0',
    fontSizePx: 16,
    fontWeight: 'bold',
    lineHeight: 1.2, // ✅ NOU: Controlează înălțimea liniei
}

export const PersonGraphics = ({ content, containerRef, textRef, scaleX, isLayoutReady }: GraphicsProps) => {

    let nameText: React.ReactNode = 'Nume Persoană'
    let roleText: React.ReactNode = 'Funcție Persoană'

    if (Array.isArray(content)) {
        nameText = content[0] || 'Nume'
        roleText = content[1] || 'Funcție'
    } else if (typeof content === 'string') {
        const parts = content.split('\n')
        nameText = parts[0] || 'Nume'
        roleText = parts[1] || 'Funcție'
    } else {
        nameText = content || <span className="opacity-40">Nume</span>
        roleText = <span className="opacity-40">Funcție</span>
    }

    return (
        <>
            {/* BLOCUL 1: NUMELE */}
            <div
                ref={containerRef}
                className="absolute overflow-hidden"
                style={{
                    left: `${NAME_CONFIG.leftPct}%`,
                    bottom: `${NAME_CONFIG.bottomPct}%`,
                    width: `${NAME_CONFIG.widthPct}%`,
                    backgroundColor: NAME_CONFIG.backgroundColor,
                    color: NAME_CONFIG.textColor,
                    padding: NAME_CONFIG.padding,
                    borderRadius: NAME_CONFIG.borderRadius,
                    fontWeight: NAME_CONFIG.fontWeight,
                    textAlign: 'left',
                }}
            >
                {/* ⚠️ Am scos `leading-none` de aici */}
                <span
                    ref={textRef}
                    className="inline-block origin-left"
                    style={{
                        transform: `scaleX(${scaleX})`,
                        opacity: isLayoutReady ? 1 : 0,
                        width: '100%',
                        fontSize: `${NAME_CONFIG.fontSizePx}px`,
                        lineHeight: NAME_CONFIG.lineHeight, // ✅ Aplicat aici
                    }}
                >
                    {nameText}
                </span>
            </div>

            {/* BLOCUL 2: FUNCȚIA */}
            <div
                className="absolute overflow-hidden"
                style={{
                    left: `${ROLE_CONFIG.leftPct}%`,
                    bottom: `${ROLE_CONFIG.bottomPct}%`,
                    width: `${ROLE_CONFIG.widthPct}%`,
                    backgroundColor: ROLE_CONFIG.backgroundColor,
                    color: ROLE_CONFIG.textColor,
                    padding: ROLE_CONFIG.padding,
                    borderRadius: ROLE_CONFIG.borderRadius,
                    fontWeight: ROLE_CONFIG.fontWeight,
                    textAlign: 'left',
                }}
            >
                <span
                    className="inline-block origin-left"
                    style={{
                        transform: `scaleX(${scaleX})`,
                        opacity: isLayoutReady ? 1 : 0,
                        width: '100%',
                        fontSize: `${ROLE_CONFIG.fontSizePx}px`,
                        lineHeight: ROLE_CONFIG.lineHeight, // ✅ Aplicat aici
                    }}
                >
                    {roleText}
                </span>
            </div>
        </>
    )
}