// features/csv-editor/domain/entities.ts

export const EntityTypes = {
    PERSONS: 'persons',
    TITLES: 'titles',
    LOCATIONS: 'locations',
    HOT_TITLES: 'hotTitles',
    WAIT_TITLES: 'waitTitles',
    WAIT_LOCATIONS: 'waitLocations',
} as const

/**
 * Tipurile de entități suportate de CSV Editor
 * (chei folosite peste tot: reducer, hooks, UI)
 */
export type EntityType = typeof EntityTypes[keyof typeof EntityTypes]

/**
 * Bază comună pentru toate entitățile
 */
export interface BaseEntity {
    id: string
}

/**
 * Entități care pot fi aliniate pe rânduri CSV.
 * rowIndex este 0-based (index de rând în CSV).
 */
export interface RowIndexed {
    rowIndex?: number
}

/**
 * PERSON
 * CSV: Nume / Functie
 */
export interface Person extends BaseEntity, RowIndexed {
    name: string
    occupation: string
}

/**
 * TITLE schema nouă:
 * - CSV col1: Nr (derivat la export)
 * - CSV col2: Titlu (text)
 *
 * În state, titles poate conține și delimiters (rând complet gol în CSV).
 */
export interface TitleRow extends BaseEntity, RowIndexed {
    kind: 'title'
    title: string
}

export interface TitleDelimiter extends BaseEntity, RowIndexed {
    kind: 'delimiter'
}

export type TitleItem = TitleRow | TitleDelimiter

/**
 * LOCATION
 * CSV: Locatie
 */
export interface Location extends BaseEntity, RowIndexed {
    location: string
}

/**
 * Refolosim modelul Title simplu pentru hotTitles/waitTitles
 * (nu au delimiter logic).
 */
export interface SimpleTitle extends BaseEntity, RowIndexed {
    title: string
}

/**
 * STATE CANONIC AL APLICAȚIEI
 * 👉 Single Source of Truth
 */
export interface EntitiesState {
    persons: Person[]
    titles: TitleItem[]
    locations: Location[]
    hotTitles: SimpleTitle[]
    waitTitles: SimpleTitle[]
    waitLocations: Location[]
}

/**
 * Helper pentru creare state gol (evită duplicări)
 */
export function createEmptyEntitiesState(): EntitiesState {
    return {
        persons: [],
        titles: [],
        locations: [],
        hotTitles: [],
        waitTitles: [],
        waitLocations: [],
    }
}
