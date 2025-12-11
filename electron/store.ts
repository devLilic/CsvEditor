// electron/store.ts
import Store from 'electron-store'
import type { AppConfig } from '../src/shared/ipc-types'

export interface AppStoreSchema {
    quickTitles: string[]
    csvFilePath: string | null
    appConfig: AppConfig
}

const store = new Store<AppStoreSchema>({
    defaults: {
        quickTitles: [],
        csvFilePath: null,
        appConfig: {},
    },

})

export function getCsvFilePath(): string | null {
    // @ts-ignore
    const value = store.get('csvFilePath')
    return typeof value === 'string' && value.length > 0 ? value : null
}

export function setCsvFilePath(path: string | null): void {
    // @ts-ignore
    store.set('csvFilePath', path)
}

export function getQuickTitles(): string[] {
    // @ts-ignore
    const value = store.get('quickTitles')
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

export function setQuickTitles(list: string[]): void {
    // @ts-ignore
    store.set('quickTitles', list)
}

export function getAppConfig(): AppConfig {
    // @ts-ignore
    const value = store.get('appConfig')
    return (value && typeof value === 'object') ? (value as AppConfig) : {}
}

export function setAppConfig(cfg: AppConfig): AppConfig {
    const safeCfg = (cfg && typeof cfg === 'object') ? cfg : {}
    // @ts-ignore
    store.set('appConfig', safeCfg)
    return safeCfg
}

export default store
