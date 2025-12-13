// src/ui/pages/CsvEditorPage.tsx
import {
    useCsvInitialization,
    useCsvAutosave,
} from '@/features/csv-editor'

import { EditorLayout } from '../components/layout/EditorLayout'
import { EditorHeader } from '../components/layout/EditorHeader'
import { EditorBody } from '../components/layout/EditorBody'

export function CsvEditorPage() {
    useCsvInitialization()
    useCsvAutosave({ debounceMs: 800 })

    return (
        <EditorLayout>
            <EditorHeader />
            <EditorBody />
        </EditorLayout>
    )
}
