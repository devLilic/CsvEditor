export type CsvFileSettings = {
    workingCsvPath: string
    backupFolderPath: string
}

export const FALLBACK_CSV_FILE_SETTINGS: CsvFileSettings = {
    workingCsvPath: '',
    backupFolderPath: '',
}

export function normalizeCsvFileSettings(value: unknown): CsvFileSettings {
    const source =
        value && typeof value === 'object'
            ? value as Partial<Record<keyof CsvFileSettings, unknown>>
            : {}

    return {
        workingCsvPath: typeof source.workingCsvPath === 'string'
            ? source.workingCsvPath
            : FALLBACK_CSV_FILE_SETTINGS.workingCsvPath,
        backupFolderPath: typeof source.backupFolderPath === 'string'
            ? source.backupFolderPath
            : FALLBACK_CSV_FILE_SETTINGS.backupFolderPath,
    }
}
