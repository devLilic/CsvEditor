// electron/main/settings-handlers.ts
import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../../src/shared/ipc-channels'
import type { AppConfig } from '../../src/shared/ipc-types'
import { getQuickTitles, setQuickTitles, getAppConfig, setAppConfig } from '../store'

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((v) => typeof v === 'string')
}

function isPlainObject(value: unknown): value is AppConfig {
    return !!value && typeof value === 'object' && !Array.isArray(value)
}

export function registerSettingsHandlers() {
    ipcMain.handle(IPC_CHANNELS.SETTINGS_GET_QUICK_TITLES, () => {
        try {
            return getQuickTitles()
        } catch (error) {
            console.error('[settings:get-quickTitles] failed:', error)
            return [] as string[]
        }
    })

    ipcMain.handle(IPC_CHANNELS.SETTINGS_SET_QUICK_TITLES, (_event, list: unknown) => {
        try {
            if (!isStringArray(list)) {
                console.warn('[settings:set-quickTitles] invalid payload, expected string[]')
                return
            }
            setQuickTitles(list)
        } catch (error) {
            console.error('[settings:set-quickTitles] failed:', error)
        }
    })

    ipcMain.handle(IPC_CHANNELS.SETTINGS_GET_CONFIG, () => {
        try {
            return getAppConfig()
        } catch (error) {
            console.error('[settings:get-config] failed:', error)
            return {} as AppConfig
        }
    })

    ipcMain.handle(IPC_CHANNELS.SETTINGS_SET_CONFIG, (_event, cfg: unknown) => {
        try {
            if (!isPlainObject(cfg)) {
                console.warn('[settings:set-config] invalid payload, expected object')
                return getAppConfig()
            }
            return setAppConfig(cfg)
        } catch (error) {
            console.error('[settings:set-config] failed:', error)
            return getAppConfig()
        }
    })
}
