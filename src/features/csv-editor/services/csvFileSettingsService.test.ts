import { describe, expect, it } from 'vitest'
import { FALLBACK_CSV_FILE_SETTINGS } from '../domain/csvFileSettings'
import { csvFileSettingsService } from './csvFileSettingsService'

describe('csvFileSettingsService', () => {
    it('getCsvFileSettings returns valid settings from IPC', async () => {
        const api = (window as any).electronAPI
        const settings = {
            workingCsvPath: 'C:/work/current.csv',
            backupFolderPath: 'C:/work/backups',
        }
        api.getCsvFileSettings.mockResolvedValueOnce(settings)

        const result = await csvFileSettingsService.getCsvFileSettings()

        expect(result).toEqual(settings)
        expect(api.getCsvFileSettings).toHaveBeenCalledOnce()
    })

    it('getCsvFileSettings returns fallback when IPC fails', async () => {
        const api = (window as any).electronAPI
        api.getCsvFileSettings.mockRejectedValueOnce(new Error('store error'))

        const result = await csvFileSettingsService.getCsvFileSettings()

        expect(result).toEqual(FALLBACK_CSV_FILE_SETTINGS)
    })

    it('setCsvFileSettings saves valid settings', async () => {
        const api = (window as any).electronAPI
        const settings = {
            workingCsvPath: 'C:/work/current.csv',
            backupFolderPath: 'C:/work/backups',
        }
        api.setCsvFileSettings.mockResolvedValueOnce(settings)

        const result = await csvFileSettingsService.setCsvFileSettings(settings)

        expect(result).toEqual(settings)
        expect(api.setCsvFileSettings).toHaveBeenCalledWith(settings)
    })

    it('selectWorkingCsv returns path or null', async () => {
        const api = (window as any).electronAPI
        api.selectWorkingCsv
            .mockResolvedValueOnce('C:/work/current.csv')
            .mockResolvedValueOnce(null)

        await expect(csvFileSettingsService.selectWorkingCsv()).resolves.toBe('C:/work/current.csv')
        await expect(csvFileSettingsService.selectWorkingCsv()).resolves.toBeNull()
        expect(api.selectWorkingCsv).toHaveBeenCalledTimes(2)
    })

    it('selectBackupFolder returns path or null', async () => {
        const api = (window as any).electronAPI
        api.selectBackupFolder
            .mockResolvedValueOnce('C:/work/backups')
            .mockResolvedValueOnce(null)

        await expect(csvFileSettingsService.selectBackupFolder()).resolves.toBe('C:/work/backups')
        await expect(csvFileSettingsService.selectBackupFolder()).resolves.toBeNull()
        expect(api.selectBackupFolder).toHaveBeenCalledTimes(2)
    })
})
