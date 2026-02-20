// features/csv-editor/utils/csvSerializer.ts

import Papa from 'papaparse'
import type { EntitiesState, TitleRow } from '../domain/entities'
import { CSV_COLUMNS } from './csvParser'

function getMaxRowIndex(state: EntitiesState): number {
    const all: Array<{ rowIndex?: number }> = [
        ...state.titles,
        ...state.persons,
        ...state.locations,
        ...state.hotTitles,
        ...state.waitTitles,
        ...state.waitLocations,
    ]
    const nums = all
        .map((e) => e.rowIndex)
        .filter((n): n is number => typeof n === 'number' && Number.isFinite(n))
    return nums.length ? Math.max(...nums) : -1
}

function findAtRow<T extends { rowIndex?: number }>(arr: T[], rowIndex: number): T | undefined {
    return arr.find((x) => x.rowIndex === rowIndex)
}

function hasAnyDataOnRow(state: EntitiesState, rowIndex: number): boolean {
    const t = state.titles.find((x) => x.kind === 'title' && x.rowIndex === rowIndex) as TitleRow | undefined
    const p = findAtRow(state.persons, rowIndex)
    const l = findAtRow(state.locations, rowIndex)
    const h = findAtRow(state.hotTitles, rowIndex)
    const wt = findAtRow(state.waitTitles, rowIndex)
    const wl = findAtRow(state.waitLocations, rowIndex)

    return Boolean(
        (t && t.title.trim() !== '') ||
        (p && (p.name.trim() !== '' || p.occupation.trim() !== '')) ||
        (l && l.location.trim() !== '') ||
        (h && h.title.trim() !== '') ||
        (wt && wt.title.trim() !== '') ||
        (wl && wl.location.trim() !== '')
    )
}

/**
 * EntitiesState ➜ CSV string
 * Funcție PURĂ, fără side-effects
 *
 * Reguli:
 * - Titlurile se scriu în col2 (Titlu)
 * - Col1 (Nr) se derivează la export (1..n) doar pentru TitleRow, ignorând delimiters
 * - Delimiter = rând complet gol în CSV
 * - Gaps sunt păstrate: folosim rowIndex pentru aliniere
 */
export function serializeCsv(state: EntitiesState): string {
    const maxRow = getMaxRowIndex(state)

    // dacă nu avem rowIndex deloc, fallback la modelul vechi (liste paralele)
    const hasRowIndex = maxRow >= 0

    const rows: Record<string, string>[] = []

    if (!hasRowIndex) {
        const maxLen = Math.max(
            state.titles.length,
            state.persons.length,
            state.locations.length,
            state.hotTitles.length,
            state.waitTitles.length,
            state.waitLocations.length
        )

        let titleNr = 0

        for (let i = 0; i < maxLen; i++) {
            const titleItem = state.titles[i]
            const titleText = titleItem && titleItem.kind === 'title' ? titleItem.title : ''
            if (titleText.trim() !== '') titleNr += 1

            rows.push({
                [CSV_COLUMNS.TITLE_NR]: titleText.trim() !== '' ? String(titleNr) : '',
                [CSV_COLUMNS.TITLE]: titleText ?? '',
                [CSV_COLUMNS.PERSON_NAME]: state.persons[i]?.name ?? '',
                [CSV_COLUMNS.PERSON_OCCUPATION]: state.persons[i]?.occupation ?? '',
                [CSV_COLUMNS.LOCATION]: state.locations[i]?.location ?? '',
                [CSV_COLUMNS.HOT_TITLE]: state.hotTitles[i]?.title ?? '',
                [CSV_COLUMNS.WAIT_TITLE]: state.waitTitles[i]?.title ?? '',
                [CSV_COLUMNS.WAIT_LOCATION]: state.waitLocations[i]?.location ?? '',
            })
        }

        return Papa.unparse(rows, { delimiter: ';' })
    }

    // rowIndex-based serializer (canonical)
    let titleNr = 0

    for (let rowIndex = 0; rowIndex <= maxRow; rowIndex++) {
        const delimiterItem = state.titles.find((t) => t.kind === 'delimiter' && t.rowIndex === rowIndex)
        if (delimiterItem) {
            // delimiter row must be fully empty; if there's data on the same row, ignore delimiter to avoid data loss
            if (hasAnyDataOnRow(state, rowIndex)) {
                console.warn('[csvSerializer] Delimiter collided with data on row', rowIndex, '→ ignored')
            } else {
                rows.push({
                    [CSV_COLUMNS.TITLE_NR]: '',
                    [CSV_COLUMNS.TITLE]: '',
                    [CSV_COLUMNS.PERSON_NAME]: '',
                    [CSV_COLUMNS.PERSON_OCCUPATION]: '',
                    [CSV_COLUMNS.LOCATION]: '',
                    [CSV_COLUMNS.HOT_TITLE]: '',
                    [CSV_COLUMNS.WAIT_TITLE]: '',
                    [CSV_COLUMNS.WAIT_LOCATION]: '',
                })
                continue
            }
        }

        const titleRow = state.titles.find((t) => t.kind === 'title' && t.rowIndex === rowIndex) as TitleRow | undefined
        const titleText = titleRow?.title ?? ''
        if (titleText.trim() !== '') titleNr += 1

        const person = findAtRow(state.persons, rowIndex)
        const location = findAtRow(state.locations, rowIndex)
        const hot = findAtRow(state.hotTitles, rowIndex)
        const wt = findAtRow(state.waitTitles, rowIndex)
        const wl = findAtRow(state.waitLocations, rowIndex)

        rows.push({
            [CSV_COLUMNS.TITLE_NR]: titleText.trim() !== '' ? String(titleNr) : '',
            [CSV_COLUMNS.TITLE]: titleText,
            [CSV_COLUMNS.PERSON_NAME]: person?.name ?? '',
            [CSV_COLUMNS.PERSON_OCCUPATION]: person?.occupation ?? '',
            [CSV_COLUMNS.LOCATION]: location?.location ?? '',
            [CSV_COLUMNS.HOT_TITLE]: hot?.title ?? '',
            [CSV_COLUMNS.WAIT_TITLE]: wt?.title ?? '',
            [CSV_COLUMNS.WAIT_LOCATION]: wl?.location ?? '',
        })
    }

    return Papa.unparse(rows, { delimiter: ';' })
}
