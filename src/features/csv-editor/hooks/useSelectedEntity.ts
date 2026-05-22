// src/features/csv-editor/hooks/useSelectedEntity.ts
import { useCallback } from 'react'
import { useCsvContext } from '../context/CsvContext'
import type { EntityType } from '../domain/entities'
import type { SelectedEntity } from '../domain/csv.types'
import { isSupportedEntityType } from '../domain/supportedEntityTypes'

export function useSelectedEntity() {
    const { state, dispatch } = useCsvContext()
    const selected = state.selected && isSupportedEntityType(state.selected.entityType)
        ? state.selected
        : null

    const select = useCallback(
        (sectionId: string, entityType: EntityType, id: string) => {
            if (!isSupportedEntityType(entityType)) return

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
            if (!isSupportedEntityType(entityType)) return false

            return selected?.sectionId === sectionId && selected?.entityType === entityType && selected?.id === id
        },
        [selected]
    )

    return { selected, select, clearSelection, isSelected }
}
