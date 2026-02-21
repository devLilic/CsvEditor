// File: src\features\csv-editor\state\csv.reducer.ts
import { v4 as uuidv4 } from 'uuid'
import type { CsvState, CsvAction } from './csv.types'
import { EntityTypes } from '../domain/entities'
import type { TitleItem, TitleRow, TitleDelimiter } from '../domain/entities'

function nextTitleRowIndex(titles: TitleItem[]): number {
    // append-only: next index is last *title* rowIndex + 1 (ignores gaps)
    const max = titles
        .filter((t): t is TitleRow => t.kind === 'title')
        .map((t) => t.rowIndex)
        .filter((n): n is number => typeof n === 'number' && Number.isFinite(n))
        .reduce((acc, n) => Math.max(acc, n), -1)
    return max + 1
}

function nextFreeRowIndex(entities: CsvState['entities'], startAt: number): number {
    const occupied = new Set<number>()

    const collect = (arr: Array<{ rowIndex?: number }>) => {
        for (const e of arr) {
            if (typeof e.rowIndex === 'number' && Number.isFinite(e.rowIndex)) {
                occupied.add(e.rowIndex)
            }
        }
    }

    collect(entities.titles)
    collect(entities.persons)
    collect(entities.locations)
    collect(entities.hotTitles)
    collect(entities.waitTitles)
    collect(entities.waitLocations)

    let idx = startAt
    while (occupied.has(idx)) idx += 1
    return idx
}

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

            // Titles: append-only by rowIndex, and support TitleItem model
            if (entityType === EntityTypes.TITLES) {
                const rowIndex = nextTitleRowIndex(state.entities.titles)
                const titleText = String((data as any).title ?? '').trim()

                const newTitle: TitleRow = {
                    id: uuidv4(),
                    kind: 'title',
                    title: titleText,
                    rowIndex,
                }

                return {
                    ...state,
                    entities: {
                        ...state.entities,
                        titles: [...state.entities.titles, newTitle].sort(
                            (a, b) => (a.rowIndex ?? 0) - (b.rowIndex ?? 0)
                        ),
                    },
                    activeEntityType: entityType,
                }
            }

            // other entities: keep existing behavior (no append-only requirement specified)
            const list = state.entities[entityType] as Array<{ rowIndex?: number }>

            const maxRow = list
                .map((e) => e.rowIndex)
                .filter((n): n is number => typeof n === 'number' && Number.isFinite(n))
                .reduce((acc, n) => Math.max(acc, n), -1)

            const rowIndex = maxRow + 1

            return {
                ...state,
                entities: {
                    ...state.entities,
                    [entityType]: [
                        ...(state.entities[entityType] as any[]),
                        { id: uuidv4(), ...data, rowIndex },
                    ],
                },
                activeEntityType: entityType,
            }
        }

        case 'ENTITY_UPDATE': {
            const { entityType, id, data } = action.payload

            if (entityType === EntityTypes.TITLES) {
                return {
                    ...state,
                    entities: {
                        ...state.entities,
                        titles: state.entities.titles.map((t) => {
                            if (t.id !== id) return t
                            if (t.kind !== 'title') return t
                            return {
                                ...t,
                                ...data,
                                title: String((data as any).title ?? t.title),
                            }
                        }),
                    },
                }
            }

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

            if (entityType === EntityTypes.TITLES) {
                return {
                    ...state,
                    entities: {
                        ...state.entities,
                        titles: state.entities.titles.filter((t) => t.id !== id),
                    },
                    selected: state.selected?.id === id ? null : state.selected,
                    onAir: nextOnAir,
                }
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

        // ✅ Canonical: SET_SELECTED should also sync active tab
        case 'SET_SELECTED':
            return {
                ...state,
                selected: action.payload,
                activeEntityType: action.payload?.type ?? state.activeEntityType,
            }

        // 🆕 delimiter support
        case 'TITLE_ADD_DELIMITER_AFTER': {
            const title = state.entities.titles.find((t) => t.id === action.payload.titleId)
            if (!title || typeof title.rowIndex !== 'number') return state

            const desired = title.rowIndex + 1
            const rowIndex = nextFreeRowIndex(state.entities, desired)

            // avoid duplicates at same rowIndex
            const exists = state.entities.titles.some((t) => t.kind === 'delimiter' && t.rowIndex === rowIndex)
            if (exists) return state

            const delim: TitleDelimiter = {
                id: uuidv4(),
                kind: 'delimiter',
                rowIndex,
            }

            return {
                ...state,
                entities: {
                    ...state.entities,
                    titles: [...state.entities.titles, delim].sort(
                        (a, b) => (a.rowIndex ?? 0) - (b.rowIndex ?? 0)
                    ),
                },
            }
        }

        case 'TITLE_DELETE_DELIMITER':
            return {
                ...state,
                entities: {
                    ...state.entities,
                    titles: state.entities.titles.filter((t) => t.id !== action.payload.delimiterId),
                },
            }

        default:
            return state
    }
}
