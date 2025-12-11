// electron/preload/api.ts
import { ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../../src/shared/ipc-channels'
import type { RendererApi } from '../../src/shared/ipc-types'

export const electronApi: RendererApi = {
    getLastCsv() {
        return ipcRenderer.invoke(IPC_CHANNELS.CSV_GET_LAST)
    },

    openCsvDialog() {
        return ipcRenderer.invoke(IPC_CHANNELS.CSV_OPEN_DIALOG)
    },

    writeCsv(content) {
        return ipcRenderer.invoke(IPC_CHANNELS.CSV_WRITE, content)
    },

    bkpCsv(content) {
        return ipcRenderer.invoke(IPC_CHANNELS.CSV_BKP, content)
    },

    getQuickTitles() {
        return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET_QUICK_TITLES)
    },

    setQuickTitles(list) {
        return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SET_QUICK_TITLES, list)
    },

    getAppConfig() {
        return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET_CONFIG)
    },

    setAppConfig(cfg) {
        return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SET_CONFIG, cfg)
    },
}
