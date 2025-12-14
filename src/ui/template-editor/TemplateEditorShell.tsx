// src/ui/template-editor/TemplateEditorShell.tsx
import { TemplateEditorToolbar } from '@/ui/template-editor/components/TemplateEditorToolbar'
import { TemplateCanvas } from '@/ui/template-editor/components/TemplateCanvas'
import { InspectorPanel } from '@/ui/template-editor/components/InspectorPanel'
import { LayersPanel } from '@/ui/template-editor/components/LayersPanel'

export function TemplateEditorShell() {

    return (
        <div className="h-full w-full flex flex-col bg-gray-50">
            <div className="border-b bg-white">
                <TemplateEditorToolbar />
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-12 gap-3 p-3">
                {/* Canvas */}
                <div className="col-span-8 min-h-0 bg-white border rounded">
                    <TemplateCanvas />
                </div>

                {/* Inspector */}
                <div className="col-span-4 min-h-0 flex flex-col gap-3">
                    <div className="bg-white border rounded min-h-0 flex-1">
                        <InspectorPanel />
                    </div>

                    <div className="bg-white border rounded min-h-0 h-[38%]">
                        <LayersPanel />
                    </div>
                </div>
            </div>
        </div>
    )
}
