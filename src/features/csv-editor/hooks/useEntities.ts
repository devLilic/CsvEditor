// features/csv-editor/hooks/useEntities.ts

import { useCallback } from 'react'
import { useCsvContext } from '../context/CsvContext'
import type { EntityType } from '../domain/entities'
import type { SelectedEntity } from '../state/csv.types'

/**
 * CRUD logic pentru entități
 * ❌ Fără Electron
 * ❌ Fără CSV
 * ❌ Fără side-effects
 *
 * UI consumă DOAR acest hook.
 */
export function useEntities() {
    const { state, dispatch } = useCsvContext()

    // -------- READ --------
    const getEntities = useCallback(
        <T = unknown>(type: EntityType): T[] => {
            return state.entities[type] as T[]
        },
        [state.entities]
    )

    const selected = state.selected

    // -------- SELECT --------
    const selectEntity = useCallback(
        (entity: SelectedEntity | null) => {
            dispatch({
                type: 'SELECT_ENTITY',
                payload: entity,
            })
        },
        [dispatch]
    )

    // -------- CREATE --------
    const addEntity = useCallback(
        (entityType: EntityType, data: Record<string, unknown>) => {
            dispatch({
                type: 'ENTITY_ADD',
                payload: { entityType, data },
            })
        },
        [dispatch]
    )

    // -------- UPDATE --------
    const updateEntity = useCallback(
        (entityType: EntityType, id: string, data: Record<string, unknown>) => {
            dispatch({
                type: 'ENTITY_UPDATE',
                payload: { entityType, id, data },
            })
        },
        [dispatch]
    )

    // -------- DELETE --------
    const deleteEntity = useCallback(
        (entityType: EntityType, id: string) => {
            dispatch({
                type: 'ENTITY_DELETE',
                payload: { entityType, id },
            })
        },
        [dispatch]
    )

    // -------- CLEAR ALL --------
    const clearAll = useCallback(
        (nextStateEntities: typeof state.entities) => {
            dispatch({
                type: 'ENTITY_CLEAR_ALL',
                payload: nextStateEntities,
            })
        },
        [dispatch, state.entities]
    )

    return {
        // state
        entities: state.entities,
        selected,

        // actions
        getEntities,
        selectEntity,
        addEntity,
        updateEntity,
        deleteEntity,
        clearAll,
    }
}
