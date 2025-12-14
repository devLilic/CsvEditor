// src/ui/template-editor/components/BackgroundSection.tsx

import { useTemplateEditor } from '@/features/template-editor'

export function BackgroundSection() {
    const { template, setBackground } = useTemplateEditor()

    const bg = template.canvas.background

    return (
        <div className="border-t pt-4 space-y-3">
            <div className="text-sm font-semibold">Background</div>

            {/* Color */}
            <div className="flex gap-2 items-center">
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
                <span className="text-xs text-gray-500">Color</span>
            </div>

            {/* Image */}
            <input
                type="text"
                placeholder="Image URL / path"
                className="border rounded px-2 py-1 text-sm w-full"
                value={bg.type === 'image' ? bg.value : ''}
                onChange={(e) =>
                    setBackground({
                        type: 'image',
                        value: e.target.value,
                    })
                }
            />

            {bg.type === 'image' && (
                <button
                    onClick={() =>
                        setBackground({
                            type: 'color',
                            value: '#000000',
                        })
                    }
                    className="text-xs text-red-600"
                >
                    Remove background image
                </button>
            )}
        </div>
    )
}
