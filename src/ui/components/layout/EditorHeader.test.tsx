import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EditorHeader } from './EditorHeader'
import { useWorkingCsvInfo } from '@/features/csv-editor/hooks/useWorkingCsvInfo'

const {
    startNewProjectMock,
    forceStartNewProjectWithoutBackupMock,
    setTitleFilterMock,
    dispatchMock,
    listSavedProjectsMock,
    saveCurrentAsProjectMock,
    loadProjectIntoWorkingCsvMock,
    deleteSavedProjectMock,
} = vi.hoisted(() => ({
    startNewProjectMock: vi.fn(),
    forceStartNewProjectWithoutBackupMock: vi.fn(),
    setTitleFilterMock: vi.fn(),
    dispatchMock: vi.fn(),
    listSavedProjectsMock: vi.fn(),
    saveCurrentAsProjectMock: vi.fn(),
    loadProjectIntoWorkingCsvMock: vi.fn(),
    deleteSavedProjectMock: vi.fn(),
}))

vi.mock('@/features/csv-editor', () => ({
    useEntities: () => ({
        startNewProject: startNewProjectMock,
        forceStartNewProjectWithoutBackup: forceStartNewProjectWithoutBackupMock,
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

vi.mock('@/features/csv-editor/context/CsvContext', () => ({
    useCsvContext: () => ({
        state: {
            entities: {
                sections: [
                    {
                        id: 'current-section',
                        kind: 'invited',
                        rows: [
                            {
                                id: 'current-row',
                                title: { id: 'current-title', title: 'CURRENT TITLE' },
                                person: { id: 'current-person', name: 'CURRENT NAME', occupation: 'CURRENT ROLE' },
                                location: { id: 'current-location', location: 'CURRENT LOCATION' },
                            },
                        ],
                    },
                ],
            },
        },
        dispatch: dispatchMock,
    }),
}))

vi.mock('@/features/csv-editor/services/savedProjectsService', () => ({
    savedProjectsService: {
        listSavedProjects: listSavedProjectsMock,
        saveCurrentAsProject: saveCurrentAsProjectMock,
        loadProjectIntoWorkingCsv: loadProjectIntoWorkingCsvMock,
        deleteSavedProject: deleteSavedProjectMock,
    },
}))

vi.mock('@/features/csv-editor/hooks/useWorkingCsvInfo', () => ({
    useWorkingCsvInfo: vi.fn(),
}))

describe('EditorHeader', () => {
    beforeEach(() => {
        startNewProjectMock.mockClear()
        forceStartNewProjectWithoutBackupMock.mockClear()
        setTitleFilterMock.mockClear()
        dispatchMock.mockClear()
        listSavedProjectsMock.mockClear()
        saveCurrentAsProjectMock.mockClear()
        loadProjectIntoWorkingCsvMock.mockClear()
        deleteSavedProjectMock.mockClear()
        startNewProjectMock.mockResolvedValue({ ok: true })
        forceStartNewProjectWithoutBackupMock.mockResolvedValue({ ok: true })
        listSavedProjectsMock.mockResolvedValue({
            ok: true,
            files: [
                {
                    filename: 'Emisiunea_1.csv',
                    fullPath: 'C:/saved/Emisiunea_1.csv',
                    mtimeMs: 2,
                },
            ],
        })
        saveCurrentAsProjectMock.mockResolvedValue({ ok: true, filename: 'Manual.csv', fullPath: 'C:/saved/Manual.csv' })
        loadProjectIntoWorkingCsvMock.mockResolvedValue({ ok: true, content: 'loaded,csv,content' })
        deleteSavedProjectMock.mockResolvedValue({ ok: true })
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

    it('does not show backup failed dialog when startNewProject succeeds', async () => {
        const user = userEvent.setup()
        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: /Proiect nou/i }))
        await user.click(screen.getByRole('button', { name: /Confirm/i }))

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(forceStartNewProjectWithoutBackupMock).not.toHaveBeenCalled()
    })

    it('opens backup failed dialog when starting a new project fails during backup', async () => {
        const user = userEvent.setup()
        startNewProjectMock.mockResolvedValueOnce({
            ok: false,
            reason: 'BACKUP_FAILED',
            error: 'No backup folder configured',
        })

        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: /Proiect nou/i }))
        await user.click(screen.getByRole('button', { name: /Confirm/i }))

        expect(await screen.findByRole('dialog')).toHaveTextContent('Backup CSV nu a putut fi creat.')
        expect(screen.getByText(/Proiectul curent nu a fost resetat/)).toBeInTheDocument()
        expect(screen.getByText('No backup folder configured')).toBeInTheDocument()
        expect(forceStartNewProjectWithoutBackupMock).not.toHaveBeenCalled()
    })

    it('lets the user return from backup failed dialog without forcing reset', async () => {
        const user = userEvent.setup()
        startNewProjectMock.mockResolvedValueOnce({
            ok: false,
            reason: 'BACKUP_FAILED',
            error: 'No backup folder configured',
        })

        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: /Proiect nou/i }))
        await user.click(screen.getByRole('button', { name: /Confirm/i }))
        await user.click(await screen.findByRole('button', { name: 'Revino' }))

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(forceStartNewProjectWithoutBackupMock).not.toHaveBeenCalled()
    })

    it('continues without backup when the user confirms the backup failed dialog', async () => {
        const user = userEvent.setup()
        startNewProjectMock.mockResolvedValueOnce({
            ok: false,
            reason: 'BACKUP_FAILED',
            error: 'No backup folder configured',
        })

        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: /Proiect nou/i }))
        await user.click(screen.getByRole('button', { name: /Confirm/i }))
        await user.click(await screen.findByRole('button', { name: 'Continuă fără backup' }))

        expect(forceStartNewProjectWithoutBackupMock).toHaveBeenCalledTimes(1)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('opens saved projects modal from the header', async () => {
        const user = userEvent.setup()
        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: 'Proiecte salvate' }))

        expect(await screen.findByRole('dialog')).toHaveTextContent('Proiecte salvate')
        expect(listSavedProjectsMock).toHaveBeenCalledOnce()
    })

    it('shows the saved projects button', () => {
        render(<EditorHeader />)

        expect(screen.getByRole('button', { name: 'Proiecte salvate' })).toBeInTheDocument()
    })

    it('dispatches CSV_LOADED when a saved project is loaded', async () => {
        const user = userEvent.setup()
        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: 'Proiecte salvate' }))
        await screen.findByText('Emisiunea_1.csv')
        await user.click(screen.getByRole('button', { name: 'Încarcă în CSV-ul de lucru' }))
        await user.click(screen.getByRole('button', { name: 'Încarcă' }))

        expect(loadProjectIntoWorkingCsvMock).toHaveBeenCalledWith({
            filename: 'Emisiunea_1.csv',
        })
        expect(dispatchMock).toHaveBeenCalledWith({
            type: 'CSV_LOADED',
            payload: expect.any(Object),
        })
    })

    it('passes the current serialized CSV content to the modal save flow', async () => {
        const user = userEvent.setup()
        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: 'Proiecte salvate' }))
        await user.type(await screen.findByLabelText(/Salvează proiectul curent ca/i), 'Manual')
        await user.click(screen.getByRole('button', { name: 'Salvează' }))

        expect(saveCurrentAsProjectMock).toHaveBeenCalledWith({
            filename: 'Manual',
            content: expect.stringContaining('CURRENT TITLE'),
        })
    })

    it('does not show backup files in the saved projects modal', async () => {
        const user = userEvent.setup()
        render(<EditorHeader />)

        await user.click(screen.getByRole('button', { name: 'Proiecte salvate' }))

        expect(await screen.findByText('Emisiunea_1.csv')).toBeInTheDocument()
        expect(screen.queryByText(/backup/i)).not.toBeInTheDocument()
    })
})
