// electron/preload/api.ts
import { ipcRenderer } from 'electron'
import type { IpcRendererEvent } from 'electron'
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

    getDefaultProjectSettings() {
        return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET_DEFAULT_PROJECT)
    },

    setDefaultProjectSettings(settings) {
        return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SET_DEFAULT_PROJECT, settings)
    },

    getPhoneImageSettings() {
        return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET_PHONE_IMAGE)
    },

    setPhoneImageSettings(settings) {
        return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SET_PHONE_IMAGE, settings)
    },

    selectWorkPath() {
        return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SELECT_WORK_PATH)
    },

    saveFinalPhoneImage(request) {
        return ipcRenderer.invoke(IPC_CHANNELS.PHONE_IMAGE_SAVE_FINAL, request)
    },

    loadPhoneImageDataUrl(request) {
        return ipcRenderer.invoke(IPC_CHANNELS.PHONE_IMAGE_LOAD_DATA_URL, request)
    },

    listWorkPathImages() {
        return ipcRenderer.invoke(IPC_CHANNELS.PHONE_IMAGE_LIST_WORK_PATH_IMAGES)
    },

    getPhoneImageDataUrl(request) {
        return ipcRenderer.invoke(IPC_CHANNELS.PHONE_IMAGE_GET_IMAGE_DATA_URL, request)
    },

    onMenuNavigate(callback) {
        const listener = (_event: IpcRendererEvent, route: unknown) => {
            if (typeof route === 'string') {
                callback(route)
            }
        }

        ipcRenderer.on(IPC_CHANNELS.APP_MENU_NAVIGATE, listener)

        return () => {
            ipcRenderer.removeListener(IPC_CHANNELS.APP_MENU_NAVIGATE, listener)
        }
    },
}
