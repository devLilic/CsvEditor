import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type React from 'react'
import { describe, expect, it } from 'vitest'
import { CsvProvider, useActiveEntityType, useEntities, useSelectedEntity } from '@/features/csv-editor'
import { useCsvContext } from '../context/CsvContext'

function ActiveEntityTypeHarness() {
    const { activeEntityType, setActiveEntityType } = useActiveEntityType()

    return (
        <div>
            <div data-testid="active-type">{activeEntityType}</div>
            <button onClick={() => setActiveEntityType('persons')}>persons</button>
            <button onClick={() => setActiveEntityType('hotTitles')}>hotTitles</button>
        </div>
    )
}

function SelectedEntityHarness() {
    const { selected, select, isSelected } = useSelectedEntity()

    return (
        <div>
            <div data-testid="selected-type">{selected?.entityType ?? 'none'}</div>
            <div data-testid="hot-selected">{String(isSelected('section-1', 'hotTitles', 'hot-1'))}</div>
            <button onClick={() => select('section-1', 'persons', 'person-1')}>select person</button>
            <button onClick={() => select('section-1', 'hotTitles', 'hot-1')}>select hot</button>
        </div>
    )
}

function EntitiesHarness() {
    const { dispatch } = useCsvContext()
    const { getBlockItems, addEntity } = useEntities()

    const seed = () => {
        dispatch({
            type: 'CSV_LOADED',
            payload: {
                sections: [
                    {
                        id: 'section-1',
                        kind: 'invited',
                        rows: [
                            {
                                id: 'row-1',
                                title: { id: 'title-1', title: 'Title' },
                                person: { id: 'person-1', name: 'Name', occupation: 'Role' },
                                location: { id: 'location-1', location: 'Location' },
                                hotTitle: { id: 'hot-1', title: 'Hot' },
                                waitTitle: { id: 'wait-title-1', title: 'Wait' },
                                waitLocation: { id: 'wait-location-1', location: 'Wait location' },
                            },
                        ],
                    },
                ],
            },
        })
    }

    return (
        <div>
            <button onClick={seed}>seed</button>
            <button onClick={() => addEntity('section-1', 'hotTitles', { title: 'Hot add' })}>
                add hot
            </button>
            <div data-testid="titles-count">{getBlockItems('section-1', 'titles').length}</div>
            <div data-testid="hot-count">{getBlockItems('section-1', 'hotTitles').length}</div>
        </div>
    )
}

function renderWithCsvProvider(ui: React.ReactNode) {
    return render(<CsvProvider>{ui}</CsvProvider>)
}

describe('csv editor hooks supported entity types', () => {
    it('does not allow hot or wait entity types to become active through the hook', async () => {
        const user = userEvent.setup()
        renderWithCsvProvider(<ActiveEntityTypeHarness />)

        await user.click(screen.getByRole('button', { name: 'persons' }))
        expect(screen.getByTestId('active-type')).toHaveTextContent('persons')

        await user.click(screen.getByRole('button', { name: 'hotTitles' }))
        expect(screen.getByTestId('active-type')).toHaveTextContent('persons')
    })

    it('does not allow hot or wait entity selection through the hook', async () => {
        const user = userEvent.setup()
        renderWithCsvProvider(<SelectedEntityHarness />)

        await user.click(screen.getByRole('button', { name: 'select person' }))
        expect(screen.getByTestId('selected-type')).toHaveTextContent('persons')

        await user.click(screen.getByRole('button', { name: 'select hot' }))
        expect(screen.getByTestId('selected-type')).toHaveTextContent('persons')
        expect(screen.getByTestId('hot-selected')).toHaveTextContent('false')
    })

    it('does not expose hot or wait block items through useEntities', async () => {
        const user = userEvent.setup()
        renderWithCsvProvider(<EntitiesHarness />)

        await user.click(screen.getByRole('button', { name: 'seed' }))
        expect(screen.getByTestId('titles-count')).toHaveTextContent('1')
        expect(screen.getByTestId('hot-count')).toHaveTextContent('0')

        await user.click(screen.getByRole('button', { name: 'add hot' }))
        expect(screen.getByTestId('hot-count')).toHaveTextContent('0')
    })
})
