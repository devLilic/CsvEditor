// src/ui/components/EntityEditor.tsx
import { useEffect, useRef, useState } from 'react'
import {
    useEntities,
    useSelectedEntity,
    useActiveEntityType,
} from '@/features/csv-editor'
import { Preview16x9 } from './Preview16x9'
import { QuickTitlesBar } from './QuickTitlesBar'
import { InputField } from './common/InputField'
import { useOnAir } from '@/features/csv-editor'


type FormState = {
    title?: string
    name?: string
    occupation?: string
    location?: string
}

export function EntityEditor() {
    const { getEntities, addEntity, updateEntity } =
        useEntities()
    const { selected, clearSelection } = useSelectedEntity()
    const { activeEntityType } = useActiveEntityType()
    const [showInvalid, setShowInvalid] = useState(false)

    const [form, setForm] = useState<FormState>({})

    const { isOnAir } = useOnAir()

    const isActiveOnAir =
        selected &&
        isOnAir(activeEntityType, selected.id)


    // 🔑 refs pentru focus
    const titleRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const occupationRef = useRef<HTMLInputElement>(null)
    const locationRef = useRef<HTMLInputElement>(null)

    const selectedEntity = selected
        ? getEntities<any>(selected.type).find(
            (e) => e.id === selected.id
        )
        : null

    // ✅ Guard: dacă din orice motiv e selectat un delimiter, ieșim din edit mode
    useEffect(() => {
        if (
            activeEntityType === 'titles' &&
            selectedEntity &&
            (selectedEntity as any).kind === 'delimiter'
        ) {
            clearSelection()
            setForm({})
            // focus pe inputul primary (titlu) ca să poți adăuga imediat un title nou
            focusPrimaryInput()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeEntityType, selectedEntity])


    // 🧠 Populare form
    useEffect(() => {
        if (!selectedEntity) {
            setForm({})
            return
        }

        switch (activeEntityType) {
            case 'persons':
                setForm({
                    name: selectedEntity.name ?? '',
                    occupation: selectedEntity.occupation ?? '',
                })
                break

            case 'locations':
            case 'waitLocations':
                setForm({
                    location: selectedEntity.location ?? '',
                })
                break

            default:
                setForm({
                    title: selectedEntity.title ?? '',
                })
        }
    }, [selectedEntity, activeEntityType])

    // 🎯 AUTOFOCUS ORICÂND SE SCHIMBĂ CONTEXTUL
    useEffect(() => {
        // Person → focus Nume
        if (activeEntityType === 'persons' && nameRef.current) {
            const el = nameRef.current
            el.focus()
            el.setSelectionRange(el.value.length, el.value.length)
            return
        }

        // Locations → focus Locație
        if (
            (activeEntityType === 'locations' ||
                activeEntityType === 'waitLocations') &&
            locationRef.current
        ) {
            const el = locationRef.current
            el.focus()
            el.setSelectionRange(el.value.length, el.value.length)
            return
        }

        // Titles / rest → focus Titlu
        if (titleRef.current) {
            const el = titleRef.current
            el.focus()
            el.setSelectionRange(el.value.length, el.value.length)
        }
    }, [activeEntityType, selectedEntity])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selected) {
                e.preventDefault()
                clearSelection()
                setForm({})
                focusPrimaryInput()
            }
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [selected])


    const updateField = (key: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const normalizeForm = (form: FormState): FormState => {
        const next = { ...form }

        if (next.title) next.title = next.title.toUpperCase()
        if (next.name) next.name = next.name.toUpperCase()
        if (next.location) next.location = next.location.toUpperCase()

        // occupation rămâne mixed-case
        return next
    }

    const saveEntity = () => {
        if (!isFormValid()) {
            setShowInvalid(true)

            // reset feedback după scurt timp
            setTimeout(() => setShowInvalid(false), 600)
            return
        }

        const payload = normalizeForm(form)

        if (selected && selectedEntity) {
            updateEntity(activeEntityType, selected.id, payload)
            clearSelection()
        } else {
            addEntity(activeEntityType, payload)
        }

        setForm({})
    }



    const focusTitleInput = () => {
        if (titleRef.current) {
            titleRef.current.focus()
            titleRef.current.setSelectionRange(
                titleRef.current.value.length,
                titleRef.current.value.length
            )
        }
    }


    const applyQuickTitle = (prefix: string) => {
        setForm((prev) => {
            const current = prev.title ?? ''

            // elimină orice prefix existent de tip "TEXT: "
            const cleaned = current.replace(/^[^:]+:\s*/, '')

            return {
                ...prev,
                title: `${prefix} ${cleaned}`,
            }
        })
    }


    const isFormValid = (): boolean => {
        switch (activeEntityType) {
            case 'persons':
                return Boolean(form.name?.trim())

            case 'locations':
            case 'waitLocations':
                return Boolean(form.location?.trim())

            case 'titles':
            case 'hotTitles':
            case 'waitTitles':
            default:
                return Boolean(form.title?.trim())
        }
    }


    const focusPrimaryInput = () => {
        let el: HTMLInputElement | null = null

        if (activeEntityType === 'persons') {
            el = nameRef.current
        } else if (
            activeEntityType === 'locations' ||
            activeEntityType === 'waitLocations'
        ) {
            el = locationRef.current
        } else {
            // titles, hotTitles, waitTitles
            el = titleRef.current
        }

        if (el) {
            el.focus()
            const len = el.value.length
            el.setSelectionRange(len, len)
        }
    }




    const previewContent =
        activeEntityType === 'persons' ? (
            <div className="flex flex-col leading-tight">
      <span className="font-semibold uppercase truncate">
        {form.name ?? 'NUME'}
      </span>
                <span className="text-sm text-gray-300 truncate">
        {form.occupation ?? 'functie'}
      </span>
            </div>
        ) : (
            <span className="font-semibold uppercase truncate">
      {form.title ?? form.location ?? 'TITLU'}
    </span>
        )

    const previewMeasureText =
        activeEntityType === 'persons'
            ? `${form.name ?? ''} ${form.occupation ?? ''}`.trim()
            : (form.title ?? form.location ?? 'TITLU').trim()


    return (
        <div className="bg-white rounded border p-4 flex flex-col gap-4 max-w-[100%]">
            <Preview16x9
                entityType={activeEntityType}
                content={previewContent}
                measureText={previewMeasureText}
            />

            <div className="relative">
                <div className="flex flex-col gap-3 w-full font-bold">
                    {activeEntityType === 'persons' && (
                        <>
                            <InputField
                                label="Nume"
                                value={form.name ?? ''}
                                uppercase
                                inputRef={nameRef}
                                onChange={(v) => updateField('name', v)}
                                onEnter={() => occupationRef.current?.focus()}
                                invalid={showInvalid}
                            />

                            <InputField
                                label="Funcție"
                                value={form.occupation ?? ''}
                                inputRef={occupationRef}
                                onChange={(v) =>
                                    updateField('occupation', v)
                                }
                                onEnter={saveEntity}
                            />
                        </>
                    )}

                    {(activeEntityType === 'locations' ||
                        activeEntityType === 'waitLocations') && (
                        <InputField
                            label="Locație"
                            value={form.location ?? ''}
                            uppercase
                            inputRef={locationRef}
                            onChange={(v) => updateField('location', v)}
                            onEnter={saveEntity}
                            invalid={showInvalid}
                        />

                    )}

                    {(activeEntityType === 'titles' ||
                        activeEntityType === 'hotTitles' ||
                        activeEntityType === 'waitTitles') && (
                        <InputField
                            label="Titlu"
                            value={form.title ?? ''}
                            uppercase
                            inputRef={titleRef}
                            onChange={(v) => updateField('title', v)}
                            onEnter={saveEntity}
                            invalid={showInvalid}
                        />

                    )}
                </div>
                {selected && (
                    <button
                        onClick={() => {
                            clearSelection()
                            setForm({})
                            focusPrimaryInput()
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 absolute right-1 top-[27px] border-2 border-gray-300 px-2 py-2 rounded"
                    >
                        ESC
                    </button>
                )}

            </div>

            <button
                onClick={saveEntity}
                disabled={!isFormValid()}
                className={`py-2 rounded text-white ${
                    isFormValid()
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
                {selected ? 'Update' : 'Adaugă'}
            </button>

            {activeEntityType === 'titles' && (
                <div className="border-t pt-3 mt-2">
                    <div className="text-xs text-gray-500 mb-2">
                        Prefixe rapide
                    </div>

                    <QuickTitlesBar
                        onApplyPrefix={applyQuickTitle}
                        focusEditor={focusTitleInput}
                    />
                </div>
            )}
        </div>
    )
}
