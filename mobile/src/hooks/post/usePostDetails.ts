import { POSTS } from "@/src/components";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef } from "react";

export const usePostDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const activePostId = params.id as string;
  const isOwnPost = params.isOwnPost === "true";

  const currentPostData = useMemo(
    () => POSTS.find((mockPost) => mockPost.id === activePostId),
    [activePostId],
  );

  const commentsBottomSheetRef = useRef<BottomSheetModal>(null);
  const openPresentCommentsSheet = useCallback(() => {
    commentsBottomSheetRef.current?.present();
  }, []);

  const handleBack = useCallback(() => router.back(), [router]);

  if (!currentPostData) {
    return {
      isReady: false as const,
      imagesUrl: [] as string[],
      description: "",
      username: "",
      profileImageUrl: "",
      accidentTime: "",
      location: "",
      isBroadcasting: false,
      commentsBottomSheetRef,
      openPresentCommentsSheet,
      handleBack,
      isOwnPost,
    };
  }

  const {
    imagesUrl = [],
    description = "",
    username,
    profileImageUrl = "",
    accidentTime,
    location = "",
    isBroadcasting = false,
  } = currentPostData;

  return {
    imagesUrl,
    description,
    username,
    profileImageUrl,
    accidentTime,
    location,
    isBroadcasting,
    commentsBottomSheetRef,
    openPresentCommentsSheet,
    handleBack,
    isOwnPost,
  };
}