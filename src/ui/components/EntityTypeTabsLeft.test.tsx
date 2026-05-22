import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EntityTypeTabsLeft } from './EntityTypeTabsLeft'

const csvHooks = vi.hoisted(() => ({
    activeEntityType: 'titles',
    setActiveEntityType: vi.fn(),
    clearSelection: vi.fn(),
}))

vi.mock('@/features/csv-editor', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/features/csv-editor')>()

    return {
        ...actual,
        useActiveEntityType: () => ({
            activeEntityType: csvHooks.activeEntityType,
            setActiveEntityType: csvHooks.setActiveEntityType,
        }),
        useSelectedEntity: () => ({
            clearSelection: csvHooks.clearSelection,
        }),
    }
})

beforeEach(() => {
    csvHooks.activeEntityType = 'titles'
    csvHooks.setActiveEntityType.mockClear()
    csvHooks.clearSelection.mockClear()
})

afterEach(() => {
    cleanup()
})

describe('EntityTypeTabsLeft', () => {
    it('renders only the supported entity type tabs', () => {
        render(<EntityTypeTabsLeft />)

        expect(screen.getByRole('button', { name: 'Titluri' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Persoane' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Locații' })).toBeInTheDocument()

        expect(screen.queryByRole('button', { name: 'Ultima oră' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Titluri așteptare' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Locații așteptare' })).not.toBeInTheDocument()
    })

    it('clears selection and changes active type when switching tabs', async () => {
        const user = userEvent.setup()
        render(<EntityTypeTabsLeft />)

        await user.click(screen.getByRole('button', { name: 'Persoane' }))

        expect(csvHooks.clearSelection).toHaveBeenCalledTimes(1)
        expect(csvHooks.setActiveEntityType).toHaveBeenCalledWith('persons')
    })

    it('does not clear selection when clicking the already active tab', async () => {
        const user = userEvent.setup()
        render(<EntityTypeTabsLeft />)

        await user.click(screen.getByRole('button', { name: 'Titluri' }))

        expect(csvHooks.clearSelection).not.toHaveBeenCalled()
        expect(csvHooks.setActiveEntityType).not.toHaveBeenCalled()
    })
})
