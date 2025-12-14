// src/features/settings/services/settingsService.ts
import type { AppConfig } from '@/shared/ipc-types'

/**
 * Accessor lazy pentru preload API.
 * NU se citește electronAPI la import-time.
 * Permite mock în testare fără Electron runtime.
 */
function getApi() {
    const api = (window as any)?.electronAPI

    if (!api) {
        throw new Error('electronAPI not available')
    }

    return api
}

/**
 * settingsService
 *
 * Responsabilități:
 * - wrapper sigur peste IPC Electron (settings)
 * - fallback predictibil
 * - complet testabil fără Electron
 *
 * NU face:
 * - validare business
 * - state management
 * - logică UI
 */
export const settingsService = {
    /**
     * Returnează lista quickTitles
     */
    async getQuickTitles(): Promise<string[]> {
        try {
            const res = await getApi().getQuickTitles()
            return Array.isArray(res) ? res : []
        } catch {
            return []
        }
    },

    /**
     * Persistă lista quickTitles
     */
    async setQuickTitles(list: string[]): Promise<void> {
        if (!Array.isArray(list)) return

        try {
            await getApi().setQuickTitles(list)
        } catch {
            // intentionally silent
        }
    },

    /**
     * Returnează configurația aplicației
     */
    async getConfig(): Promise<AppConfig> {
        try {
            const res = await getApi().getAppConfig()
            return (res && typeof res === 'object') ? res : {}
        } catch {
            return {}
        }
    },

    /**
     * Salvează configurația aplicației
     */
    async setConfig(cfg: AppConfig): Promise<AppConfig> {
        if (!cfg || typeof cfg !== 'object') {
            return {}
        }

        try {
            const res = await getApi().setAppConfig(cfg)
            return (res && typeof res === 'object') ? res : {}
        } catch {
            return {}
        }
    },
}
