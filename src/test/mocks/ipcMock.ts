// src/test/mocks/ipcMock.ts
import { vi } from 'vitest'

export const ipcMock = {
    // CSV
    getLastCsv: vi.fn(),
    getWorkingCsv: vi.fn(),
    openCsvDialog: vi.fn(),
    writeCsv: vi.fn(),
    bkpCsv: vi.fn(), // ⬅️ OBLIGATORIU exact acest nume

    createCsvBackup: vi.fn(),

    // Settings
    getQuickTitles: vi.fn(),
    setQuickTitles: vi.fn(),
    getAppConfig: vi.fn(),
    setAppConfig: vi.fn(),
    getDefaultProjectSettings: vi.fn(),
    setDefaultProjectSettings: vi.fn(),
    getPhoneImageSettings: vi.fn(),
    setPhoneImageSettings: vi.fn(),
    selectWorkPath: vi.fn(),
    getCsvFileSettings: vi.fn(),
    setCsvFileSettings: vi.fn(),
    selectWorkingCsv: vi.fn(),
    selectBackupFolder: vi.fn(),
    saveFinalPhoneImage: vi.fn(),
    loadPhoneImageDataUrl: vi.fn(),
    listWorkPathImages: vi.fn(),
    getPhoneImageDataUrl: vi.fn(),

    // App menu
    onMenuNavigate: vi.fn(() => vi.fn()),
}
