// src/features/csv-editor/services/csvService.ts
import type { CsvFileDescriptor, CsvWriteResponse } from '@/shared/ipc-types'

/**
 * Accessor lazy pentru preload API.
 * IMPORTANT:
 * - NU se capturează electronAPI la import-time
 * - permite injectarea de mock-uri în testare
 */
function getApi() {
    const api = (window as any)?.electronAPI

    if (!api) {
        throw new Error('electronAPI not available')
    }

    return api
}

/**
 * csvService
 *
 * Responsabilități:
 * - wrapper sigur peste IPC Electron
 * - fallback predictibil (fără throw)
 * - complet testabil fără Electron runtime
 *
 * NU face:
 * - parsing CSV
 * - validare business
 * - state management
 */
export const csvService = {
    /**
     * Încarcă ultimul CSV salvat (dacă există)
     */
    async getLast(): Promise<CsvFileDescriptor | null> {
        try {
            const res = await getApi().getLastCsv()
            return res ?? null
        } catch {
            return null
        }
    },

    /**
     * Deschide dialog pentru selectare CSV
     */
    async openDialog(): Promise<CsvFileDescriptor | null> {
        try {
            const res = await getApi().openCsvDialog()
            return res ?? null
        } catch {
            return null
        }
    },

    /**
     * Scrie CSV-ul curent pe disc
     */
    async write(content: string): Promise<CsvWriteResponse> {
        if (typeof content !== 'string') {
            return { ok: false, error: 'INVALID_CONTENT' }
        }

        try {
            const res = await getApi().writeCsv(content)
            return res ?? { ok: false, error: 'NO_RESPONSE' }
        } catch {
            return { ok: false, error: 'IPC_FAILED' }
        }
    },

    /**
     * Creează backup pentru CSV-ul curent
     */
    async backup(content: string): Promise<CsvWriteResponse> {
        if (typeof content !== 'string') {
            return { ok: false, error: 'INVALID_CONTENT' }
        }

        try {
            const res = await getApi().bkpCsv(content)
            return res ?? { ok: false, error: 'NO_RESPONSE' }
        } catch {
            return { ok: false, error: 'IPC_FAILED' }
        }
    },
}
