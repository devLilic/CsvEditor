import { describe, expect, it } from 'vitest'
import { parseCsv, CSV_COLUMNS } from './csvParser'
import { serializeCsv } from './csvSerializer'

const importantColumns = [
    CSV_COLUMNS.TITLE,
    CSV_COLUMNS.PERSON_NAME,
    CSV_COLUMNS.PERSON_OCCUPATION,
    CSV_COLUMNS.LOCATION,
    CSV_COLUMNS.HOT_TITLE,
    CSV_COLUMNS.WAIT_TITLE,
    CSV_COLUMNS.WAIT_LOCATION,
]

describe('serializeCsv', () => {
    it('keeps important columns after serializeCsv(parseCsv(csv))', () => {
        const csv = [
            'Nr;Titlu;Nume;Functie;Locatie;Ultima Ora;Titlu Asteptare;Locatie Asteptare',
            ';--- beta 1 - Externe ---;;;;;;',
            '1;Titlu beta;Maria Rusu;Editor;Bruxelles;Ultima ora beta;;;',
            ';--- INVITATI ---;;;;;;',
            '1;Titlu invitati;Ion Popescu;Invitat;Chisinau;Urgent;Titlu asteptare;Locatie asteptare',
        ].join('\n')

        const serialized = serializeCsv(parseCsv(csv))
        const [serializedHeader] = serialized.split(/\r?\n/)
        const columns = serializedHeader.split(';')

        for (const column of importantColumns) {
            expect(columns).toContain(column)
        }
    })

    it('preserves important values through parse and serialize roundtrip', () => {
        const csv = [
            'Nr;Titlu;Nume;Functie;Locatie;Ultima Ora;Titlu Asteptare;Locatie Asteptare',
            ';--- INVITATI ---;;;;;;',
            '1;Titlu invitati;Ion Popescu;Invitat;Chisinau;Urgent;Titlu asteptare;Locatie asteptare',
        ].join('\n')

        const reparsed = parseCsv(serializeCsv(parseCsv(csv)))
        const row = reparsed.sections[0].rows[0]

        expect(row.title?.title).toBe('Titlu invitati')
        expect(row.person?.name).toBe('Ion Popescu')
        expect(row.person?.occupation).toBe('Invitat')
        expect(row.location?.location).toBe('Chisinau')
        expect(row.hotTitle?.title).toBe('Urgent')
        expect(row.waitTitle?.title).toBe('Titlu asteptare')
        expect(row.waitLocation?.location).toBe('Locatie asteptare')
    })
})
