// src/ui/pages/TemplateEditorPage.tsx

import { TemplateEditorLayout } from '@/ui/template-editor/layout/TemplateEditorLayout'
import {
    useTemplateEditor,
} from '@/features/template-editor'

export default function TemplateEditorPage() {
    // 🔹 Source of truth este exclusiv hook-ul
    const { template } = useTemplateEditor()

    return <TemplateEditorLayout/>
}
