import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EntityList } from './EntityList'
import { EditModeProvider } from '@/ui/context/EditModeContext'
import { TitleFilterProvider } from '@/ui/context/TitleFilterContext'

const csvHooks = vi.hoisted(() => ({
    activeEntityType: 'titles' as
        | 'titles'
        | 'persons'
        | 'locations'
        | 'hotTitles'
        | 'waitTitles'
        | 'waitLocations',
    getBlockItems: vi.fn(),
    deleteEntity: vi.fn(),
    select: vi.fn(),
    isSelected: vi.fn(() => false),
    isOnAir: vi.fn(() => false),
    setOnAir: vi.fn(),
    clearOnAir: vi.fn(),
}))

vi.mock('@/features/csv-editor', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/features/csv-editor')>()

    return {
        ...actual,
        useEntities: () => ({
            activeSectionId: 'invited-1',
            activeSection: { id: 'invited-1', kind: 'invited', rows: [] },
            getBlockItems: csvHooks.getBlockItems,
            deleteEntity: csvHooks.deleteEntity,
        }),
        useActiveEntityType: () => ({
            activeEntityType: csvHooks.activeEntityType,
        }),
        useSelectedEntity: () => ({
            select: csvHooks.select,
            isSelected: csvHooks.isSelected,
        }),
        useOnAir: () => ({
            isOnAir: csvHooks.isOnAir,
            setOnAir: csvHooks.setOnAir,
            clearOnAir: csvHooks.clearOnAir,
        }),
    }
})

beforeEach(() => {
    csvHooks.activeEntityType = 'titles'
    csvHooks.getBlockItems.mockReset()
    csvHooks.deleteEntity.mockClear()
    csvHooks.select.mockClear()
    csvHooks.isSelected.mockClear()
    csvHooks.isSelected.mockReturnValue(false)
    csvHooks.isOnAir.mockClear()
    csvHooks.isOnAir.mockReturnValue(false)
    csvHooks.setOnAir.mockClear()
    csvHooks.clearOnAir.mockClear()
})

afterEach(() => {
    cleanup()
})

function renderEntityList() {
    return render(
        <EditModeProvider>
            <TitleFilterProvider>
                <EntityList />
            </TitleFilterProvider>
        </EditModeProvider>
    )
}

describe('EntityList', () => {
    it('renders titles', () => {
        csvHooks.getBlockItems.mockReturnValue([
            { entityType: 'titles', id: 'title-1', data: { title: 'BREAKING NEWS' } },
        ])

        renderEntityList()

        expect(csvHooks.getBlockItems).toHaveBeenCalledWith('invited-1', 'titles')
        expect(screen.getByText('BREAKING NEWS')).toBeInTheDocument()
        expect(screen.getByText('1.')).toBeInTheDocument()
    })

    it('renders persons', () => {
        csvHooks.activeEntityType = 'persons'
        csvHooks.getBlockItems.mockReturnValue([
            {
                entityType: 'persons',
                id: 'person-1',
                data: { name: 'ANA POPESCU', occupation: 'Reporter' },
            },
        ])

        renderEntityList()

        expect(csvHooks.getBlockItems).toHaveBeenCalledWith('invited-1', 'persons')
        expect(screen.getByText('ANA POPESCU')).toBeInTheDocument()
        expect(screen.getByText('Reporter')).toBeInTheDocument()
    })

    it('renders locations', () => {
        csvHooks.activeEntityType = 'locations'
        csvHooks.getBlockItems.mockReturnValue([
            { entityType: 'locations', id: 'location-1', data: { location: 'CHISINAU' } },
        ])

        renderEntityList()

        expect(csvHooks.getBlockItems).toHaveBeenCalledWith('invited-1', 'locations')
        expect(screen.getByText('CHISINAU')).toBeInTheDocument()
    })

    it('does not request or render hot or wait entity lists', () => {
        csvHooks.activeEntityType = 'hotTitles'
        csvHooks.getBlockItems.mockReturnValue([
            { entityType: 'hotTitles', id: 'hot-1', data: { title: 'HOT' } },
        ])

        renderEntityList()

        expect(csvHooks.getBlockItems).not.toHaveBeenCalled()
        expect(screen.queryByText('HOT')).not.toBeInTheDocument()
        expect(screen.getByText('Nu exista elemente in aceasta sectiune.')).toBeInTheDocument()
    })
})
