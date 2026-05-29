import type {
    BroadcastImageLayer,
    BroadcastLayer,
    BroadcastShapeLayer,
    BroadcastTemplate,
    BroadcastTextLayer,
} from '@/shared/preview/templateContract'

type TemplateLayerAccordionProps = {
    template: BroadcastTemplate
    onTemplateChange: (template: BroadcastTemplate) => void
}

type StringInputProps = {
    label: string
    value: string
    onChange: (value: string) => void
}

type NumberInputProps = {
    label: string
    value: number
    onChange: (value: number) => void
    min?: number
}

function cloneTemplate(template: BroadcastTemplate): BroadcastTemplate {
    return JSON.parse(JSON.stringify(template)) as BroadcastTemplate
}

function cloneValue<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T
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

function NumberInput({ label, value, onChange, min }: NumberInputProps) {
    return (
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
            {label}
            <input
                type="number"
                min={min}
                value={Number.isFinite(value) ? value : 0}
                onChange={(event) => onChange(Number(event.target.value))}
                className="rounded border border-gray-300 px-2 py-1 text-sm font-normal text-gray-900"
            />
        </label>
    )
}

function SelectInput({
    label,
    value,
    options,
    onChange,
}: {
    label: string
    value: string
    options: string[]
    onChange: (value: string) => void
}) {
    return (
        <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
            {label}
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="rounded border border-gray-300 px-2 py-1 text-sm font-normal text-gray-900"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    )
}

function CheckboxInput({
    label,
    checked,
    onChange,
}: {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
}) {
    return (
        <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />
            {label}
        </label>
    )
}

function updateLayerById(
    template: BroadcastTemplate,
    layerId: string,
    updateLayer: (layer: BroadcastLayer) => BroadcastLayer
) {
    return {
        ...template,
        layers: template.layers.map((layer) => (
            layer.id === layerId ? updateLayer(layer) : layer
        )),
    }
}

export function TemplateLayerAccordion({
    template,
    onTemplateChange,
}: TemplateLayerAccordionProps) {
    const applyTemplateUpdate = (nextTemplate: BroadcastTemplate) => {
        onTemplateChange(nextTemplate)
    }

    const updateCanvasNumber = (key: 'width' | 'height', value: number) => {
        applyTemplateUpdate({
            ...cloneTemplate(template),
            canvas: {
                ...cloneValue(template.canvas),
                [key]: value,
            },
        })
    }

    const updateCanvasBackgroundValue = (value: string) => {
        const nextTemplate = cloneTemplate(template)
        nextTemplate.canvas.background.value = value
        applyTemplateUpdate(nextTemplate)
    }

    const updateLayer = (
        layerId: string,
        updateLayerValue: (layer: BroadcastLayer) => BroadcastLayer
    ) => {
        applyTemplateUpdate(updateLayerById(cloneTemplate(template), layerId, updateLayerValue))
    }

    return (
        <div className="flex flex-col gap-3">
            <details open className="rounded border bg-white">
                <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-gray-900">
                    Background
                </summary>
                <div className="grid grid-cols-2 gap-2 border-t p-3">
                    <NumberInput
                        label="Width"
                        value={template.canvas.width}
                        min={1}
                        onChange={(value) => updateCanvasNumber('width', value)}
                    />
                    <NumberInput
                        label="Height"
                        value={template.canvas.height}
                        min={1}
                        onChange={(value) => updateCanvasNumber('height', value)}
                    />
                    <StringInput
                        label="Background"
                        value={template.canvas.background.value}
                        onChange={updateCanvasBackgroundValue}
                    />
                    {template.canvas.background.type === 'image' && (
                        <SelectInput
                            label="Object fit"
                            value={template.canvas.background.objectFit ?? 'cover'}
                            options={['contain', 'cover', 'fill']}
                            onChange={(value) => {
                                const nextTemplate = cloneTemplate(template)
                                if (nextTemplate.canvas.background.type === 'image') {
                                    nextTemplate.canvas.background.objectFit = value as 'contain' | 'cover' | 'fill'
                                }
                                applyTemplateUpdate(nextTemplate)
                            }}
                        />
                    )}
                </div>
            </details>

            {template.layers.map((layer) => (
                <details key={layer.id} className="rounded border bg-white">
                    <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-gray-900">
                        {layer.id} ({layer.type})
                    </summary>
                    <div className="grid grid-cols-2 gap-2 border-t p-3">
                        <NumberInput
                            label="X"
                            value={layer.x}
                            onChange={(value) => updateLayer(layer.id, (current) => ({
                                ...current,
                                x: value,
                            }))}
                        />
                        <NumberInput
                            label="Y"
                            value={layer.y}
                            onChange={(value) => updateLayer(layer.id, (current) => ({
                                ...current,
                                y: value,
                            }))}
                        />
                        <NumberInput
                            label="Width"
                            value={layer.width}
                            min={0}
                            onChange={(value) => updateLayer(layer.id, (current) => ({
                                ...current,
                                width: value,
                            }))}
                        />
                        <NumberInput
                            label="Height"
                            value={layer.height}
                            min={0}
                            onChange={(value) => updateLayer(layer.id, (current) => ({
                                ...current,
                                height: value,
                            }))}
                        />
                        <NumberInput
                            label="Z index"
                            value={layer.zIndex}
                            onChange={(value) => updateLayer(layer.id, (current) => ({
                                ...current,
                                zIndex: value,
                            }))}
                        />
                        {'visible' in layer && (
                            <CheckboxInput
                                label="Visible"
                                checked={layer.visible !== false}
                                onChange={(checked) => updateLayer(layer.id, (current) => ({
                                    ...current,
                                    visible: checked,
                                }))}
                            />
                        )}
                        {layer.type === 'text' && (
                            <TextLayerSettings
                                layer={layer}
                                onChange={(nextLayer) => updateLayer(layer.id, () => nextLayer)}
                            />
                        )}
                        {layer.type === 'image' && (
                            <ImageLayerSettings
                                layer={layer}
                                onChange={(nextLayer) => updateLayer(layer.id, () => nextLayer)}
                            />
                        )}
                        {layer.type === 'shape' && (
                            <ShapeLayerSettings
                                layer={layer}
                                onChange={(nextLayer) => updateLayer(layer.id, () => nextLayer)}
                            />
                        )}
                    </div>
                </details>
            ))}
        </div>
    )
}

function TextLayerSettings({
    layer,
    onChange,
}: {
    layer: BroadcastTextLayer
    onChange: (layer: BroadcastTextLayer) => void
}) {
    return (
        <>
            <StringInput
                label="Fallback"
                value={layer.fallbackText ?? ''}
                onChange={(value) => onChange({ ...layer, fallbackText: value })}
            />
            <NumberInput
                label="Font size"
                value={layer.textStyle.fontSize}
                min={1}
                onChange={(value) => onChange({
                    ...layer,
                    textStyle: { ...layer.textStyle, fontSize: value },
                })}
            />
            <NumberInput
                label="Font weight"
                value={layer.textStyle.fontWeight}
                min={1}
                onChange={(value) => onChange({
                    ...layer,
                    textStyle: { ...layer.textStyle, fontWeight: value },
                })}
            />
            <StringInput
                label="Color"
                value={layer.textStyle.color}
                onChange={(value) => onChange({
                    ...layer,
                    textStyle: { ...layer.textStyle, color: value },
                })}
            />
            <SelectInput
                label="Align"
                value={layer.textStyle.align}
                options={['left', 'center', 'right']}
                onChange={(value) => onChange({
                    ...layer,
                    textStyle: {
                        ...layer.textStyle,
                        align: value as 'left' | 'center' | 'right',
                    },
                })}
            />
            {'lineHeight' in layer.textStyle && (
                <NumberInput
                    label="Line height"
                    value={layer.textStyle.lineHeight ?? 1}
                    min={0}
                    onChange={(value) => onChange({
                        ...layer,
                        textStyle: { ...layer.textStyle, lineHeight: value },
                    })}
                />
            )}
            {'letterSpacing' in layer.textStyle && (
                <StringInput
                    label="Letter spacing"
                    value={layer.textStyle.letterSpacing ?? ''}
                    onChange={(value) => onChange({
                        ...layer,
                        textStyle: { ...layer.textStyle, letterSpacing: value },
                    })}
                />
            )}
        </>
    )
}

function ImageLayerSettings({
    layer,
    onChange,
}: {
    layer: BroadcastImageLayer
    onChange: (layer: BroadcastImageLayer) => void
}) {
    return (
        <>
            <StringInput
                label="Source"
                value={layer.src}
                onChange={(value) => onChange({ ...layer, src: value })}
            />
            <SelectInput
                label="Object fit"
                value={layer.objectFit ?? 'contain'}
                options={['contain', 'cover', 'fill']}
                onChange={(value) => onChange({
                    ...layer,
                    objectFit: value as 'contain' | 'cover' | 'fill',
                })}
            />
        </>
    )
}

function ShapeLayerSettings({
    layer,
    onChange,
}: {
    layer: BroadcastShapeLayer
    onChange: (layer: BroadcastShapeLayer) => void
}) {
    return (
        <>
            <StringInput
                label="Fill"
                value={layer.fill.value}
                onChange={(value) => onChange({
                    ...layer,
                    fill: {
                        ...layer.fill,
                        value,
                    },
                })}
            />
            {'borderRadius' in layer && (
                <NumberInput
                    label="Border radius"
                    value={layer.borderRadius ?? 0}
                    min={0}
                    onChange={(value) => onChange({
                        ...layer,
                        borderRadius: value,
                    })}
                />
            )}
        </>
    )
}
