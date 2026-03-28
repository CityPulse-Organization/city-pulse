import { Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const NEW_POST_IMAGE_CONFIG = {
    SCREEN_WIDTH,
    COLUMN_COUNT: 4,
    FETCH_LIMIT: 100,
    MAX_SELECTION: 10,
    IMAGE_PREVIEW_HEIGHT: SCREEN_WIDTH * 0.9,
};


const GAP = 4;
export const ITEM_SIZE =
    (NEW_POST_IMAGE_CONFIG.SCREEN_WIDTH - GAP * (NEW_POST_IMAGE_CONFIG.COLUMN_COUNT - 1)) / NEW_POST_IMAGE_CONFIG.COLUMN_COUNT;
