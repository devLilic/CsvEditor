// features/csv-editor/utils/csvParser.ts

import Papa from 'papaparse'
import { v4 as uuidv4 } from 'uuid'
import type { EntitiesState, Person, Title, Location } from '../domain/entities'

/**
 * Coloanele oficiale din CSV
 * (singurul loc unde aceste string-uri există)
 */
export const CSV_COLUMNS = {
    PERSON_NAME: 'Nume',
    PERSON_OCCUPATION: 'Functie',
    TITLE: 'Titlu',
    LOCATION: 'Locatie',
    HOT_TITLE: 'Ultima Ora',
    WAIT_TITLE: 'Titlu Asteptare',
    WAIT_LOCATION: 'Locatie Asteptare',
} as const

type CsvRow = Record<string, string | undefined>

/**
 * CSV string ➜ EntitiesState
 * Funcție PURĂ, fără side-effects
 */
export function parseCsv(content: string): EntitiesState {
    const parsed = Papa.parse<CsvRow>(content, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
    })

    const persons: Person[] = []
    const titles: Title[] = []
    const locations: Location[] = []
    const hotTitles: Title[] = []
    const waitTitles: Title[] = []
    const waitLocations: Location[] = []

    for (const row of parsed.data) {
        // PERSON
        if (row[CSV_COLUMNS.PERSON_NAME] || row[CSV_COLUMNS.PERSON_OCCUPATION]) {
            persons.push({
                id: uuidv4(),
                name: row[CSV_COLUMNS.PERSON_NAME]?.trim() ?? '',
                occupation: row[CSV_COLUMNS.PERSON_OCCUPATION]?.trim() ?? '',
            })
        }

        // TITLE
        if (row[CSV_COLUMNS.TITLE]) {
            titles.push({
                id: uuidv4(),
                title: row[CSV_COLUMNS.TITLE]!.trim(),
            })
        }

        // LOCATION
        if (row[CSV_COLUMNS.LOCATION]) {
            locations.push({
                id: uuidv4(),
                location: row[CSV_COLUMNS.LOCATION]!.trim(),
            })
        }

        // HOT TITLE
        if (row[CSV_COLUMNS.HOT_TITLE]) {
            hotTitles.push({
                id: uuidv4(),
                title: row[CSV_COLUMNS.HOT_TITLE]!.trim(),
            })
        }

        // WAIT TITLE
        if (row[CSV_COLUMNS.WAIT_TITLE]) {
            waitTitles.push({
                id: uuidv4(),
                title: row[CSV_COLUMNS.WAIT_TITLE]!.trim(),
            })
        }

        // WAIT LOCATION
        if (row[CSV_COLUMNS.WAIT_LOCATION]) {
            waitLocations.push({
                id: uuidv4(),
                location: row[CSV_COLUMNS.WAIT_LOCATION]!.trim(),
            })
        }
    }

    return {
        persons,
        titles,
        locations,
        hotTitles,
        waitTitles,
        waitLocations,
    }
}
