export const IPC_CHANNELS = {
    CSV_GET_LAST: "csv:getLast",
    CSV_OPEN_DIALOG: "csv:openDialog",
    CSV_WRITE: "csv:write",
    CSV_BKP: "csv:bkp",

    SETTINGS_GET_QUICK_TITLES: "settings:get-quickTitles",
    SETTINGS_SET_QUICK_TITLES: "settings:set-quickTitles",

    SETTINGS_GET_CONFIG: "settings:get-config",
    SETTINGS_SET_CONFIG: "settings:set-config",


    // AI ASSISTANT CHANNELS
    AI_START_LISTENING: 'ai:start-listening',   // React îi spune lui Electron să deschidă conexiunea AI
    AI_STOP_LISTENING: 'ai:stop-listening',     // React îi spune lui Electron să închidă conexiunea
    AI_AUDIO_CHUNK: 'ai:audio-chunk',           // React trimite o bucată de sunet către Electron
    AI_TRANSCRIPTION_TEXT: 'ai:transcription',  // Electron trimite textul transcris înapoi la React
    AI_SUGGESTED_TITLE: 'ai:suggested-title',   // Electron trimite titlul final formulat de GPT
    AI_ERROR: 'ai:error'                        // Electron raportează o eroare
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];
