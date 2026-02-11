// src/ui/template-editor/components/InspectorPanel.tsx

import type {
    Layer,
    RectangleLayer,
    TextLayer,
} from '@/features/template-editor/domain/template.types'
import {BackgroundEditor} from "@/ui/template-editor/components/BackgroundEditor";
import {useTemplateEditorContext} from "@/features/template-editor/context/TemplateEditorContext";

/* ======================================================
   UI helpers (pure, dumb)
====================================================== */

function NumberField({
                         label,
                         value,
                         onChange,
                     }: {
    label: string
    value: number
    onChange: (v: number) => void
}) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{label}</span>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
            />
        </label>
    )
}

function TextField({
                       label,
                       value,
                       onChange,
                   }: {
    label: string
    value: string
    onChange: (v: string) => void
}) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{label}</span>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
            />
        </label>
    )
}

/* ======================================================
   Inspector Panel
====================================================== */

export function InspectorPanel() {
    const {
        template,
        selectedLayer,
        selectedLayerId,
        updateLayer,
        deleteLayer,
    } = useTemplateEditorContext()

    /* ---------- Helpers CANONICI (per layer type) ---------- */

    type TextLayerPatch = {
        x?: number
        y?: number
        width?: number
        height?: number
        visible?: boolean
        binding?: string
        textStyle?: Partial<TextLayer['textStyle']>
    }

    const updateTextLayer = (
        layer: TextLayer,
        patch: TextLayerPatch
    ) => {
        // @ts-ignore
        updateLayer(layer.id, {
            type: 'text',
            ...patch,
        })
    }


    const updateRectangleLayer = (
        layer: RectangleLayer,
        patch: Partial<Omit<RectangleLayer, 'id' | 'type'>>
    ) => {
        updateLayer(layer.id, {
            type: 'rectangle',
            ...patch,
        })
    }

    /* ---------- Empty state ---------- */

    if (!selectedLayerId || !selectedLayer) {
        return (
            <div className="p-4 h-full">
                <div className="text-sm font-semibold mb-1">Inspector</div>
                <div className="text-sm text-gray-500">
                    Selectează un layer din canvas.
                </div>

                <div className="mt-4 text-xs text-gray-500">
                    Canvas: {template.canvas.width} × {template.canvas.height}
                </div>
            </div>
        )
    }

    const layer: Layer = selectedLayer

    return (
        <div className="p-4 h-full flex flex-col gap-4">
            {/* ================= Header ================= */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-semibold">Inspector</div>
                    <div className="text-xs text-gray-500">
                        {layer.type.toUpperCase()} • {layer.id}
                    </div>
                </div>

                <button
                    onClick={() => deleteLayer(layer.id)}
                    className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                >
                    Delete
                </button>
            </div>

            {/* ================= Geometry ================= */}
            <div className="grid grid-cols-2 gap-2">
                <NumberField
                    label="X"
                    value={layer.x}
                    onChange={(v) =>
                        layer.type === 'text'
                            ? updateTextLayer(layer, { x: v })
                            : updateRectangleLayer(layer, { x: v })
                    }
                />
                <NumberField
                    label="Y"
                    value={layer.y}
                    onChange={(v) =>
                        layer.type === 'text'
                            ? updateTextLayer(layer, { y: v })
                            : updateRectangleLayer(layer, { y: v })
                    }
                />
                <NumberField
                    label="Width"
                    value={layer.width}
                    onChange={(v) =>
                        layer.type === 'text'
                            ? updateTextLayer(layer, { width: v })
                            : updateRectangleLayer(layer, { width: v })
                    }
                />
                <NumberField
                    label="Height"
                    value={layer.height}
                    onChange={(v) =>
                        layer.type === 'text'
                            ? updateTextLayer(layer, { height: v })
                            : updateRectangleLayer(layer, { height: v })
                    }
                />
            </div>

            {/* ================= Visibility ================= */}
            <div className="flex items-center justify-between border-t pt-3">
                <span className="text-sm">Visible</span>
                <input
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() =>
                        layer.type === 'text'
                            ? updateTextLayer(layer, { visible: !layer.visible })
                            : updateRectangleLayer(layer, { visible: !layer.visible })
                    }
                />
            </div>

            {/* ================= Rectangle Inspector ================= */}
            {layer.type === 'rectangle' && (
                <div className="border-t pt-3 flex flex-col gap-2">
                    <div className="text-sm font-medium">Background</div>

                    {layer.fill.type === 'solid' && (
                        <TextField
                            label="Color"
                            value={layer.fill.value}
                            onChange={(v) =>
                                updateRectangleLayer(layer, {
                                    fill: { type: 'solid', value: v },
                                })
                            }
                        />
                    )}
                </div>
            )}

            {/* ================= Text Inspector ================= */}
            {layer.type === 'text' && (
                <div className="border-t pt-3 flex flex-col gap-2">
                    <div className="text-sm font-medium">Text</div>

                    <TextField
                        label="Binding"
                        value={layer.binding}
                        onChange={(v) =>
                            updateTextLayer(layer, { binding: v })
                        }
                    />

                    <NumberField
                        label="Font size"
                        value={layer.textStyle.fontSize}
                        onChange={(v) =>
                            updateTextLayer(layer, {
                                textStyle: { fontSize: v },
                            })
                        }
                    />

                    <TextField
                        label="Font family"
                        value={layer.textStyle.fontFamily}
                        onChange={(v) =>
                            updateTextLayer(layer, {
                                textStyle: { fontFamily: v },
                            })
                        }
                    />

                    <TextField
                        label="Color"
                        value={layer.textStyle.color}
                        onChange={(v) =>
                            updateTextLayer(layer, {
                                textStyle: { color: v },
                            })
                        }
                    />

                    <TextField
                        label="Align"
                        value={layer.textStyle.align}
                        onChange={(v) =>
                            updateTextLayer(layer, {
                                textStyle: {
                                    align: v as TextLayer['textStyle']['align'],
                                },
                            })
                        }
                    />
                </div>
            )}

            <div className="mt-auto text-xs text-gray-500">
                Drag pentru mutare · Colțuri pentru resize
            </div>
            <BackgroundEditor/>
        </div>
    )
}
