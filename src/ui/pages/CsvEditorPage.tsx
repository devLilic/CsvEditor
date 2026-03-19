// src/ui/pages/CsvEditorPage.tsx
import {
    useCsvInitialization,
    useCsvAutosave,
} from '@/features/csv-editor'

import {EditorLayout} from '../components/layout/EditorLayout'
import {EditorHeader} from '../components/layout/EditorHeader'
import {EditorBody} from '../components/layout/EditorBody'
import {EditModeProvider} from "@/ui/context/EditModeContext";
import { TitleFilterProvider } from '@/ui/context/TitleFilterContext'

export function CsvEditorPage() {
    useCsvInitialization()
    useCsvAutosave({debounceMs: 800})

    return (
        <EditModeProvider>
            <TitleFilterProvider>
                <EditorLayout>
                    <EditorHeader/>
                    <EditorBody/>
                </EditorLayout>
            </TitleFilterProvider>
        </EditModeProvider>
    )
}
