// features/csv-editor/hooks/useSelectedEntity.ts

import { useCallback } from 'react'
import { useCsvContext } from '../context/CsvContext'
import type { EntityType } from '../domain/entities'
import type { SelectedEntity } from '../state/csv.types'

/**
 * Hook de conveniență pentru selecție
 * 👉 UX helper, NU business logic
 */
export function useSelectedEntity() {
    const { state, dispatch } = useCsvContext()

    const selected = state.selected

    const select = useCallback(
        (type: EntityType, id: string) => {
            dispatch({
                type: 'SELECT_ENTITY',
                payload: { type, id },
            })
        },
        [dispatch]
    )

    const clearSelection = useCallback(() => {
        dispatch({
            type: 'SELECT_ENTITY',
            payload: null,
        })
    }, [dispatch])

    const isSelected = useCallback(
        (type: EntityType, id: string) => {
            return selected?.type === type && selected?.id === id
        },
        [selected]
    )

    return {
        selected,
        select,
        clearSelection,
        isSelected,
    }
}
