// src/features/csv-editor/state/csv.reducer.test.ts
import { describe, it, expect } from 'vitest'
import { csvReducer } from './csv.reducer'
import {initialCsvState} from './csv.types'
import type { CsvState } from './csv.types'

describe('csvReducer — CSV_LOADED', () => {
    it('CSV_LOADED sets isLoaded = true', () => {
        const action = {
            type: 'CSV_LOADED',
            payload: initialCsvState.entities,
        } as const

        const nextState: CsvState = csvReducer(initialCsvState, action)

        expect(nextState.isLoaded).toBe(true)
    })
})

describe('csvReducer — CSV_LOADED', () => {
    it('CSV_LOADED sets isLoaded = true', () => {
        const action = {
            type: 'CSV_LOADED',
            payload: initialCsvState.entities,
        } as const

        const nextState: CsvState = csvReducer(initialCsvState, action)

        expect(nextState.isLoaded).toBe(true)
    })

    it('CSV_LOADED does NOT modify selected', () => {
        const stateWithSelection: CsvState = {
            ...initialCsvState,
            selected: {
                type: 'titles',
                id: 'selected-id',
            },
        }

        const action = {
            type: 'CSV_LOADED',
            payload: initialCsvState.entities,
        } as const

        const nextState = csvReducer(stateWithSelection, action)

        expect(nextState.selected).toEqual(stateWithSelection.selected)
    })
})

describe('csvReducer — CSV_LOADED', () => {
    it('CSV_LOADED sets isLoaded = true', () => {
        const action = {
            type: 'CSV_LOADED',
            payload: initialCsvState.entities,
        } as const

        const nextState: CsvState = csvReducer(initialCsvState, action)

        expect(nextState.isLoaded).toBe(true)
    })

    it('CSV_LOADED does NOT modify selected', () => {
        const stateWithSelection: CsvState = {
            ...initialCsvState,
            selected: {
                type: 'titles',
                id: 'selected-id',
            },
        }

        const action = {
            type: 'CSV_LOADED',
            payload: initialCsvState.entities,
        } as const

        const nextState = csvReducer(stateWithSelection, action)

        expect(nextState.selected).toEqual(stateWithSelection.selected)
    })

    it('CSV_LOADED does NOT modify onAir', () => {
        const stateWithOnAir: CsvState = {
            ...initialCsvState,
            onAir: {
                titles: 'on-air-id',
                persons: 'person-on-air',
            },
        }

        const action = {
            type: 'CSV_LOADED',
            payload: initialCsvState.entities,
        } as const

        const nextState = csvReducer(stateWithOnAir, action)

        expect(nextState.onAir).toEqual(stateWithOnAir.onAir)
    })
})

describe('csvReducer — CSV_LOADED', () => {
    it('CSV_LOADED sets isLoaded = true', () => {
        const action = {
            type: 'CSV_LOADED',
            payload: initialCsvState.entities,
        } as const

        const nextState: CsvState = csvReducer(initialCsvState, action)

        expect(nextState.isLoaded).toBe(true)
    })

    it('CSV_LOADED does NOT modify selected', () => {
        const stateWithSelection: CsvState = {
            ...initialCsvState,
            selected: {
                type: 'titles',
                id: 'selected-id',
            },
        }

        const action = {
            type: 'CSV_LOADED',
            payload: initialCsvState.entities,
        } as const

        const nextState = csvReducer(stateWithSelection, action)

        expect(nextState.selected).toEqual(stateWithSelection.selected)
    })

    it('CSV_LOADED does NOT modify onAir', () => {
        const stateWithOnAir: CsvState = {
            ...initialCsvState,
            onAir: {
                titles: 'on-air-id',
                persons: 'person-on-air',
            },
        }

        const action = {
            type: 'CSV_LOADED',
            payload: initialCsvState.entities,
        } as const

        const nextState = csvReducer(stateWithOnAir, action)

        expect(nextState.onAir).toEqual(stateWithOnAir.onAir)
    })

    it('CSV_LOADED does NOT modify activeEntityType', () => {
        const stateWithActiveTab: CsvState = {
            ...initialCsvState,
            activeEntityType: 'locations',
        }

        const action = {
            type: 'CSV_LOADED',
            payload: initialCsvState.entities,
        } as const

        const nextState = csvReducer(stateWithActiveTab, action)

        expect(nextState.activeEntityType).toBe('locations')
    })
})

describe('csvReducer — ENTITY_ADD', () => {
    it('ENTITY_ADD adds entity to correct entityType array', () => {
        const action = {
            type: 'ENTITY_ADD',
            payload: {
                entityType: 'titles',
                data: {
                    title: 'Breaking News',
                },
            },
        } as const

        const nextState: CsvState = csvReducer(initialCsvState, action)

        expect(nextState.entities.titles).toHaveLength(1)
        expect(nextState.entities.titles[0].title).toBe('Breaking News')
    })

    it('ENTITY_ADD does NOT affect selected', () => {
        const stateWithSelection: CsvState = {
            ...initialCsvState,
            selected: {
                type: 'titles',
                id: 'existing-selected-id',
            },
        }

        const action = {
            type: 'ENTITY_ADD',
            payload: {
                entityType: 'titles',
                data: {
                    title: 'Another Title',
                },
            },
        } as const

        const nextState = csvReducer(stateWithSelection, action)

        expect(nextState.selected).toEqual(stateWithSelection.selected)
    })

    it('ENTITY_ADD does NOT affect onAir', () => {
        const stateWithOnAir: CsvState = {
            ...initialCsvState,
            onAir: {
                titles: 'on-air-title-id',
                persons: 'on-air-person-id',
            },
        }

        const action = {
            type: 'ENTITY_ADD',
            payload: {
                entityType: 'titles',
                data: {
                    title: 'Fresh Title',
                },
            },
        } as const

        const nextState = csvReducer(stateWithOnAir, action)

        expect(nextState.onAir).toEqual(stateWithOnAir.onAir)
    })
})

describe('csvReducer — ENTITY_UPDATE', () => {
    it('ENTITY_UPDATE updates existing entity fields', () => {
        const stateWithEntity: CsvState = {
            ...initialCsvState,
            entities: {
                ...initialCsvState.entities,
                titles: [
                    {
                        id: 'title-1',
                        title: 'Old Title',
                    },
                ],
            },
        }

        const action = {
            type: 'ENTITY_UPDATE',
            payload: {
                entityType: 'titles',
                id: 'title-1',
                data: {
                    title: 'Updated Title',
                },
            },
        } as const

        const nextState = csvReducer(stateWithEntity, action)

        expect(nextState.entities.titles).toHaveLength(1)
        expect(nextState.entities.titles[0].title).toBe('Updated Title')
    })
    it('ENTITY_UPDATE preserves entity id', () => {
        const stateWithEntity: CsvState = {
            ...initialCsvState,
            entities: {
                ...initialCsvState.entities,
                titles: [
                    {
                        id: 'title-42',
                        title: 'Initial Title',
                    },
                ],
            },
        }

        const action = {
            type: 'ENTITY_UPDATE',
            payload: {
                entityType: 'titles',
                id: 'title-42',
                data: {
                    title: 'Renamed Title',
                },
            },
        } as const

        const nextState = csvReducer(stateWithEntity, action)

        expect(nextState.entities.titles).toHaveLength(1)
        expect(nextState.entities.titles[0].id).toBe('title-42')
    })

    it('ENTITY_UPDATE on missing entity is no-op', () => {
        const stateWithOtherEntity: CsvState = {
            ...initialCsvState,
            entities: {
                ...initialCsvState.entities,
                titles: [
                    {
                        id: 'existing-id',
                        title: 'Existing Title',
                    },
                ],
            },
        }

        const action = {
            type: 'ENTITY_UPDATE',
            payload: {
                entityType: 'titles',
                id: 'missing-id',
                data: {
                    title: 'Should Not Apply',
                },
            },
        } as const

        const nextState = csvReducer(stateWithOtherEntity, action)

        // entity-ul existent rămâne neschimbat
        expect(nextState.entities.titles).toEqual(
            stateWithOtherEntity.entities.titles
        )
    })
})

describe('csvReducer — ENTITY_DELETE', () => {
    it('ENTITY_DELETE removes entity from entities list', () => {
        const stateWithEntities: CsvState = {
            ...initialCsvState,
            entities: {
                ...initialCsvState.entities,
                titles: [
                    { id: 't1', title: 'Title 1' },
                    { id: 't2', title: 'Title 2' },
                ],
            },
        }

        const action = {
            type: 'ENTITY_DELETE',
            payload: {
                entityType: 'titles',
                id: 't1',
            },
        } as const

        const nextState = csvReducer(stateWithEntities, action)

        expect(nextState.entities.titles).toHaveLength(1)
        expect(nextState.entities.titles[0].id).toBe('t2')
    })

    it('ENTITY_DELETE clears selected if deleted entity was selected', () => {
        const stateWithSelected: CsvState = {
            ...initialCsvState,
            entities: {
                ...initialCsvState.entities,
                titles: [{ id: 't1', title: 'Title 1' }],
            },
            selected: {
                type: 'titles',
                id: 't1',
            },
        }

        const action = {
            type: 'ENTITY_DELETE',
            payload: {
                entityType: 'titles',
                id: 't1',
            },
        } as const

        const nextState = csvReducer(stateWithSelected, action)

        expect(nextState.selected).toBeNull()
    })

    it('ENTITY_DELETE clears onAir[type] if deleted entity was ON AIR', () => {
        const stateWithOnAir: CsvState = {
            ...initialCsvState,
            entities: {
                ...initialCsvState.entities,
                titles: [{ id: 't1', title: 'Title 1' }],
            },
            onAir: {
                titles: 't1',
            },
        }

        const action = {
            type: 'ENTITY_DELETE',
            payload: {
                entityType: 'titles',
                id: 't1',
            },
        } as const

        const nextState = csvReducer(stateWithOnAir, action)

        expect(nextState.onAir).toEqual({})
    })

    it('ENTITY_DELETE does NOT affect other entity types', () => {
        const stateWithMultipleEntities: CsvState = {
            ...initialCsvState,
            entities: {
                ...initialCsvState.entities,
                titles: [{ id: 't1', title: 'Title 1' }],
                persons: [{ id: 'p1', name: 'Person 1' } as any],
            },
        }

        const action = {
            type: 'ENTITY_DELETE',
            payload: {
                entityType: 'titles',
                id: 't1',
            },
        } as const

        const nextState = csvReducer(stateWithMultipleEntities, action)

        expect(nextState.entities.titles).toHaveLength(0)
        expect(nextState.entities.persons).toHaveLength(1)
        expect(nextState.entities.persons[0].id).toBe('p1')
    })
})

describe('csvReducer — SET_SELECTED', () => {
    it('SET_SELECTED sets selected correctly', () => {
        const action = {
            type: 'SET_SELECTED',
            payload: {
                type: 'titles',
                id: 't1',
            },
        } as const

        const nextState = csvReducer(initialCsvState, action)

        expect(nextState.selected).toEqual({
            type: 'titles',
            id: 't1',
        })
    })

    it('SET_SELECTED allows selecting non-existing entity (no validation)', () => {
        const action = {
            type: 'SET_SELECTED',
            payload: {
                type: 'persons',
                id: 'non-existing-id',
            },
        } as const

        const nextState = csvReducer(initialCsvState, action)

        expect(nextState.selected).toEqual({
            type: 'persons',
            id: 'non-existing-id',
        })
    })

    it('SET_SELECTED null clears selection', () => {
        const stateWithSelection: CsvState = {
            ...initialCsvState,
            selected: {
                type: 'titles',
                id: 't1',
            },
        }

        const action = {
            type: 'SET_SELECTED',
            payload: null,
        } as const

        const nextState = csvReducer(stateWithSelection, action)

        expect(nextState.selected).toBeNull()
    })

    it('SET_SELECTED does NOT modify activeEntityType', () => {
        const stateWithActiveType: CsvState = {
            ...initialCsvState,
            activeEntityType: 'persons',
        }

        const action = {
            type: 'SET_SELECTED',
            payload: {
                type: 'titles',
                id: 't99',
            },
        } as const

        const nextState = csvReducer(stateWithActiveType, action)

        expect(nextState.activeEntityType).toBe('persons')
    })
})
