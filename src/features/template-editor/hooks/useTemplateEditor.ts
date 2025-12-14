// src/features/template-editor/hooks/useTemplateEditor.ts

import { useCallback, useMemo, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid'

import type { Background, Layer, RectangleLayer, Template, TextLayer } from '../domain/template.types'
import { templateEditorReducer } from '../state/template.reducer'
import type { LayerPatch, TemplateEditorState } from '../state/template.types'

function getNextZIndex(layers: Layer[]): number {
    if (layers.length === 0) return 1
    return Math.max(...layers.map((l) => l.zIndex)) + 1
}

export function createDefaultTemplate(partial?: Partial<Template>): Template {
    return {
        id: partial?.id ?? uuidv4(),
        name: partial?.name ?? 'New Template',
        canvas: {
            width: partial?.canvas?.width ?? 1280,
            height: partial?.canvas?.height ?? 720,
            background: partial?.canvas?.background ?? { type: 'color', value: '#000000' },
        },
        layers: partial?.layers ?? [],
    }
}

function createDefaultRectangle(layers: Layer[]): RectangleLayer {
    return {
        id: uuidv4(),
        type: 'rectangle',
        x: 100,
        y: 100,
        width: 400,
        height: 120,
        rotation: 0,
        opacity: 1,
        zIndex: getNextZIndex(layers),
        visible: true,
        fill: { type: 'solid', value: '#1f2937' },
    }
}

function createDefaultTextLayer(layers: Layer[]): TextLayer {
    return {
        id: uuidv4(),
        type: 'text',
        x: 120,
        y: 120,
        width: 800,
        height: 120,
        rotation: 0,
        opacity: 1,
        zIndex: getNextZIndex(layers),
        visible: true,
        binding: 'titles.title',
        textStyle: {
            fontFamily: 'Inter',
            fontSize: 48,
            fontWeight: 700,
            color: '#ffffff',
            align: 'left',
            transform: undefined,
        },
    }
}

/**
 * Unicul “creier” al editorului.
 * UI NU modifică state direct.
 */
export function useTemplateEditor(initial?: Template) {
    const initialTemplate = useMemo(() => createDefaultTemplate(initial), [initial])

    const [state, dispatch] = useReducer(templateEditorReducer, {
        template: initialTemplate,
        selectedLayerId: null,
    } satisfies TemplateEditorState)

    const selectedLayer = useMemo(() => {
        if (!state.selectedLayerId) return null
        return state.template.layers.find((l) => l.id === state.selectedLayerId) ?? null
    }, [state.selectedLayerId, state.template.layers])

    const selectLayer = useCallback((id: string | null) => {
        dispatch({ type: 'SELECT_LAYER', payload: id })
    }, [])

    const addRectangle = useCallback(() => {
        const layer = createDefaultRectangle(state.template.layers)
        dispatch({ type: 'ADD_LAYER', payload: layer, select: true })
        return layer.id
    }, [state.template.layers])

    const addTextLayer = useCallback(() => {
        const layer = createDefaultTextLayer(state.template.layers)
        dispatch({ type: 'ADD_LAYER', payload: layer, select: true })
        return layer.id
    }, [state.template.layers])

    const deleteLayer = useCallback((id: string) => {
        dispatch({ type: 'DELETE_LAYER', payload: { id } })
    }, [])

    const updateLayer = useCallback((id: string, patch: LayerPatch) => {
        dispatch({ type: 'UPDATE_LAYER', payload: { id, patch } })
    }, [])

    const moveLayer = useCallback((id: string, x: number, y: number) => {
        dispatch({ type: 'MOVE_LAYER', payload: { id, x, y } })
    }, [])

    const resizeLayer = useCallback((id: string, width: number, height: number) => {
        dispatch({ type: 'RESIZE_LAYER', payload: { id, width, height } })
    }, [])

    const reorderLayer = useCallback((id: string, toIndex: number) => {
        dispatch({
            type: 'REORDER_LAYER',
            payload: { id, toIndex },
        })
    }, [])

    const setBackground = useCallback((background: Background) => {
        dispatch({ type: 'SET_BACKGROUND', payload: background })
    }, [])

    const patchCanvas = useCallback((patch: Partial<Template['canvas']> & { background?: Background }) => {
        dispatch({ type: 'PATCH_CANVAS', payload: patch })
    }, [])

    /**
     * saveTemplate()
     * - NU face IO (nu scrie pe disk)
     * - doar produce JSON (Template) + string (pentru persist/export)
     */
    const saveTemplate = useCallback(() => {
        const template: Template = state.template
        const json = JSON.stringify(template, null, 2)
        return { template, json }
    }, [state.template])

    return {
        // state
        template: state.template,
        selectedLayerId: state.selectedLayerId,
        selectedLayer,

        // selection
        selectLayer,

        // layer operations
        addRectangle,
        addTextLayer,
        deleteLayer,
        updateLayer,
        moveLayer,
        resizeLayer,
        reorderLayer,

        // canvas/background
        setBackground,
        patchCanvas,

        // output
        saveTemplate,
    }
}
