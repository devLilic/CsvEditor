// features/csv-editor/utils/csvSerializer.ts

import Papa from 'papaparse'
import type { EntitiesState } from '../domain/entities'
import { CSV_COLUMNS } from './csvParser'

/**
 * EntitiesState ➜ CSV string
 * Funcție PURĂ, fără side-effects
 */
export function serializeCsv(state: EntitiesState): string {
    const maxLen = Math.max(
        state.persons.length,
        state.titles.length,
        state.locations.length,
        state.hotTitles.length,
        state.waitTitles.length,
        state.waitLocations.length
    )

    const rows: Record<string, string>[] = []

    for (let i = 0; i < maxLen; i++) {
        rows.push({
            [CSV_COLUMNS.PERSON_NAME]: state.persons[i]?.name ?? '',
            [CSV_COLUMNS.PERSON_OCCUPATION]: state.persons[i]?.occupation ?? '',
            [CSV_COLUMNS.TITLE]: state.titles[i]?.title ?? '',
            [CSV_COLUMNS.LOCATION]: state.locations[i]?.location ?? '',
            [CSV_COLUMNS.HOT_TITLE]: state.hotTitles[i]?.title ?? '',
            [CSV_COLUMNS.WAIT_TITLE]: state.waitTitles[i]?.title ?? '',
            [CSV_COLUMNS.WAIT_LOCATION]: state.waitLocations[i]?.location ?? '',
        })
    }

    return Papa.unparse(rows, {
        delimiter: ';',
    })
}
