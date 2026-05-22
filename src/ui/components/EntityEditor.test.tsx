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
    it('uses titleTemplate for titles', () => {
        const { container } = renderEntityEditor()

        expect(container.querySelector('[data-layer-id="title-main-text"]')).toBeInTheDocument()
        expect(container.querySelector('[data-layer-id="person-name-text"]')).not.toBeInTheDocument()
        expect(container.querySelector('[data-layer-id="location-text"]')).not.toBeInTheDocument()
    })

    it('uses personTemplate for persons', () => {
        csvHooks.activeEntityType = 'persons'
        const { container } = renderEntityEditor()

        expect(container.querySelector('[data-layer-id="person-name-text"]')).toBeInTheDocument()
        expect(container.querySelector('[data-layer-id="person-occupation-text"]')).toBeInTheDocument()
        expect(container.querySelector('[data-layer-id="title-main-text"]')).not.toBeInTheDocument()
    })

    it('uses locationTemplate for locations', () => {
        csvHooks.activeEntityType = 'locations'
        const { container } = renderEntityEditor()

        expect(container.querySelector('[data-layer-id="location-text"]')).toBeInTheDocument()
        expect(container.querySelector('[data-layer-id="title-main-text"]')).not.toBeInTheDocument()
        expect(container.querySelector('[data-layer-id="person-name-text"]')).not.toBeInTheDocument()
    })

    it('renders without crashing in a valid CSV context and shows the preview', () => {
        renderEntityEditor()

        expect(screen.getByTestId('entity-preview-container')).toHaveClass(
            'min-h-0',
            'min-w-0',
            'overflow-hidden'
        )
        expect(screen.getByTestId('preview16x9-root')).toBeInTheDocument()
        expect(screen.getByLabelText('Titlu')).toBeInTheDocument()
    })

    it('passes template and data to the new preview API', async () => {
        const user = userEvent.setup()
        const { container } = renderEntityEditor()

        expect(screen.getByTestId('preview16x9-root')).toBeInTheDocument()
        expect(container.querySelector('[data-layer-id="title-main-text"]')).toBeInTheDocument()
        expect(screen.getByText('TITLU')).toBeInTheDocument()

        await user.type(screen.getByLabelText('Titlu'), 'Breaking News')

        expect(screen.getByText('BREAKING NEWS')).toBeInTheDocument()
    })

    it('does not render the old Preview16x9 entityType/content/measureText UI', () => {
        renderEntityEditor()

        expect(screen.queryByText(/PREVIEW/i)).not.toBeInTheDocument()
    })

    it('allows filling the title input and enables Adauga when valid', async () => {
        const user = userEvent.setup()
        renderEntityEditor()

        const titleInput = screen.getByLabelText('Titlu')
        const addButton = screen.getByRole('button', { name: /Adaug/i })

        expect(addButton).toBeDisabled()

        await user.type(titleInput, 'Breaking News')

        expect(titleInput).toHaveValue('Breaking News')
        expect(screen.getByText('BREAKING NEWS')).toBeInTheDocument()
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

    it('saving a valid person uses name and occupation fields', async () => {
        csvHooks.activeEntityType = 'persons'
        const user = userEvent.setup()
        renderEntityEditor()

        await user.type(screen.getByLabelText('Nume'), 'Ana Popescu')
        await user.type(screen.getByLabelText('Funcție'), 'Reporter')

        expect(screen.getByText('ANA POPESCU')).toBeInTheDocument()
        expect(screen.getByText('Reporter')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: /Adaug/i }))

        expect(csvHooks.addEntity).toHaveBeenCalledTimes(1)
        expect(csvHooks.addEntity).toHaveBeenCalledWith('invited-1', 'persons', {
            name: 'ANA POPESCU',
            occupation: 'Reporter',
        })
    })

    it('saving a valid location uses the location field', async () => {
        csvHooks.activeEntityType = 'locations'
        const user = userEvent.setup()
        renderEntityEditor()

        await user.type(screen.getByLabelText('Locație'), 'Chișinău')
        expect(screen.getByText('CHIȘINĂU')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: /Adaug/i }))

        expect(csvHooks.addEntity).toHaveBeenCalledTimes(1)
        expect(csvHooks.addEntity).toHaveBeenCalledWith('invited-1', 'locations', {
            location: 'CHIȘINĂU',
        })
    })

    it('does not render form inputs for unsupported hot or wait entity types', () => {
        csvHooks.activeEntityType = 'hotTitles'
        const { rerender } = renderEntityEditor()

        expect(screen.queryByLabelText('Titlu')).not.toBeInTheDocument()
        expect(screen.queryByLabelText('Nume')).not.toBeInTheDocument()
        expect(screen.queryByLabelText('Locație')).not.toBeInTheDocument()

        csvHooks.activeEntityType = 'waitLocations'
        rerender(
            <EditModeProvider>
                <EntityEditor />
            </EditModeProvider>
        )

        expect(screen.queryByLabelText('Titlu')).not.toBeInTheDocument()
        expect(screen.queryByLabelText('Nume')).not.toBeInTheDocument()
        expect(screen.queryByLabelText('Locație')).not.toBeInTheDocument()
    })

    it('does not use dedicated templates for hot or wait entity types', () => {
        csvHooks.activeEntityType = 'hotTitles'
        const { container, rerender } = renderEntityEditor()

        expect(container.querySelector('[data-layer-id="title-main-text"]')).toBeInTheDocument()
        expect(container.innerHTML).not.toMatch(/hot|wait/i)

        csvHooks.activeEntityType = 'waitTitles'
        rerender(
            <EditModeProvider>
                <EntityEditor />
            </EditModeProvider>
        )

        expect(container.querySelector('[data-layer-id="title-main-text"]')).toBeInTheDocument()
        expect(container.innerHTML).not.toMatch(/hot|wait/i)

        csvHooks.activeEntityType = 'waitLocations'
        rerender(
            <EditModeProvider>
                <EntityEditor />
            </EditModeProvider>
        )

        expect(container.querySelector('[data-layer-id="title-main-text"]')).toBeInTheDocument()
        expect(container.innerHTML).not.toMatch(/hot|wait/i)
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
        expect(screen.getByTestId('preview16x9-root')).toBeInTheDocument()
    })
})
