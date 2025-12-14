// src/ui/template-editor/layout/TemplateEditorLayout.tsx

import { LayersPanel } from '../components/LayersPanel'
import { InspectorPanel } from '../components/InspectorPanel'
import { TemplateCanvasWrapper } from '../components/TemplateCanvasWrapper'
import {TemplateEditorToolbar} from "@/ui/template-editor/components/TemplateEditorToolbar";

export function TemplateEditorLayout() {
    return (
        <div className="h-full w-full flex overflow-hidden">
            {/* Layers */}
            <aside className="w-60 border-r bg-gray-50 shrink-0">
                <LayersPanel />
            </aside>

            {/* Canvas area */}
            <main className="flex-1 flex flex-col bg-neutral-800">
                <TemplateEditorToolbar />
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <TemplateCanvasWrapper />
                </div>
            </main>

            {/* Inspector */}
            <aside className="w-80 border-l bg-white shrink-0">
                <InspectorPanel />
            </aside>
        </div>
    )
}
