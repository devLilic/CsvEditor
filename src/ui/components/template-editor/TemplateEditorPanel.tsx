import { useMemo, useState } from 'react'
import type { BroadcastTemplate } from '@/shared/preview/templateContract'
import {
    type EditableTemplateEntityType,
    useTemplateDocument,
} from '@/features/template-editor/state/TemplateDocumentProvider'
import type { TedEntityType } from '@/features/template-editor/domain/tedTypes'
import {
    getDefaultTedSampleData,
    mergeTedSampleData,
} from '@/features/template-editor/domain/tedSampleData'
import { TedEntityTabs } from './TedEntityTabs'
import { TemplateLayerAccordion } from './TemplateLayerAccordion'

type TemplateEditorPanelProps = {
    isTedMode: boolean
}

type StringInputProps = {
    label: string
    value: string
    onChange: (value: string) => void
}

function StringInput({ label, value, onChange }: StringInputProps) {
    return (
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
            {label}
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="rounded border border-gray-300 px-2 py-1 text-sm font-normal text-gray-900"
            />
        </label>
    )
}

function getSampleFieldLabels(entityType: TedEntityType) {
    return Object.keys(getDefaultTedSampleData(entityType))
}

export function TemplateEditorPanel({ isTedMode }: TemplateEditorPanelProps) {
    const {
        document,
        isLoaded,
        isDirty,
        updateTemplate,
        resetTemplateToDefault,
        saveTemplates,
    } = useTemplateDocument()
    const [activeEntityType, setActiveEntityType] = useState<TedEntityType>('titles')
    const [sampleOverrides, setSampleOverrides] = useState<Record<string, string>>({})
    const [saveError, setSaveError] = useState<string | null>(null)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
    const template = document.templates[activeEntityType]
    const sampleData = useMemo(
        () => mergeTedSampleData(activeEntityType, sampleOverrides),
        [activeEntityType, sampleOverrides],
    )

    if (!isTedMode) return null

    const applyTemplateUpdate = (nextTemplate: BroadcastTemplate) => {
        updateTemplate(activeEntityType as EditableTemplateEntityType, nextTemplate)
        setSaveStatus('idle')
        setSaveError(null)
    }

    const handleSave = async () => {
        setSaveStatus('saving')
        setSaveError(null)
        const result = await saveTemplates()

        if (!result.ok) {
            setSaveStatus('idle')
            setSaveError(result.error ?? 'SAVE_FAILED')
            return
        }

        setSaveStatus('saved')
    }

    const handleReset = () => {
        resetTemplateToDefault(activeEntityType)
        setSaveStatus('idle')
        setSaveError(null)
    }

    return (
        <div
            data-testid="template-editor-panel"
            className="flex h-full min-h-0 flex-col gap-3 overflow-hidden"
        >
            <TedEntityTabs
                activeEntityType={activeEntityType}
                onChange={(entityType) => {
                    setActiveEntityType(entityType)
                    setSampleOverrides({})
                    setSaveStatus('idle')
                    setSaveError(null)
                }}
            />

            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
                {!isLoaded && (
                    <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        Loading templates...
                    </div>
                )}

                <section className="rounded border bg-white p-3">
                    <div className="mb-2 text-sm font-semibold text-gray-900">
                        Sample data
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {getSampleFieldLabels(activeEntityType).map((fieldId) => (
                            <StringInput
                                key={fieldId}
                                label={fieldId}
                                value={sampleOverrides[fieldId] ?? ''}
                                onChange={(value) => {
                                    setSampleOverrides((current) => ({
                                        ...current,
                                        [fieldId]: value,
                                    }))
                                }}
                            />
                        ))}
                    </div>
                    <div className="mt-2 rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                        {Object.entries(sampleData).map(([key, value]) => (
                            <div key={key} className="truncate">
                                {key}: {value}
                            </div>
                        ))}
                    </div>
                </section>

                <TemplateLayerAccordion
                    template={template}
                    onTemplateChange={applyTemplateUpdate}
                />
            </div>

            <div className="shrink-0 rounded border bg-white p-3">
                {saveError && (
                    <div className="mb-2 rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
                        {saveError}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!isDirty || saveStatus === 'saving'}
                        className={`rounded px-3 py-2 text-sm font-semibold text-white ${
                            isDirty && saveStatus !== 'saving'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-400'
                        }`}
                    >
                        {saveStatus === 'saving' ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Reset to default
                    </button>
                    <span className="text-xs font-medium text-gray-600">
                        {isDirty ? 'Unsaved changes' : saveStatus === 'saved' ? 'Saved' : 'Clean'}
                    </span>
                </div>
            </div>
        </div>
    )
}
