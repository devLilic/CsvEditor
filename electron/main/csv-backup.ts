import * as fs from 'fs'
import * as path from 'path'
import { createCsvBackupFilename } from '../../src/features/csv-editor/domain/csvBackupFile'
import type { CsvCreateBackupResponse } from '../../src/shared/ipc-types'

const fsp = fs.promises

type CsvBackupFs = {
    stat(filePath: string): Promise<{ isDirectory(): boolean }>
    access(filePath: string, mode?: number): Promise<void>
    writeFile(filePath: string, content: string, encoding: BufferEncoding): Promise<void>
}

export type CsvBackupInput = {
    content: unknown
    workingCsvPath: string
    backupFolderPath: string
    now: Date
    fs?: CsvBackupFs
}

export type CsvBackupTarget =
    | {
        ok: true
        content: string
        backupFolderPath: string
        backupPath: string
        filename: string
    }
    | {
        ok: false
        error: string
    }

export async function resolveCsvBackupTarget(input: CsvBackupInput): Promise<CsvBackupTarget> {
    if (typeof input.content !== 'string') {
        return { ok: false, error: 'Invalid content type, expected string' }
    }

    const backupFolderPath = input.backupFolderPath.trim()
    if (!backupFolderPath) {
        return { ok: false, error: 'No backup folder configured' }
    }

    const fileSystem = input.fs ?? fsp
    const stat = await fileSystem.stat(backupFolderPath).catch(() => null)
    if (!stat?.isDirectory()) {
        return { ok: false, error: 'Backup folder does not exist' }
    }

    await fileSystem.access(backupFolderPath, fs.constants.W_OK)

    const filename = createCsvBackupFilename({
        workingCsvPath: input.workingCsvPath,
        now: input.now,
    })

    return {
        ok: true,
        content: input.content,
        backupFolderPath,
        backupPath: path.join(backupFolderPath, filename),
        filename,
    }
}

export async function writeCsvBackup(input: CsvBackupInput): Promise<CsvCreateBackupResponse> {
    try {
        const target = await resolveCsvBackupTarget(input)
        if (!target.ok) {
            return target
        }

        const fileSystem = input.fs ?? fsp
        await fileSystem.writeFile(target.backupPath, target.content, 'utf-8')

        return {
            ok: true,
            backupPath: target.backupPath,
            filename: target.filename,
        }
    } catch (error) {
        return { ok: false, error: (error as Error).message }
    }
}
