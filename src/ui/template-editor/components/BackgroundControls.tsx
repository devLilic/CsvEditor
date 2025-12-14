// src/ui/template-editor/components/BackgroundControls.tsx
import {useTemplateEditorContext} from '@/features/template-editor'

export function BackgroundControls() {
    const { template, setBackground, patchCanvas } = useTemplateEditorContext()
    const bg = template.canvas.background

    return (
        <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500">Background</div>

            <button
                onClick={() => setBackground({ type: 'color', value: '#000000' })}
                className={`px-2 py-1 rounded text-xs border ${
                    bg.type === 'color' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white'
                }`}
            >
                Color
            </button>

            <button
                onClick={() =>
                    setBackground({
                        type: 'image',
                        value: 'https://picsum.photos/1920/1080',
                    })
                }
                className={`px-2 py-1 rounded text-xs border ${
                    bg.type === 'image' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white'
                }`}
            >
                Image
            </button>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <button
                onClick={() => patchCanvas({ width: 1920, height: 1080 })}
                className="px-2 py-1 rounded text-xs border bg-white hover:bg-gray-50"
            >
                1920×1080
            </button>

            <button
                onClick={() => patchCanvas({ width: 1280, height: 720 })}
                className="px-2 py-1 rounded text-xs border bg-white hover:bg-gray-50"
            >
                1280×720
            </button>
        </div>
    )
}
