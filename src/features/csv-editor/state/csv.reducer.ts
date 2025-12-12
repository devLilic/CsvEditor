// features/csv-editor/state/csv.reducer.ts

import { v4 as uuidv4 } from 'uuid'
import type { CsvState, CsvAction } from './csv.types'

/**
 * Reducer PUR
 * ❌ fără side-effects
 * ❌ fără async
 * ❌ fără Electron
 */
export function csvReducer(state: CsvState, action: CsvAction): CsvState {
    switch (action.type) {
        case 'CSV_LOADED': {
            return {
                ...state,
                entities: action.payload,
                isLoaded: true,
            }
        }

        case 'ENTITY_ADD': {
            const { entityType, data } = action.payload

            const newEntity = {
                id: uuidv4(),
                ...data,
            }

            return {
                ...state,
                entities: {
                    ...state.entities,
                    [entityType]: [...state.entities[entityType], newEntity],
                },
            }
        }

        case 'ENTITY_UPDATE': {
            const { entityType, id, data } = action.payload

            return {
                ...state,
                entities: {
                    ...state.entities,
                    [entityType]: state.entities[entityType].map((e) =>
                        e.id === id ? { ...e, ...data } : e
                    ),
                },
            }
        }

        case 'ENTITY_DELETE': {
            const { entityType, id } = action.payload

            return {
                ...state,
                entities: {
                    ...state.entities,
                    [entityType]: state.entities[entityType].filter(
                        (e) => e.id !== id
                    ),
                },
                selected:
                    state.selected?.id === id ? null : state.selected,
            }
        }

        case 'ENTITY_CLEAR_ALL': {
            return {
                ...state,
                entities: action.payload,
                selected: null,
            }
        }

        case 'SELECT_ENTITY': {
            return {
                ...state,
                selected: action.payload,
            }
        }

        default:
            return state
    }
}
