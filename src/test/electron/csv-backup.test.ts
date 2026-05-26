import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { resolveCsvBackupTarget, writeCsvBackup } from '../../../electron/main/csv-backup'

describe('csv-backup', () => {
    const now = new Date('2026-05-26T14:30:05')
    let tempDir: string

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'csv-backup-'))
    })

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true })
    })

    it('fails when backupFolderPath is missing', async () => {
        const result = await resolveCsvBackupTarget({
            content: 'a,b',
            workingCsvPath: 'C:/work/emisie.csv',
            backupFolderPath: '',
            now,
        })

        expect(result).toEqual({
            ok: false,
            error: 'No backup folder configured',
        })
    })

    it('fails when content is not a string', async () => {
        const result = await resolveCsvBackupTarget({
            content: 123,
            workingCsvPath: 'C:/work/emisie.csv',
            backupFolderPath: tempDir,
            now,
        })

        expect(result).toEqual({
            ok: false,
            error: 'Invalid content type, expected string',
        })
    })

    it('builds the final path with the expected filename', async () => {
        const result = await resolveCsvBackupTarget({
            content: 'a,b',
            workingCsvPath: 'C:/work/emisie.csv',
            backupFolderPath: tempDir,
            now,
        })

        expect(result.ok).toBe(true)
        if (!result.ok) return

        expect(result.filename).toBe('emisie_2026-05-26_14-30-05.csv')
        expect(result.backupPath).toBe(path.join(tempDir, result.filename))
    })

    it('writes the CSV content to the file', async () => {
        const result = await writeCsvBackup({
            content: 'col1,col2\nvalue1,value2',
            workingCsvPath: 'C:/work/emisie.csv',
            backupFolderPath: tempDir,
            now,
        })

        expect(result.ok).toBe(true)
        expect(result.backupPath).toBeTruthy()

        const written = await fs.readFile(result.backupPath!, 'utf-8')
        expect(written).toBe('col1,col2\nvalue1,value2')
    })

    it('returns the final path', async () => {
        const result = await writeCsvBackup({
            content: 'a,b',
            workingCsvPath: 'C:/work/emisie.csv',
            backupFolderPath: tempDir,
            now,
        })

        expect(result).toEqual({
            ok: true,
            backupPath: path.join(tempDir, 'emisie_2026-05-26_14-30-05.csv'),
            filename: 'emisie_2026-05-26_14-30-05.csv',
        })
    })
})
