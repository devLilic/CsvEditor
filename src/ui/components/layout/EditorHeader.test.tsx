import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EditorHeader } from './EditorHeader'

const startNewProjectMock = vi.fn()
const loadCsvMock = vi.fn()
const setTitleFilterMock = vi.fn()

vi.mock('@/features/csv-editor', () => ({
    useEntities: () => ({
        startNewProject: startNewProjectMock,
        loadCsv: loadCsvMock,
    }),
}))

vi.mock('@/ui/context/TitleFilterContext', () => ({
    useTitleFilter: () => ({
        titleFilter: '',
        setTitleFilter: setTitleFilterMock,
    }),
}))

vi.mock('@/ui/components/SectionsTabs', () => ({
    SectionsTabs: () => <div data-testid="sections-tabs" />,
}))

vi.mock('@/ui/components/EditModeToggle', () => ({
    EditModeToggle: () => <button>Edit Mode OFF</button>,
}))

describe('EditorHeader', () => {
    beforeEach(() => {
        startNewProjectMock.mockClear()
        loadCsvMock.mockClear()
        setTitleFilterMock.mockClear()
        startNewProjectMock.mockResolvedValue({ ok: true })
    })

    afterEach(() => {
        cleanup()
    })

    it('shows the Proiect nou button instead of the old delete wording', () => {
        render(<EditorHeader />)

        expect(screen.getByRole('button', { name: /Proiect nou/i })).toBeInTheDocument()
        expect(screen.queryByText('Sterge')).not.toBeInTheDocument()
        expect(screen.queryByText('Șterge')).not.toBeInTheDocument()
    })

    it('uses the new confirmation dialog text', async () => {
        const user = userEvent.setup()
        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: /Proiect nou/i }))

        expect(screen.getByText('Începi un proiect nou?')).toBeInTheDocument()
        expect(screen.getByText(/backup al CSV-ului curent/i)).toBeInTheDocument()
        expect(screen.getByText(/CSV-ul curent va fi rescris/i)).toBeInTheDocument()
        expect(screen.getByText(/textele standard pentru proiect nou/i)).toBeInTheDocument()
    })

    it('calls startNewProject after confirmation', async () => {
        const user = userEvent.setup()
        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: /Proiect nou/i }))
        await user.click(screen.getByRole('button', { name: /Confirm/i }))

        expect(startNewProjectMock).toHaveBeenCalledTimes(1)
    })

    it('shows a minimal alert when starting a new project fails', async () => {
        const user = userEvent.setup()
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
        startNewProjectMock.mockResolvedValueOnce({
            ok: false,
            error: 'Write failed: WRITE_FAILED',
        })

        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: /Proiect nou/i }))
        await user.click(screen.getByRole('button', { name: /Confirm/i }))

        expect(alertSpy).toHaveBeenCalledWith('Nu s-a putut porni proiectul nou: Write failed: WRITE_FAILED')
    })
})
