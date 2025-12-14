// src/features/template-editor/context/TemplateEditorContext.tsx

import React, { createContext, useContext } from 'react'
import type { Template } from '../domain/template.types'
import { useTemplateEditor } from '../hooks/useTemplateEditor'

type TemplateEditorApi = ReturnType<typeof useTemplateEditor>

const TemplateEditorContext = createContext<TemplateEditorApi | null>(null)

export function TemplateEditorProvider({
                                           initialTemplate,
                                           children,
                                       }: {
    initialTemplate?: Template
    children: React.ReactNode
}) {
    const editor = useTemplateEditor(initialTemplate)

    return (
        <TemplateEditorContext.Provider value={editor}>
            {children}
        </TemplateEditorContext.Provider>
    )
}

export function useTemplateEditorContext(): TemplateEditorApi {
    const ctx = useContext(TemplateEditorContext)
    if (!ctx) {
        throw new Error(
            'useTemplateEditorContext must be used inside <TemplateEditorProvider>'
        )
    }
    return ctx
}
