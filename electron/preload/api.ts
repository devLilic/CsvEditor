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

    // ==========================================
    // 🤖 AI ASSISTANT API
    // ==========================================
    startAiListening() {
        return ipcRenderer.invoke(IPC_CHANNELS.AI_START_LISTENING)
    },
    stopAiListening() {
        return ipcRenderer.invoke(IPC_CHANNELS.AI_STOP_LISTENING)
    },
    sendAiAudioChunk(chunk) {
        // Folosim .send() pentru că este Fire-and-Forget (foarte rapid, streaming continuu)
        ipcRenderer.send(IPC_CHANNELS.AI_AUDIO_CHUNK, chunk)
    },
    onAiTranscription(callback) {
        const handler = (_event: any, text: string) => callback(text)
        ipcRenderer.on(IPC_CHANNELS.AI_TRANSCRIPTION_TEXT, handler)
        // Returnăm funcția de dezabonare (cleanup)
        return () => { ipcRenderer.removeListener(IPC_CHANNELS.AI_TRANSCRIPTION_TEXT, handler) }
    },
    onAiSuggestedTitle(callback) {
        const handler = (_event: any, title: string) => callback(title)
        ipcRenderer.on(IPC_CHANNELS.AI_SUGGESTED_TITLE, handler)
        return () => { ipcRenderer.removeListener(IPC_CHANNELS.AI_SUGGESTED_TITLE, handler) }
    },
    onAiError(callback) {
        const handler = (_event: any, error: string) => callback(error)
        ipcRenderer.on(IPC_CHANNELS.AI_ERROR, handler)
        return () => { ipcRenderer.removeListener(IPC_CHANNELS.AI_ERROR, handler) }
    }
}