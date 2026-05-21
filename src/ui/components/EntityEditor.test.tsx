import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EntityEditor } from './EntityEditor'
import { EditModeProvider } from '@/ui/context/EditModeContext'

const csvHooks = vi.hoisted(() => ({
    activeEntityType: 'titles' as
        | 'titles'
        | 'persons'
        | 'locations'
        | 'hotTitles'
        | 'waitTitles'
        | 'waitLocations',
    addEntity: vi.fn(),
    updateEntity: vi.fn(),
    clearSelection: vi.fn(),
    setActiveEntityType: vi.fn((type) => {
        csvHooks.activeEntityType = type
    }),
}))

vi.mock('@/features/csv-editor', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/features/csv-editor')>()

    return {
        ...actual,
        useEntities: () => ({
            activeSectionId: 'invited-1',
            activeSection: { id: 'invited-1', kind: 'invited', rows: [] },
            getBlockItems: vi.fn(() => []),
            addEntity: csvHooks.addEntity,
            updateEntity: csvHooks.updateEntity,
        }),
        useSelectedEntity: () => ({
            selected: null,
            clearSelection: csvHooks.clearSelection,
        }),
        useActiveEntityType: () => ({
            activeEntityType: csvHooks.activeEntityType,
            setActiveEntityType: csvHooks.setActiveEntityType,
        }),
        useQuickTitles: () => ({
            quickTitles: [],
            addQuickTitle: vi.fn(),
            removeQuickTitle: vi.fn(),
        }),
    }
})

beforeEach(() => {
    csvHooks.activeEntityType = 'titles'
    csvHooks.addEntity.mockClear()
    csvHooks.updateEntity.mockClear()
    csvHooks.clearSelection.mockClear()
    csvHooks.setActiveEntityType.mockClear()

    class ResizeObserverMock {
        observe() {}
        unobserve() {}
        disconnect() {}
    }

    Object.defineProperty(window, 'ResizeObserver', {
        writable: true,
        configurable: true,
        value: ResizeObserverMock,
    })
})

afterEach(() => {
    cleanup()
})

function renderEntityEditor() {
    return render(
        <EditModeProvider>
            <EntityEditor />
        </EditModeProvider>
    )
}

describe('EntityEditor', () => {
    it('renders without crashing in a valid CSV context and shows the preview', () => {
        renderEntityEditor()

        expect(screen.getByText(/PREVIEW/i)).toBeInTheDocument()
        expect(screen.getByLabelText('Titlu')).toBeInTheDocument()
    })

    it('allows filling the title input and enables Adauga when valid', async () => {
        const user = userEvent.setup()
        renderEntityEditor()

        const titleInput = screen.getByLabelText('Titlu')
        const addButton = screen.getByRole('button', { name: /Adaug/i })

        expect(addButton).toBeDisabled()

        await user.type(titleInput, 'Breaking News')

        expect(titleInput).toHaveValue('Breaking News')
        expect(addButton).toBeEnabled()
    })

    it('saving a valid title calls addEntity with the active section and payload', async () => {
        const user = userEvent.setup()
        renderEntityEditor()

        await user.type(screen.getByLabelText('Titlu'), 'Breaking News')
        await user.click(screen.getByRole('button', { name: /Adaug/i }))

        expect(csvHooks.addEntity).toHaveBeenCalledTimes(1)
        expect(csvHooks.addEntity).toHaveBeenCalledWith('invited-1', 'titles', {
            title: 'BREAKING NEWS',
        })
    })

    it('changing the active entity type does not crash', () => {
        const { rerender } = render(
            <EditModeProvider>
                <EntityEditor />
            </EditModeProvider>
        )

        csvHooks.activeEntityType = 'persons'
        rerender(
            <EditModeProvider>
                <EntityEditor />
            </EditModeProvider>
        )

        expect(screen.getByLabelText('Nume')).toBeInTheDocument()
        expect(screen.getByText(/PREVIEW/i)).toBeInTheDocument()
    })
})
