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
 * PERSON
 * CSV: Nume / Functie
 */
export interface Person extends BaseEntity {
    name: string
    occupation: string
}

/**
 * TITLE
 * CSV: Titlu
 */
export interface Title extends BaseEntity {
    title: string
}

/**
 * LOCATION
 * CSV: Locatie
 */
export interface Location extends BaseEntity {
    location: string
}

/**
 * STATE CANONIC AL APLICAȚIEI
 * 👉 Single Source of Truth
 */
export interface EntitiesState {
    persons: Person[]
    titles: Title[]
    locations: Location[]
    hotTitles: Title[]
    waitTitles: Title[]
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
