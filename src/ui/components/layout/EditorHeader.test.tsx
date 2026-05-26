import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EditorHeader } from './EditorHeader'
import { useWorkingCsvInfo } from '@/features/csv-editor/hooks/useWorkingCsvInfo'

const startNewProjectMock = vi.fn()
const setTitleFilterMock = vi.fn()

vi.mock('@/features/csv-editor', () => ({
    useEntities: () => ({
        startNewProject: startNewProjectMock,
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

vi.mock('@/features/csv-editor/hooks/useWorkingCsvInfo', () => ({
    useWorkingCsvInfo: vi.fn(),
}))

describe('EditorHeader', () => {
    beforeEach(() => {
        startNewProjectMock.mockClear()
        setTitleFilterMock.mockClear()
        startNewProjectMock.mockResolvedValue({ ok: true })
        vi.mocked(useWorkingCsvInfo).mockReturnValue({
            filename: 'emisie.csv',
            path: 'C:/work/emisie.csv',
            isConfigured: true,
        })
    })

    afterEach(() => {
        cleanup()
    })

    it('shows the Proiect nou button and no CSV picker in the header', () => {
        render(<EditorHeader />)

        expect(screen.getByRole('button', { name: /Proiect nou/i })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /Selecteaz/i })).not.toBeInTheDocument()
        expect(screen.queryByText('Sterge')).not.toBeInTheDocument()
        expect(screen.getByText('CSV: emisie.csv')).toBeInTheDocument()
    })

    it('shows an unset CSV badge when no working CSV is configured', () => {
        vi.mocked(useWorkingCsvInfo).mockReturnValueOnce({
            filename: 'nesetat',
            path: '',
            isConfigured: false,
        })

        render(<EditorHeader />)

        expect(screen.getByText('CSV: nesetat')).toBeInTheDocument()
    })

    it('keeps the CSV badge before Edit Mode and Proiect nou available', () => {
        render(<EditorHeader />)

        const badge = screen.getByText('CSV: emisie.csv')
        const editMode = screen.getByRole('button', { name: /Edit Mode/i })
        const newProject = screen.getByRole('button', { name: /Proiect nou/i })

        expect(badge.compareDocumentPosition(editMode) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
        expect(editMode.compareDocumentPosition(newProject) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    it('uses the new confirmation dialog text', async () => {
        const user = userEvent.setup()
        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: /Proiect nou/i }))

        expect(screen.getByText('Incepi un proiect nou?')).toBeInTheDocument()
        expect(screen.getByText(/backup CSV in folderul setat in Setari/i)).toBeInTheDocument()
        expect(screen.getByText(/Doar dupa backup/i)).toBeInTheDocument()
        expect(screen.getByText(/fisierul de lucru va fi resetat/i)).toBeInTheDocument()
        expect(screen.getByText(/Daca backup-ul esueaza, resetarea nu se face/i)).toBeInTheDocument()
    })

    it('calls startNewProject after confirmation', async () => {
        const user = userEvent.setup()
        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: /Proiect nou/i }))
        await user.click(screen.getByRole('button', { name: /Confirm/i }))

        expect(startNewProjectMock).toHaveBeenCalledTimes(1)
    })

    it('shows an inline backup error when starting a new project fails during backup', async () => {
        const user = userEvent.setup()
        startNewProjectMock.mockResolvedValueOnce({
            ok: false,
            error: 'Backup failed: No backup folder configured',
        })

        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: /Proiect nou/i }))
        await user.click(screen.getByRole('button', { name: /Confirm/i }))

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Backup CSV nu a putut fi creat. Proiectul nu a fost resetat. Verifica folderul de backup din Setari.'
        )
    })
})
