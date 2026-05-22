// src/ui/pages/DefaultProjectSettingsPage.tsx

import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FALLBACK_DEFAULT_PROJECT_SETTINGS,
    type DefaultProjectSettings,
} from '@/features/csv-editor/domain/defaultProjectSettings'
import { defaultProjectSettingsService } from '@/features/csv-editor/services/defaultProjectSettingsService'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function DefaultProjectSettingsPage() {
    const navigate = useNavigate()
    const [settings, setSettings] = useState<DefaultProjectSettings>(FALLBACK_DEFAULT_PROJECT_SETTINGS)
    const [status, setStatus] = useState<SaveStatus>('idle')

    useEffect(() => {
        let isMounted = true

        defaultProjectSettingsService.getDefaultProjectSettings().then((storedSettings) => {
            if (isMounted) {
                setSettings(storedSettings)
            }
        })

        return () => {
            isMounted = false
        }
    }, [])

    const updateField = (field: keyof DefaultProjectSettings, value: string) => {
        setStatus('idle')
        setSettings((current) => ({
            ...current,
            [field]: value,
        }))
    }

    const saveSettings = async (nextSettings: DefaultProjectSettings) => {
        setStatus('saving')

        try {
            const savedSettings = await defaultProjectSettingsService.setDefaultProjectSettings(nextSettings)
            setSettings(savedSettings)
            setStatus('saved')
        } catch {
            setStatus('error')
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await saveSettings(settings)
    }

    const handleReset = async () => {
        await saveSettings(FALLBACK_DEFAULT_PROJECT_SETTINGS)
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                <header className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Setări proiect nou
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Texte standard pentru proiect nou. Aceste valori vor fi folosite pentru următorul proiect nou.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate('/csv-editor')}
                        className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Înapoi la editor
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded bg-white p-5 shadow-sm">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-700">Titlu implicit</span>
                        <input
                            value={settings.title}
                            onChange={(event) => updateField('title', event.target.value)}
                            className="rounded border border-gray-300 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-700">Nume implicit</span>
                        <input
                            value={settings.personName}
                            onChange={(event) => updateField('personName', event.target.value)}
                            className="rounded border border-gray-300 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-700">Funcție implicită</span>
                        <input
                            value={settings.personOccupation}
                            onChange={(event) => updateField('personOccupation', event.target.value)}
                            className="rounded border border-gray-300 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-700">Locație implicită</span>
                        <input
                            value={settings.location}
                            onChange={(event) => updateField('location', event.target.value)}
                            className="rounded border border-gray-300 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={status === 'saving'}
                            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Salvează
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={status === 'saving'}
                            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Resetează la valori standard
                        </button>

                        {status === 'saved' && (
                            <span className="text-sm text-green-700">Salvat.</span>
                        )}

                        {status === 'error' && (
                            <span className="text-sm text-red-700">Setările nu au putut fi salvate.</span>
                        )}
                    </div>
                </form>
            </div>
        </main>
    )
}
