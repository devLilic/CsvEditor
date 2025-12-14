// src/features/template-editor/state/template.types.ts

import type { Template, Layer, Background, Gradient } from '../domain/template.types'

export interface TemplateEditorState {
    template: Template
    selectedLayerId: string | null
}

/**
 * Patch-uri SAFE (nu includ zIndex!)
 */
export type LayerPatch =
    | ({
    type: 'rectangle'
    fill?: { type: 'solid'; value: string } | { type: 'gradient'; value: Gradient }
} & Partial<Omit<Extract<Layer, { type: 'rectangle' }>, 'id' | 'type' | 'zIndex'>>)
    | ({
    type: 'text'
    binding?: string
    textStyle?: Partial<Extract<Layer, { type: 'text' }>['textStyle']>
} & Partial<Omit<Extract<Layer, { type: 'text' }>, 'id' | 'type' | 'zIndex'>>)

export type TemplateEditorAction =
    | { type: 'SET_TEMPLATE'; payload: Template }
    | { type: 'SELECT_LAYER'; payload: string | null }
    | { type: 'ADD_LAYER'; payload: Layer; select?: boolean }
    | { type: 'DELETE_LAYER'; payload: { id: string } }
    | { type: 'UPDATE_LAYER'; payload: { id: string; patch: LayerPatch } }
    | { type: 'MOVE_LAYER'; payload: { id: string; x: number; y: number } }
    | { type: 'RESIZE_LAYER'; payload: { id: string; width: number; height: number } }

    // 🔥 NOU — reorder by index
    | { type: 'REORDER_LAYER'; payload: { id: string; toIndex: number } }

    | { type: 'SET_BACKGROUND'; payload: Background }
    | { type: 'PATCH_CANVAS'; payload: Partial<Template['canvas']> & { background?: Background } }
