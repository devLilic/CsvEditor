// src/ui/template-editor/components/BackgroundPanel.tsx

import { useTemplateEditorContext } from '@/features/template-editor'

export function BackgroundPanel() {
    const { template, setBackground } = useTemplateEditorContext()
    const bg = template.canvas.background

    return (
        <div className="p-3 border-b space-y-3">
            <div className="text-sm font-semibold">Background</div>

            {/* COLOR */}
            <div className="flex items-center gap-2">
                <label className="text-xs w-16">Color</label>
                <input
                    type="color"
                    value={bg.type === 'color' ? bg.value : '#000000'}
                    onChange={(e) =>
                        setBackground({
                            type: 'color',
                            value: e.target.value,
                        })
                    }
                />
            </div>

            {/* IMAGE */}
            <div className="flex items-center gap-2">
                <label className="text-xs w-16">Image</label>
                <input
                    type="text"
                    placeholder="Image URL"
                    className="flex-1 border px-2 py-1 text-xs rounded"
                    value={bg.type === 'image' ? bg.value : ''}
                    onChange={(e) =>
                        setBackground({
                            type: 'image',
                            value: e.target.value,
                        })
                    }
                />
            </div>
        </div>
    )
}
