// File: src/features/csv-editor/hooks/useActiveEntityType.ts
import { useCallback } from 'react'
import { useCsvContext } from '../context/CsvContext'
import type { EntityType } from '../domain/entities'

/**
 * Single source of truth pentru Tabs ↔ Lists ↔ Editor
 */
export function useActiveEntityType() {
    const { state, dispatch } = useCsvContext()

    const setActiveEntityType = useCallback(
        (type: EntityType) => {
            dispatch({
                type: 'SET_ACTIVE_ENTITY_TYPE',
                payload: type,
            })
        },
        [dispatch]
    )

    return {
        activeEntityType: state.activeEntityType,
        setActiveEntityType,
    }
}
