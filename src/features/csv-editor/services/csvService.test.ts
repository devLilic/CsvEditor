// src/features/csv-editor/services/csvService.test.ts
import { describe, it, expect } from 'vitest'
import { csvService } from './csvService'

describe('csvService', () => {
    it('getLast returns null when IPC returns null', async () => {
        const api = (globalThis as any).electronAPI
        api.getLastCsv.mockResolvedValueOnce(null)

        const result = await csvService.getLast()

        expect(result).toBeNull()
        expect(api.getLastCsv).toHaveBeenCalledOnce()
    })

    it('getLast NEVER throws even if IPC misbehaves', async () => {
        const api = (globalThis as any).electronAPI
        api.getLastCsv.mockRejectedValueOnce(new Error('fs crash'))

        const result = await csvService.getLast()

        expect(result).toBeNull()
    })

    it('openDialog returns null when user cancels dialog', async () => {
        const api = (globalThis as any).electronAPI
        api.openCsvDialog.mockResolvedValueOnce(null)

        const result = await csvService.openDialog()

        expect(result).toBeNull()
        expect(api.openCsvDialog).toHaveBeenCalledOnce()
    })

    it('write returns ok=false when IPC signals failure', async () => {
        const api = (globalThis as any).electronAPI
        api.writeCsv.mockResolvedValueOnce({ ok: false, error: 'no path' })

        const result = await csvService.write('a,b,c')

        expect(result.ok).toBe(false)
        expect(result.error).toBe('no path')
    })

    it('write NEVER throws even if IPC throws', async () => {
        const api = (globalThis as any).electronAPI
        api.writeCsv.mockRejectedValueOnce(new Error('disk error'))

        const result = await csvService.write('a,b,c')

        expect(result.ok).toBe(false)
    })

    it('backup returns ok=true and backupPath on success', async () => {
        const api = (globalThis as any).electronAPI
        api.bkpCsv.mockResolvedValueOnce({
            ok: true,
            backupPath: '/backups/file_123.csv',
        })

        const result = await csvService.backup('a,b,c')

        expect(result.ok).toBe(true)
        expect(result.backupPath).toBe('/backups/file_123.csv')
    })

    it('backup returns ok=false when IPC fails', async () => {
        const api = (globalThis as any).electronAPI
        api.bkpCsv.mockRejectedValueOnce(new Error('permission denied'))

        const result = await csvService.backup('a,b,c')

        expect(result.ok).toBe(false)
    })
})
