// src/ui/pages/TemplateEditorPage.tsx

import {
    TemplateEditorProvider,
} from '@/features/template-editor'
import type { Template } from '@/features/template-editor/domain/template.types'

import { TemplateEditorLayout } from '@/ui/template-editor/layout/TemplateEditorLayout'
import {BackgroundPanel} from "@/ui/template-editor/components/BackgroundPanel";

const initialTemplate: Template = {
    id: 'default',
    name: 'New Template',
    canvas: {
        width: 1280,
        height: 720,
        background: {
            type: 'color',
            value: '#000000',
        },
    },
    layers: [],
}

export default function TemplateEditorPage() {
    return (
        <TemplateEditorProvider initialTemplate={initialTemplate}>
            <TemplateEditorLayout />
            <BackgroundPanel/>
        </TemplateEditorProvider>
    )
}
