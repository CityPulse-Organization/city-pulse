import { Dimensions } from "react-native";
import { type Photo } from "./newPostImage";

export const POST_CONFIG = {
  SCREEN_WIDTH: Dimensions.get("window").width,
  COLUMN_COUNT: 4,
  FETCH_LIMIT: 40,
  MAX_SELECTION: 10,
  CROPPER: {
    width: 1080,
    height: 1350,
    mediaType: "photo" as const,
  },
};

export type GridItem = Photo | { id: "camera-id" };

const GAP = 4;
export const ITEM_SIZE =
  (POST_CONFIG.SCREEN_WIDTH - GAP * (POST_CONFIG.COLUMN_COUNT - 1)) / POST_CONFIG.COLUMN_COUNT;
