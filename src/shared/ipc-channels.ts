export const IPC_CHANNELS = {
    CSV_GET_LAST: "csv:getLast",
    CSV_OPEN_DIALOG: "csv:openDialog",
    CSV_WRITE: "csv:write",
    CSV_BKP: "csv:bkp",

    SETTINGS_GET_QUICK_TITLES: "settings:get-quickTitles",
    SETTINGS_SET_QUICK_TITLES: "settings:set-quickTitles",

    SETTINGS_GET_CONFIG: "settings:get-config",
    SETTINGS_SET_CONFIG: "settings:set-config",

    SETTINGS_GET_DEFAULT_PROJECT: "settings:get-default-project",
    SETTINGS_SET_DEFAULT_PROJECT: "settings:set-default-project",

    SETTINGS_GET_PHONE_IMAGE: "settings:get-phone-image",
    SETTINGS_SET_PHONE_IMAGE: "settings:set-phone-image",
    SETTINGS_SELECT_WORK_PATH: "settings:select-work-path",

    PHONE_IMAGE_SAVE_FINAL: "phone-image:save-final",
    PHONE_IMAGE_LOAD_DATA_URL: "phone-image:load-data-url",
    PHONE_IMAGE_LIST_WORK_PATH_IMAGES: "phone-image:list-work-path-images",
    PHONE_IMAGE_GET_IMAGE_DATA_URL: "phone-image:get-image-data-url",

    APP_MENU_NAVIGATE: "app-menu:navigate",
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];
