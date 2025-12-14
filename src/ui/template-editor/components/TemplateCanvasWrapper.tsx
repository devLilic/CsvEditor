// src/ui/template-editor/components/TemplateCanvasWrapper.tsx

import { useEffect, useRef, useState } from 'react'
import { useTemplateEditor } from '@/features/template-editor'
import { TemplateCanvas } from './TemplateCanvas'

export function TemplateCanvasWrapper() {
    const { template } = useTemplateEditor()
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)

    const { width, height } = template.canvas

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const resize = () => {
            const cw = el.clientWidth
            const ch = el.clientHeight

            const scaleX = cw / width
            const scaleY = ch / height

            setScale(Math.min(scaleX, scaleY))
        }

        resize()
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [width, height])

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center">
            <div
                style={{
                    width,
                    height,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center',
                }}
            >
                <TemplateCanvas />
            </div>
        </div>
    )
}
