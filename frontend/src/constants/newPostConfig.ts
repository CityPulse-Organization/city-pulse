import { Dimensions } from "react-native";

export const CONFIG = {
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

const GAP = 4;
export const ITEM_SIZE =
  (CONFIG.SCREEN_WIDTH - GAP * (CONFIG.COLUMN_COUNT - 1)) / CONFIG.COLUMN_COUNT;


export type Photo = {
  id: string;
  uri: string;
  width: number;
  height: number;
};
export type GridItem = Photo | { id: "camera-id" };
