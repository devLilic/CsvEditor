import type { EntitiesState, EntityType } from '../domain/entities'

export interface SelectedEntity {
    type: EntityType
    id: string
}

export type OnAirMap = Partial<Record<EntityType, string>>

export interface CsvState {
    entities: EntitiesState
    isLoaded: boolean
    selected: SelectedEntity | null
    activeEntityType: EntityType

    // 🆕 ON AIR state
    onAir: OnAirMap
}

export const initialCsvState: CsvState = {
    entities: {
        persons: [],
        titles: [],
        locations: [],
        hotTitles: [],
        waitTitles: [],
        waitLocations: [],
    },
    isLoaded: false,
    selected: null,
    activeEntityType: 'titles',

    // 🆕
    onAir: {},
}

export type CsvAction =
    | { type: 'CSV_LOADED'; payload: EntitiesState }
    | {
    type: 'ENTITY_ADD'
    payload: { entityType: EntityType; data: Record<string, unknown> }
}
    | {
    type: 'ENTITY_UPDATE'
    payload: { entityType: EntityType; id: string; data: Record<string, unknown> }
}
    | {
    type: 'ENTITY_DELETE'
    payload: { entityType: EntityType; id: string }
}
    | { type: 'ENTITY_CLEAR_ALL'; payload: EntitiesState }
    | { type: 'SELECT_ENTITY'; payload: SelectedEntity | null }
    | { type: 'SET_ACTIVE_ENTITY_TYPE'; payload: EntityType }
    | { type: 'SET_ON_AIR'; payload: { type: EntityType; id: string } }
    | { type: 'CLEAR_ON_AIR'; payload: { type: EntityType } }
    | { type: 'SET_SELECTED'; payload: SelectedEntity | null }

    // 🆕 Titles delimiter operations
    | { type: 'TITLE_ADD_DELIMITER_AFTER'; payload: { titleId: string } }
    | { type: 'TITLE_DELETE_DELIMITER'; payload: { delimiterId: string } }
