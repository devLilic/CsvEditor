// src/shared/ipc-types.ts
import { IPC_CHANNELS } from './ipc-channels'

export interface CsvFileDescriptor {
    path: string
    content: string
}

export interface CsvWriteResponse {
    ok: boolean
    error?: string
}

export interface CsvBackupResponse {
    ok: boolean
    error?: string
    backupPath?: string
}

export interface AiActionResponse {
    ok: boolean
    error?: string
}

export type AppConfig = Record<string, unknown>

export interface IpcInvokeMap {
    [IPC_CHANNELS.CSV_GET_LAST]: {
        request: void
        response: CsvFileDescriptor | null
    }

    [IPC_CHANNELS.CSV_OPEN_DIALOG]: {
        request: void
        response: CsvFileDescriptor | null
    }

    [IPC_CHANNELS.CSV_WRITE]: {
        request: string // CSV content
        response: CsvWriteResponse
    }

    [IPC_CHANNELS.CSV_BKP]: {
        request: string // CSV content
        response: CsvBackupResponse
    }

    [IPC_CHANNELS.SETTINGS_GET_QUICK_TITLES]: {
        request: void
        response: string[]
    }

    [IPC_CHANNELS.SETTINGS_SET_QUICK_TITLES]: {
        request: string[]
        response: void
    }

    [IPC_CHANNELS.SETTINGS_GET_CONFIG]: {
        request: void
        response: AppConfig
    }

    [IPC_CHANNELS.SETTINGS_SET_CONFIG]: {
        request: AppConfig
        response: AppConfig
    }

    // ✅ AI ASSISTANT INVOKES (Cerere -> Răspuns)
    [IPC_CHANNELS.AI_START_LISTENING]: {
        request: void
        response: AiActionResponse
    }

    [IPC_CHANNELS.AI_STOP_LISTENING]: {
        request: void
        response: AiActionResponse
    }
}

export type IpcChannel = keyof IpcInvokeMap

export type IpcRequest<C extends IpcChannel> = IpcInvokeMap[C]['request']
export type IpcResponse<C extends IpcChannel> = IpcInvokeMap[C]['response']

// Renderer-facing API shape
export interface RendererApi {
    getLastCsv(): Promise<IpcResponse<typeof IPC_CHANNELS.CSV_GET_LAST>>
    openCsvDialog(): Promise<IpcResponse<typeof IPC_CHANNELS.CSV_OPEN_DIALOG>>
    writeCsv(content: IpcRequest<typeof IPC_CHANNELS.CSV_WRITE>): Promise<IpcResponse<typeof IPC_CHANNELS.CSV_WRITE>>
    bkpCsv(content: IpcRequest<typeof IPC_CHANNELS.CSV_BKP>): Promise<IpcResponse<typeof IPC_CHANNELS.CSV_BKP>>

    getQuickTitles(): Promise<IpcResponse<typeof IPC_CHANNELS.SETTINGS_GET_QUICK_TITLES>>
    setQuickTitles(list: IpcRequest<typeof IPC_CHANNELS.SETTINGS_SET_QUICK_TITLES>): Promise<IpcResponse<typeof IPC_CHANNELS.SETTINGS_SET_QUICK_TITLES>>

    getAppConfig(): Promise<IpcResponse<typeof IPC_CHANNELS.SETTINGS_GET_CONFIG>>
    setAppConfig(cfg: IpcRequest<typeof IPC_CHANNELS.SETTINGS_SET_CONFIG>): Promise<IpcResponse<typeof IPC_CHANNELS.SETTINGS_SET_CONFIG>>

    // ✅ AI ASSISTANT METHODS
    // 1. Control
    startAiListening(): Promise<IpcResponse<typeof IPC_CHANNELS.AI_START_LISTENING>>
    stopAiListening(): Promise<IpcResponse<typeof IPC_CHANNELS.AI_STOP_LISTENING>>

    // 2. Trimitere Date (Fire & Forget, nu așteaptă răspuns)
    sendAiAudioChunk(chunk: Float32Array | Uint8Array): void

    // 3. Ascultare Evenimente de la Backend (Returnează o funcție de "unsubscribe" pentru a opri ascultarea)
    onAiTranscription(callback: (text: string) => void): () => void
    onAiSuggestedTitle(callback: (title: string) => void): () => void
    onAiError(callback: (error: string) => void): () => void
}