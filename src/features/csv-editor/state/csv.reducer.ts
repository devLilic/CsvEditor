import { v4 as uuidv4 } from 'uuid'
import type { CsvState, CsvAction } from './csv.types'

export function csvReducer(state: CsvState, action: CsvAction): CsvState {
    switch (action.type) {
        case 'CSV_LOADED':
            return {
                ...state,
                entities: action.payload,
                isLoaded: true,
            }

        case 'ENTITY_ADD': {
            const { entityType, data } = action.payload
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [entityType]: [
                        ...state.entities[entityType],
                        { id: uuidv4(), ...data },
                    ],
                },
                activeEntityType: entityType,
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
            const nextOnAir = { ...state.onAir }
            if (nextOnAir[entityType] === id) {
                delete nextOnAir[entityType]
            }

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
                onAir: nextOnAir,
            }
        }

        case 'ENTITY_CLEAR_ALL':
            return {
                ...state,
                entities: action.payload,
                selected: null,
                onAir: {},
            }

        case 'SELECT_ENTITY':
            return {
                ...state,
                selected: action.payload,
                activeEntityType:
                    action.payload?.type ?? state.activeEntityType,
            }

        case 'SET_ACTIVE_ENTITY_TYPE':
            return {
                ...state,
                activeEntityType: action.payload,
            }

        // 🆕 ON AIR
        case 'SET_ON_AIR':
            return {
                ...state,
                onAir: {
                    ...state.onAir,
                    [action.payload.type]: action.payload.id,
                },
            }

        case 'CLEAR_ON_AIR': {
            const next = { ...state.onAir }
            delete next[action.payload.type]
            return {
                ...state,
                onAir: next,
            }
        }

        default:
            return state
    }
}

