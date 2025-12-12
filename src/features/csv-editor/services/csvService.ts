// features/csv-editor/services/csvService.ts

import type {
    RendererApi,
    CsvFileDescriptor,
    CsvWriteResponse,
    CsvBackupResponse,
} from '@/shared/ipc-types'

/**
 * Thin, typed wrapper peste window.electronAPI
 * ❌ Fără logică
 * ❌ Fără parsing
 * ❌ Fără state
 */
const api = window.electronAPI as RendererApi

export const csvService = {
    /**
     * Încearcă să încarce ultimul CSV salvat
     * @returns CsvFileDescriptor | null
     */
    async getLast(): Promise<CsvFileDescriptor | null> {
        return api.getLastCsv()
    },

    /**
     * Deschide dialog nativ pentru selectare CSV
     * @returns CsvFileDescriptor | null
     */
    async openDialog(): Promise<CsvFileDescriptor | null> {
        return api.openCsvDialog()
    },

    /**
     * Scrie CSV-ul curent pe disc
     * Nu aruncă excepții – verifică response.ok
     */
    async write(content: string): Promise<CsvWriteResponse> {
        return api.writeCsv(content)
    },

    /**
     * Creează backup cu timestamp
     * Ideal înainte de operații destructive
     */
    async backup(content: string): Promise<CsvBackupResponse> {
        return api.bkpCsv(content)
    },
}
