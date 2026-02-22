// src/features/csv-editor/hooks/useSelectedEntity.ts
import { useCallback } from 'react'
import { useCsvContext } from '../context/CsvContext'
import type { EntityType } from '../domain/entities'
import type { SelectedEntity } from '../domain/csv.types'

export function useSelectedEntity() {
    const { state, dispatch } = useCsvContext()
    const selected = state.selected

    const select = useCallback(
        (sectionId: string, entityType: EntityType, id: string) => {
            const payload: SelectedEntity = { sectionId, entityType, id }
            dispatch({ type: 'SET_SELECTED', payload })
        },
        [dispatch]
    )

    const clearSelection = useCallback(() => {
        dispatch({ type: 'SET_SELECTED', payload: null })
    }, [dispatch])

    const isSelected = useCallback(
        (sectionId: string, entityType: EntityType, id: string) => {
            return selected?.sectionId === sectionId && selected?.entityType === entityType && selected?.id === id
        },
        [selected]
    )

    return { selected, select, clearSelection, isSelected }
}