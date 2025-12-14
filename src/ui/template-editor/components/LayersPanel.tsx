// src/ui/template-editor/components/LayersPanel.tsx

import { useTemplateEditor } from '@/features/template-editor'

export function LayersPanel() {
    const {
        template,
        selectedLayerId,
        selectLayer,
        deleteLayer,
    } = useTemplateEditor()

    return (
        <div className="p-3 space-y-2">
            <div className="text-sm font-semibold mb-2">Layers</div>

            {template.layers.map((layer) => (
                <div
                    key={layer.id}
                    onClick={() => selectLayer(layer.id)}
                    className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer
            ${
                        layer.id === selectedLayerId
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100'
                    }`}
                >
          <span className="text-xs truncate">
            {layer.type.toUpperCase()}
          </span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            deleteLayer(layer.id)
                        }}
                        className="text-xs px-2 py-0.5 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    )
}
