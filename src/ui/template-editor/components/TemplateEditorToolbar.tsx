// src/ui/template-editor/components/TemplateEditorToolbar.tsx

import { useTemplateEditor } from '@/features/template-editor'

export function TemplateEditorToolbar() {
    const { addRectangle, addTextLayer } = useTemplateEditor()

    return (
        <div className="flex gap-2 px-3 py-2 border-b bg-gray-100">
            <button
                onClick={addRectangle}
                className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
            >
                + Rectangle
            </button>

            <button
                onClick={addTextLayer}
                className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
            >
                + Text
            </button>
        </div>
    )
}
