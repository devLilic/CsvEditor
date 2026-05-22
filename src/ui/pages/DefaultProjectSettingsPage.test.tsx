import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
    FALLBACK_DEFAULT_PROJECT_SETTINGS,
    type DefaultProjectSettings,
} from '@/features/csv-editor/domain/defaultProjectSettings'
import { defaultProjectSettingsService } from '@/features/csv-editor/services/defaultProjectSettingsService'
import { DefaultProjectSettingsPage } from './DefaultProjectSettingsPage'

vi.mock('@/features/csv-editor/services/defaultProjectSettingsService', () => ({
    defaultProjectSettingsService: {
        getDefaultProjectSettings: vi.fn(),
        setDefaultProjectSettings: vi.fn(),
    },
}))

const savedSettings: DefaultProjectSettings = {
    title: 'SAVED TITLE',
    personName: 'SAVED NAME',
    personOccupation: 'SAVED OCCUPATION',
    location: 'SAVED LOCATION',
}

function renderPage() {
    return render(
        <MemoryRouter initialEntries={['/settings/default-project']}>
            <Routes>
                <Route path="/settings/default-project" element={<DefaultProjectSettingsPage />} />
                <Route path="/csv-editor" element={<div>CSV editor page</div>} />
            </Routes>
        </MemoryRouter>,
    )
}

describe('DefaultProjectSettingsPage', () => {
    beforeEach(() => {
        vi.mocked(defaultProjectSettingsService.getDefaultProjectSettings).mockResolvedValue(savedSettings)
        vi.mocked(defaultProjectSettingsService.setDefaultProjectSettings).mockImplementation(async (settings) => settings)
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    it('shows the required fields', async () => {
        renderPage()

        expect(screen.getByRole('heading', { name: 'Setări proiect nou' })).toBeInTheDocument()
        expect(screen.getByText(/Texte standard pentru proiect nou/i)).toBeInTheDocument()
        expect(screen.getByText(/următorul proiect nou/i)).toBeInTheDocument()
        expect(screen.getByLabelText('Titlu implicit')).toBeInTheDocument()
        expect(screen.getByLabelText('Nume implicit')).toBeInTheDocument()
        expect(screen.getByLabelText('Funcție implicită')).toBeInTheDocument()
        expect(screen.getByLabelText('Locație implicită')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Salvează' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Resetează la valori standard' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Înapoi la editor' })).toBeInTheDocument()
    })

    it('loads saved values', async () => {
        renderPage()

        await waitFor(() => {
            expect(screen.getByLabelText('Titlu implicit')).toHaveValue(savedSettings.title)
        })

        expect(screen.getByLabelText('Nume implicit')).toHaveValue(savedSettings.personName)
        expect(screen.getByLabelText('Funcție implicită')).toHaveValue(savedSettings.personOccupation)
        expect(screen.getByLabelText('Locație implicită')).toHaveValue(savedSettings.location)
    })

    it('allows editing fields', async () => {
        const user = userEvent.setup()
        renderPage()
        const titleInput = screen.getByLabelText('Titlu implicit')

        await waitFor(() => {
            expect(titleInput).toHaveValue(savedSettings.title)
        })

        await user.clear(titleInput)
        await user.type(titleInput, 'UPDATED TITLE')

        expect(titleInput).toHaveValue('UPDATED TITLE')
    })

    it('calls the service when saving', async () => {
        const user = userEvent.setup()
        renderPage()
        const titleInput = screen.getByLabelText('Titlu implicit')

        await waitFor(() => {
            expect(titleInput).toHaveValue(savedSettings.title)
        })

        await user.clear(titleInput)
        await user.type(titleInput, 'TITLE TO SAVE')
        await user.click(screen.getByRole('button', { name: 'Salvează' }))

        await waitFor(() => {
            expect(defaultProjectSettingsService.setDefaultProjectSettings).toHaveBeenCalledWith({
                ...savedSettings,
                title: 'TITLE TO SAVE',
            })
        })
    })

    it('resets the form to fallback values', async () => {
        const user = userEvent.setup()
        renderPage()

        await waitFor(() => {
            expect(screen.getByLabelText('Titlu implicit')).toHaveValue(savedSettings.title)
        })

        await user.click(screen.getByRole('button', { name: 'Resetează la valori standard' }))

        await waitFor(() => {
            expect(screen.getByLabelText('Titlu implicit')).toHaveValue(FALLBACK_DEFAULT_PROJECT_SETTINGS.title)
        })

        expect(screen.getByLabelText('Nume implicit')).toHaveValue(FALLBACK_DEFAULT_PROJECT_SETTINGS.personName)
        expect(screen.getByLabelText('Funcție implicită')).toHaveValue(FALLBACK_DEFAULT_PROJECT_SETTINGS.personOccupation)
        expect(screen.getByLabelText('Locație implicită')).toHaveValue(FALLBACK_DEFAULT_PROJECT_SETTINGS.location)
        expect(defaultProjectSettingsService.setDefaultProjectSettings).toHaveBeenCalledWith(
            FALLBACK_DEFAULT_PROJECT_SETTINGS,
        )
    })

    it('navigates back to the CSV editor', async () => {
        const user = userEvent.setup()
        renderPage()

        await user.click(screen.getByRole('button', { name: 'Înapoi la editor' }))

        expect(screen.getByText('CSV editor page')).toBeInTheDocument()
    })
})
