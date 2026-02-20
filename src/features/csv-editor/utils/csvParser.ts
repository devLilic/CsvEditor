// features/csv-editor/utils/csvParser.ts

import Papa from 'papaparse'
import { v4 as uuidv4 } from 'uuid'
import type { EntitiesState, Person, TitleItem, TitleRow, Location, SimpleTitle } from '../domain/entities'

/**
 * Coloanele oficiale din CSV
 * (singurul loc unde aceste string-uri există)
 *
 * Schema nouă pentru TITLES:
 *  - Nr (col1)  -> număr de ordine (ignorăm la import; îl derivăm la export)
 *  - Titlu (col2) -> text titlu
 */
export const CSV_COLUMNS = {
    TITLE_NR: 'Nr',
    TITLE: 'Titlu',

    PERSON_NAME: 'Nume',
    PERSON_OCCUPATION: 'Functie',

    LOCATION: 'Locatie',
    HOT_TITLE: 'Ultima Ora',
    WAIT_TITLE: 'Titlu Asteptare',
    WAIT_LOCATION: 'Locatie Asteptare',
} as const

type CsvRow = Record<string, string | undefined>

function cell(row: CsvRow, key: string): string {
    return (row[key] ?? '').trim()
}

function isCompletelyEmptyRow(row: CsvRow): boolean {
    const values = Object.values(row ?? {})
    // Papa poate produce {} pentru un rând gol când header=true
    if (values.length === 0) return true
    return values.every((v) => (v ?? '').trim() === '')
}

/**
 * CSV string ➜ EntitiesState
 * Funcție PURĂ, fără side-effects
 *
 * Reguli:
 * - skipEmptyLines: false (păstrăm rândurile complet goale ca delimiters)
 * - Delimiter row = rând în care TOATE coloanele sunt goale
 * - Titlurile se citesc din col2 (Titlu)
 * - Nr este ignorat la import (derivat la export)
 */
export function parseCsv(content: string): EntitiesState {
    const parsed = Papa.parse<CsvRow>(content, {
        header: true,
        delimiter: ';',
        skipEmptyLines: false,
    })

    const persons: Person[] = []
    const titles: TitleItem[] = []
    const locations: Location[] = []
    const hotTitles: SimpleTitle[] = []
    const waitTitles: SimpleTitle[] = []
    const waitLocations: Location[] = []

    parsed.data.forEach((row, rowIndex) => {
        // ✅ delimiter row (rând complet gol în CSV)
        if (isCompletelyEmptyRow(row)) {
            titles.push({
                id: uuidv4(),
                kind: 'delimiter',
                rowIndex,
            })
            return
        }

        // PERSON
        const name = cell(row, CSV_COLUMNS.PERSON_NAME)
        const occupation = cell(row, CSV_COLUMNS.PERSON_OCCUPATION)
        if (name !== '' || occupation !== '') {
            persons.push({
                id: uuidv4(),
                name,
                occupation,
                rowIndex,
            })
        }

        // TITLE (col2)
        const titleText = cell(row, CSV_COLUMNS.TITLE)
        if (titleText !== '') {
            const t: TitleRow = {
                id: uuidv4(),
                kind: 'title',
                title: titleText,
                rowIndex,
            }
            titles.push(t)
        }

        // LOCATION
        const loc = cell(row, CSV_COLUMNS.LOCATION)
        if (loc !== '') {
            locations.push({
                id: uuidv4(),
                location: loc,
                rowIndex,
            })
        }

        // HOT TITLE
        const hot = cell(row, CSV_COLUMNS.HOT_TITLE)
        if (hot !== '') {
            hotTitles.push({
                id: uuidv4(),
                title: hot,
                rowIndex,
            })
        }

        // WAIT TITLE
        const wt = cell(row, CSV_COLUMNS.WAIT_TITLE)
        if (wt !== '') {
            waitTitles.push({
                id: uuidv4(),
                title: wt,
                rowIndex,
            })
        }

        // WAIT LOCATION
        const wl = cell(row, CSV_COLUMNS.WAIT_LOCATION)
        if (wl !== '') {
            waitLocations.push({
                id: uuidv4(),
                location: wl,
                rowIndex,
            })
        }
    })

    // titles keep stable order by rowIndex
    titles.sort((a, b) => (a.rowIndex ?? 0) - (b.rowIndex ?? 0))

    return {
        persons,
        titles,
        locations,
        hotTitles,
        waitTitles,
        waitLocations,
    }
}
