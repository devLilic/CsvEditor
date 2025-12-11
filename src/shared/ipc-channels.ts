export const IPC_CHANNELS = {
    CSV_GET_LAST: "csv:getLast",
    CSV_OPEN_DIALOG: "csv:openDialog",
    CSV_WRITE: "csv:write",
    CSV_BKP: "csv:bkp",

    SETTINGS_GET_QUICK_TITLES: "settings:get-quickTitles",
    SETTINGS_SET_QUICK_TITLES: "settings:set-quickTitles",

    SETTINGS_GET_CONFIG: "settings:get-config",
    SETTINGS_SET_CONFIG: "settings:set-config",
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];
