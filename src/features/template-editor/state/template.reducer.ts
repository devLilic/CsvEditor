// src/features/template-editor/state/template.reducer.ts

import type { Layer, Template } from '../domain/template.types'
import type { LayerPatch, TemplateEditorAction, TemplateEditorState } from './template.types'

function assertNever(x: never): never {
    throw new Error(`Unexpected object: ${String(x)}`)
}

function sortLayers(layers: Layer[]): Layer[] {
    return [...layers].sort((a, b) => a.zIndex - b.zIndex)
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
}

function mergeLayer(layer: Layer, patch: LayerPatch): Layer {
    // Type safety: patch.type must match layer.type (caller ensures)
    if (layer.type === 'rectangle') {
        if (patch.type !== 'rectangle') return layer
        return {
            ...layer,
            ...patch,
            fill: patch.fill ? patch.fill : layer.fill,
            width: patch.width ?? layer.width,
            height: patch.height ?? layer.height,
            x: patch.x ?? layer.x,
            y: patch.y ?? layer.y,
            rotation: patch.rotation ?? layer.rotation,
            opacity: patch.opacity ?? layer.opacity,
            zIndex: patch.zIndex ?? layer.zIndex,
            visible: patch.visible ?? layer.visible,
        }
    }

    if (layer.type === 'text') {
        if (patch.type !== 'text') return layer
        return {
            ...layer,
            ...patch,
            binding: patch.binding ?? layer.binding,
            textStyle: patch.textStyle ? { ...layer.textStyle, ...patch.textStyle } : layer.textStyle,
            width: patch.width ?? layer.width,
            height: patch.height ?? layer.height,
            x: patch.x ?? layer.x,
            y: patch.y ?? layer.y,
            rotation: patch.rotation ?? layer.rotation,
            opacity: patch.opacity ?? layer.opacity,
            zIndex: patch.zIndex ?? layer.zIndex,
            visible: patch.visible ?? layer.visible,
        }
    }

    return assertNever(layer)
}

export function templateEditorReducer(
    state: TemplateEditorState,
    action: TemplateEditorAction
): TemplateEditorState {
    switch (action.type) {
        case 'SET_TEMPLATE': {
            const next: Template = action.payload
            return { template: next, selectedLayerId: null }
        }

        case 'SELECT_LAYER': {
            return { ...state, selectedLayerId: action.payload }
        }

        case 'ADD_LAYER': {
            const layers = sortLayers([...state.template.layers, action.payload])
            return {
                ...state,
                template: { ...state.template, layers },
                selectedLayerId: action.select ? action.payload.id : state.selectedLayerId,
            }
        }

        case 'DELETE_LAYER': {
            const { id } = action.payload
            const layers = state.template.layers.filter((l) => l.id !== id)
            return {
                ...state,
                template: { ...state.template, layers: sortLayers(layers) },
                selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
            }
        }

        case 'UPDATE_LAYER': {
            const { id, patch } = action.payload
            const layers = state.template.layers.map((l) => {
                if (l.id !== id) return l
                if (l.type !== patch.type) return l
                return mergeLayer(l, patch)
            })
            return { ...state, template: { ...state.template, layers: sortLayers(layers) } }
        }

        case 'MOVE_LAYER': {
            const { id, x, y } = action.payload
            const layers = state.template.layers.map((l) =>
                l.id === id ? { ...l, x, y } : l
            )
            return { ...state, template: { ...state.template, layers: sortLayers(layers) } }
        }

        case 'RESIZE_LAYER': {
            const { id, width, height } = action.payload
            const layers = state.template.layers.map((l) =>
                l.id === id
                    ? { ...l, width: clamp(width, 1, 100000), height: clamp(height, 1, 100000) }
                    : l
            )
            return { ...state, template: { ...state.template, layers: sortLayers(layers) } }
        }

        case 'REORDER_LAYER': {
            const { id, zIndex } = action.payload
            const layers = state.template.layers.map((l) =>
                l.id === id ? { ...l, zIndex } : l
            )
            return { ...state, template: { ...state.template, layers: sortLayers(layers) } }
        }

        case 'SET_BACKGROUND': {
            return {
                ...state,
                template: {
                    ...state.template,
                    canvas: { ...state.template.canvas, background: action.payload },
                },
            }
        }

        case 'PATCH_CANVAS': {
            const patch = action.payload
            return {
                ...state,
                template: {
                    ...state.template,
                    canvas: {
                        ...state.template.canvas,
                        ...patch,
                        background: patch.background ?? state.template.canvas.background,
                    },
                },
            }
        }

        default:
            return state
    }
}
