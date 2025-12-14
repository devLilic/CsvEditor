// src/ui/template-editor/layout/TemplateEditorLayout.tsx

import { TemplateEditorToolbar } from '../components/TemplateEditorToolbar'
import { TemplateCanvasWrapper } from '../components/TemplateCanvasWrapper'
import { InspectorPanel } from '../components/InspectorPanel'
import { LayersPanel } from '../components/LayersPanel'
import {BackgroundPanel} from "@/ui/template-editor/components/BackgroundPanel";

export function TemplateEditorLayout() {
    return (
        <div className="h-full w-full flex overflow-hidden">
            <aside className="w-60 border-r bg-gray-50">
                <LayersPanel />
            </aside>

            <main className="flex-1 flex flex-col bg-neutral-800">
                <TemplateEditorToolbar />
                <TemplateCanvasWrapper />
            </main>

            <aside className="w-80 border-l bg-white">
                <InspectorPanel />
            </aside>

        </div>
    )
}
