// src/shared/ipc-types.ts
import { IPC_CHANNELS } from './ipc-channels'
import type { DefaultProjectSettings } from '../features/csv-editor/domain/defaultProjectSettings'
import type { PhoneImageSettings } from '../features/csv-editor/domain/phoneImageSettings'

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

export type AppConfig = Record<string, unknown>

export interface PhoneImageSaveFinalRequest {
    filename: string
    jpegBase64: string
}

export interface PhoneImageSaveFinalResponse {
    ok: boolean
    imageCsvValue?: string
    finalPath?: string
    error?: string
}

export interface PhoneImageLoadDataUrlRequest {
    imageRef: string
}

export interface PhoneImageLoadDataUrlResponse {
    ok: boolean
    dataUrl?: string
    error?: string
}

export interface PhoneImageGetImageDataUrlRequest {
    filename: string
}

export interface PhoneImageGetImageDataUrlResponse {
    ok: boolean
    dataUrl?: string
    error?: string
}

export interface PhoneImageWorkPathFile {
    filename: string
    imageCsvValue: string
    finalPath: string
}

export interface PhoneImageListWorkPathImagesResponse {
    ok: boolean
    files: PhoneImageWorkPathFile[]
    error?: string
}

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

    [IPC_CHANNELS.SETTINGS_GET_DEFAULT_PROJECT]: {
        request: void
        response: DefaultProjectSettings
    }

    [IPC_CHANNELS.SETTINGS_SET_DEFAULT_PROJECT]: {
        request: DefaultProjectSettings
        response: DefaultProjectSettings
    }

    [IPC_CHANNELS.SETTINGS_GET_PHONE_IMAGE]: {
        request: void
        response: PhoneImageSettings
    }

    [IPC_CHANNELS.SETTINGS_SET_PHONE_IMAGE]: {
        request: PhoneImageSettings
        response: PhoneImageSettings
    }

    [IPC_CHANNELS.SETTINGS_SELECT_WORK_PATH]: {
        request: void
        response: string | null
    }

    [IPC_CHANNELS.PHONE_IMAGE_SAVE_FINAL]: {
        request: PhoneImageSaveFinalRequest
        response: PhoneImageSaveFinalResponse
    }

    [IPC_CHANNELS.PHONE_IMAGE_LOAD_DATA_URL]: {
        request: PhoneImageLoadDataUrlRequest
        response: PhoneImageLoadDataUrlResponse
    }

    [IPC_CHANNELS.PHONE_IMAGE_LIST_WORK_PATH_IMAGES]: {
        request: void
        response: PhoneImageListWorkPathImagesResponse
    }

    [IPC_CHANNELS.PHONE_IMAGE_GET_IMAGE_DATA_URL]: {
        request: PhoneImageGetImageDataUrlRequest
        response: PhoneImageGetImageDataUrlResponse
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

    getDefaultProjectSettings(): Promise<IpcResponse<typeof IPC_CHANNELS.SETTINGS_GET_DEFAULT_PROJECT>>
    setDefaultProjectSettings(settings: IpcRequest<typeof IPC_CHANNELS.SETTINGS_SET_DEFAULT_PROJECT>): Promise<IpcResponse<typeof IPC_CHANNELS.SETTINGS_SET_DEFAULT_PROJECT>>

    getPhoneImageSettings(): Promise<IpcResponse<typeof IPC_CHANNELS.SETTINGS_GET_PHONE_IMAGE>>
    setPhoneImageSettings(settings: IpcRequest<typeof IPC_CHANNELS.SETTINGS_SET_PHONE_IMAGE>): Promise<IpcResponse<typeof IPC_CHANNELS.SETTINGS_SET_PHONE_IMAGE>>
    selectWorkPath(): Promise<IpcResponse<typeof IPC_CHANNELS.SETTINGS_SELECT_WORK_PATH>>

    saveFinalPhoneImage(request: IpcRequest<typeof IPC_CHANNELS.PHONE_IMAGE_SAVE_FINAL>): Promise<IpcResponse<typeof IPC_CHANNELS.PHONE_IMAGE_SAVE_FINAL>>
    loadPhoneImageDataUrl(request: IpcRequest<typeof IPC_CHANNELS.PHONE_IMAGE_LOAD_DATA_URL>): Promise<IpcResponse<typeof IPC_CHANNELS.PHONE_IMAGE_LOAD_DATA_URL>>
    listWorkPathImages(): Promise<IpcResponse<typeof IPC_CHANNELS.PHONE_IMAGE_LIST_WORK_PATH_IMAGES>>
    getPhoneImageDataUrl(request: IpcRequest<typeof IPC_CHANNELS.PHONE_IMAGE_GET_IMAGE_DATA_URL>): Promise<IpcResponse<typeof IPC_CHANNELS.PHONE_IMAGE_GET_IMAGE_DATA_URL>>

    onMenuNavigate(callback: (route: string) => void): () => void
}
