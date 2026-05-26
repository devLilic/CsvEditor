import { describe, expect, it } from 'vitest'
import {
    FALLBACK_CSV_FILE_SETTINGS,
    normalizeCsvFileSettings,
} from './csvFileSettings'

describe('normalizeCsvFileSettings', () => {
    it('normalizes a valid object', () => {
        expect(normalizeCsvFileSettings({
            workingCsvPath: 'C:/work/current.csv',
            backupFolderPath: 'C:/work/backups',
        })).toEqual({
            workingCsvPath: 'C:/work/current.csv',
            backupFolderPath: 'C:/work/backups',
        })
    })

    it('uses fallback settings for null', () => {
        expect(normalizeCsvFileSettings(null)).toEqual(FALLBACK_CSV_FILE_SETTINGS)
    })

    it('uses fallback for missing workingCsvPath', () => {
        expect(normalizeCsvFileSettings({
            backupFolderPath: 'C:/work/backups',
        })).toEqual({
            workingCsvPath: FALLBACK_CSV_FILE_SETTINGS.workingCsvPath,
            backupFolderPath: 'C:/work/backups',
        })
    })

    it('uses fallback for missing backupFolderPath', () => {
        expect(normalizeCsvFileSettings({
            workingCsvPath: 'C:/work/current.csv',
        })).toEqual({
            workingCsvPath: 'C:/work/current.csv',
            backupFolderPath: FALLBACK_CSV_FILE_SETTINGS.backupFolderPath,
        })
    })

    it('uses fallback for non-string values', () => {
        expect(normalizeCsvFileSettings({
            workingCsvPath: 123,
            backupFolderPath: false,
        })).toEqual(FALLBACK_CSV_FILE_SETTINGS)
    })

    it('keeps valid strings exactly as provided', () => {
        const settings = normalizeCsvFileSettings({
            workingCsvPath: '  C:/path with spaces/current.csv  ',
            backupFolderPath: '',
        })

        expect(settings.workingCsvPath).toBe('  C:/path with spaces/current.csv  ')
        expect(settings.backupFolderPath).toBe('')
    })
})
