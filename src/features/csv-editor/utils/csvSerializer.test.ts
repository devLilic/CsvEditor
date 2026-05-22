import { describe, expect, it } from 'vitest'
import { parseCsv, CSV_COLUMNS } from './csvParser'
import { serializeCsv } from './csvSerializer'
import type { EntitiesState } from '../domain/entities'

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

    it('preserves supported values and does not regenerate hot or wait data', () => {
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
        expect(row.hotTitle).toBeUndefined()
        expect(row.waitTitle).toBeUndefined()
        expect(row.waitLocation).toBeUndefined()
    })

    it('serializes new data with stable legacy columns left empty', () => {
        const state: EntitiesState = {
            sections: [
                {
                    id: 'invited-1',
                    kind: 'invited',
                    rows: [
                        {
                            id: 'row-1',
                            title: { id: 'title-1', title: 'Titlu nou' },
                            person: { id: 'person-1', name: 'Ion Popescu', occupation: 'Invitat' },
                            location: { id: 'location-1', location: 'Chisinau' },
                        },
                    ],
                },
            ],
        }

        const reparsed = parseCsv(serializeCsv(state))
        const row = reparsed.sections[0].rows[0]

        expect(row.title?.title).toBe('Titlu nou')
        expect(row.person?.name).toBe('Ion Popescu')
        expect(row.location?.location).toBe('Chisinau')
        expect(row.hotTitle).toBeUndefined()
        expect(row.waitTitle).toBeUndefined()
        expect(row.waitLocation).toBeUndefined()
    })
})
