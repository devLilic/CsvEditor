// src/test/mocks/ipcMock.ts
import { vi } from 'vitest'

export const ipcMock = {
    // CSV
    getLastCsv: vi.fn(),
    openCsvDialog: vi.fn(),
    writeCsv: vi.fn(),
    bkpCsv: vi.fn(), // ⬅️ OBLIGATORIU exact acest nume

    // Settings
    getQuickTitles: vi.fn(),
    setQuickTitles: vi.fn(),
    getAppConfig: vi.fn(),
    setAppConfig: vi.fn(),
}
