// src/ui/template-editor/components/BackgroundEditor.tsx

import { useTemplateEditorContext} from '@/features/template-editor'

export function BackgroundEditor() {
    const { template, setBackground } = useTemplateEditorContext()
    const bg = template.canvas.background

    return (
        <div className="p-3 space-y-2 border-t">
            <div className="text-sm font-semibold">Background</div>

            {/* COLOR */}
            <input
                type="color"
                value={bg.type === 'color' ? bg.value : '#000000'}
                onChange={(e) =>
                    setBackground({ type: 'color', value: e.target.value })
                }
                className="w-full h-8"
            />

            {/* IMAGE URL */}
            <input
                type="text"
                placeholder="Image URL / path"
                className="border rounded px-2 py-1 text-sm w-full"
                value={bg.type === 'image' ? bg.value : ''}
                onChange={(e) =>
                    setBackground({ type: 'image', value: e.target.value })
                }
            />
        </div>
    )
}
