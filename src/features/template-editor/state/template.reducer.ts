// src/features/template-editor/state/template.reducer.ts

import type { Layer } from '../domain/template.types'
import type {
    LayerPatch,
    TemplateEditorAction,
    TemplateEditorState,
} from './template.types'

function normalizeLayers(layers: Layer[]): Layer[] {
    return layers.map((layer, index) => ({
        ...layer,
        zIndex: index,
    }))
}

function clampIndex(index: number, length: number) {
    return Math.max(0, Math.min(index, length))
}

export function templateEditorReducer(
    state: TemplateEditorState,
    action: TemplateEditorAction
): TemplateEditorState {
    switch (action.type) {
        case 'SET_TEMPLATE': {
            return {
                template: {
                    ...action.payload,
                    layers: normalizeLayers(action.payload.layers ?? []),
                },
                selectedLayerId: null,
            }
        }

        case 'SELECT_LAYER':
            return { ...state, selectedLayerId: action.payload }

        case 'ADD_LAYER': {
            const layers = normalizeLayers([
                ...state.template.layers,
                action.payload,
            ])

            return {
                ...state,
                template: { ...state.template, layers },
                selectedLayerId: action.select
                    ? action.payload.id
                    : state.selectedLayerId,
            }
        }

        case 'DELETE_LAYER': {
            const layers = normalizeLayers(
                state.template.layers.filter((l) => l.id !== action.payload.id)
            )

            return {
                ...state,
                template: { ...state.template, layers },
                selectedLayerId:
                    state.selectedLayerId === action.payload.id
                        ? null
                        : state.selectedLayerId,
            }
        }

        // case 'UPDATE_LAYER': {
        //     const { id, patch } = action.payload
        //
        //     const layers = normalizeLayers(
        //         state.template.layers.map((l) =>
        //             l.id === id && l.type === patch.type
        //                 ? {
        //                     ...l,
        //                     ...patch,
        //                     ...(patch.type === 'text'
        //                         ? { textStyle: { ...l.textStyle, ...patch.textStyle } }
        //                         : {}),
        //                 }
        //                 : l
        //         )
        //     )
        //
        //     return { ...state, template: { ...state.template, layers } }
        // }

        case 'MOVE_LAYER': {
            const { id, x, y } = action.payload
            const layers = normalizeLayers(
                state.template.layers.map((l) =>
                    l.id === id ? { ...l, x, y } : l
                )
            )
            return { ...state, template: { ...state.template, layers } }
        }

        case 'RESIZE_LAYER': {
            const { id, width, height } = action.payload
            const layers = normalizeLayers(
                state.template.layers.map((l) =>
                    l.id === id ? { ...l, width, height } : l
                )
            )
            return { ...state, template: { ...state.template, layers } }
        }

        // 🔥 CANONIC: reorder by array index
        case 'REORDER_LAYER': {
            const { id, toIndex } = action.payload
            const layers = [...state.template.layers]
            const fromIndex = layers.findIndex((l) => l.id === id)
            if (fromIndex === -1) return state

            const clamped = clampIndex(toIndex, layers.length - 1)
            const [moved] = layers.splice(fromIndex, 1)
            layers.splice(clamped, 0, moved)

            return {
                ...state,
                template: {
                    ...state.template,
                    layers: normalizeLayers(layers),
                },
            }
        }

        case 'SET_BACKGROUND':
            return {
                ...state,
                template: {
                    ...state.template,
                    canvas: {
                        ...state.template.canvas,
                        background: action.payload,
                    },
                },
            }

        case 'PATCH_CANVAS':
            return {
                ...state,
                template: {
                    ...state.template,
                    canvas: {
                        ...state.template.canvas,
                        ...action.payload,
                        background:
                            action.payload.background ??
                            state.template.canvas.background,
                    },
                },
            }

        default:
            return state
    }
}
