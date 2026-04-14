import { Dimensions } from "react-native";
import { Photo } from "./newPostImage";

export type PostResponse = {
  id: number;
  userId: string;
  username: string | null;
  avatarUrl: string | null;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  isSavedByMe: boolean;
};

export type CommentResponse = {
  id: number;
  postId: number;
  parentId: number | null;
  text: string;
  createdAt: string;
  likeCount: number;
  replyCount: number;
  isLikedByMe: boolean;
  authorId: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
};

export type CommentRequest = {
  text: string;
  parentId?: number;
};

export type PostItem = {
  id: string;
  username: string;
  accidentTime: string;
  imagesUrl: string[];
  description?: string;
  profileImageUrl?: string;
  location: string;
  likeCount?: number;
  commentCount?: number;
};

export type CommentItem = {
  id: string;
  username: string;
  commentText: string;
  timeAgo: string;
  profileImageUrl?: string;
  replyCount: number;
  likeCount: number;
  isLikedByMe: boolean;
};

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
  (POST_CONFIG.SCREEN_WIDTH - GAP * (POST_CONFIG.COLUMN_COUNT - 1)) /
  POST_CONFIG.COLUMN_COUNT;
