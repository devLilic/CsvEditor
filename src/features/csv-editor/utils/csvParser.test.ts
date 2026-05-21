import { describe, expect, it } from 'vitest'
import { parseCsv } from './csvParser'

const header = 'Nr;Titlu;Nume;Functie;Locatie;Ultima Ora;Titlu Asteptare;Locatie Asteptare'

describe('parseCsv', () => {
    it('parses CSV without markers as a single invited section', () => {
        const csv = [
            header,
            '1;Titlu simplu;Ion Popescu;Reporter;Chisinau;Urgent;Asteptare;Studio',
        ].join('\n')

        const result = parseCsv(csv)

        expect(result.sections).toHaveLength(1)
        expect(result.sections[0].kind).toBe('invited')
        expect(result.sections[0].rows).toHaveLength(1)
        expect(result.sections[0].rows[0].title?.title).toBe('Titlu simplu')
        expect(result.sections[0].rows[0].person?.name).toBe('Ion Popescu')
        expect(result.sections[0].rows[0].waitTitle?.title).toBe('Asteptare')
        expect(result.sections[0].rows[0].waitLocation?.location).toBe('Studio')
    })

    it('creates BETA and INVITATI sections in marker order with invited last', () => {
        const csv = [
            header,
            ';--- beta 1 - Externe ---;;;;;;',
            '1;Titlu beta;Maria Rusu;Editor;Bruxelles;Ultima ora beta;;;',
            ';--- INVITATI ---;;;;;;',
            '1;Titlu invitati;Ion Popescu;Invitat;Chisinau;Urgent;Titlu asteptare;Locatie asteptare',
        ].join('\n')

        const result = parseCsv(csv)

        expect(result.sections.map((section) => section.kind)).toEqual(['beta', 'invited'])
        expect(result.sections[0].betaIndex).toBe(1)
        expect(result.sections[0].betaTitle).toBe('Externe')
        expect(result.sections[0].rows[0].title?.title).toBe('Titlu beta')
        expect(result.sections[0].rows[0].waitTitle).toBeUndefined()
        expect(result.sections[1].rows[0].waitTitle?.title).toBe('Titlu asteptare')
    })

    it('does not create false entities from empty rows', () => {
        const csv = [
            header,
            ';;;;;;;;',
            '1;;;;;;;',
            ';--- INVITATI ---;;;;;;',
            ';;;;;;;;',
            '1;Titlu valid;;;;;;',
            ';;;;;;;;',
        ].join('\n')

        const result = parseCsv(csv)

        expect(result.sections).toHaveLength(1)
        expect(result.sections[0].kind).toBe('invited')
        expect(result.sections[0].rows).toHaveLength(1)
        expect(result.sections[0].rows[0].title?.title).toBe('Titlu valid')
        expect(result.sections[0].rows[0].person).toBeUndefined()
        expect(result.sections[0].rows[0].location).toBeUndefined()
    })
})
