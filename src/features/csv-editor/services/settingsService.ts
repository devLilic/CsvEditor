// features/csv-editor/services/settingsService.ts

import type {
    RendererApi,
    AppConfig,
} from '@/shared/ipc-types'

/**
 * Wrapper tipizat pentru settings IPC
 */
const api = window.electronAPI as RendererApi

export const settingsService = {
    /**
     * QuickTitles persistence
     */
    async getQuickTitles(): Promise<string[]> {
        return api.getQuickTitles()
    },

    async setQuickTitles(list: string[]): Promise<void> {
        await api.setQuickTitles(list)
    },

    /**
     * Generic app config (key-value)
     */
    async getConfig(): Promise<AppConfig> {
        return api.getAppConfig()
    },

    async setConfig(cfg: AppConfig): Promise<AppConfig> {
        return api.setAppConfig(cfg)
    },
}
