// features/csv-editor/state/csv.types.ts

import {createEmptyEntitiesState, EntitiesState, EntityType} from '../domain/entities'

/**
 * Entitate selectată (referință stabilă)
 */
export interface SelectedEntity {
    type: EntityType
    id: string
}

/**
 * Starea globală CSV Editor
 * ❌ Fără Electron
 * ❌ Fără CSV
 * ❌ Fără side-effects
 */
export interface CsvState {
    entities: EntitiesState
    isLoaded: boolean
    selected: SelectedEntity | null
}

/**
 * Stare inițială (goală)
 */
export const initialCsvState: CsvState = {
    entities: createEmptyEntitiesState(),
    isLoaded: false,
    selected: null,
}

/**
 * Tipuri de acțiuni permise
 */
export type CsvAction =
    | {
    type: 'CSV_LOADED'
    payload: EntitiesState
}
    | {
    type: 'ENTITY_ADD'
    payload: {
        entityType: EntityType
        data: any
    }
}
    | {
    type: 'ENTITY_UPDATE'
    payload: {
        entityType: EntityType
        id: string
        data: any
    }
}
    | {
    type: 'ENTITY_DELETE'
    payload: {
        entityType: EntityType
        id: string
    }
}
    | {
    type: 'ENTITY_CLEAR_ALL'
    payload: EntitiesState
}
    | {
    type: 'SELECT_ENTITY'
    payload: SelectedEntity | null
}
