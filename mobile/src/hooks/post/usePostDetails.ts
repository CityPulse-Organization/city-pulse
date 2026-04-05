import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { usePost } from "./usePost";
import { useSession } from "@/src/hoc";
import { useProfile } from "../profile/useProfile";
import { formatPrettyDate } from "@/src/utils";

export const usePostDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { session } = useSession();

  const activePostId = Number(params.id);
  const currentUserId = String(session.user?.id || "");

  const {
    post,
    isPostLoading,
    comments,
    isCommentsLoading,
    fetchNextComments,
    hasNextCommentsPage,
    isFetchingNextComments,
    toggleLike,
    sendComment,
    removeComment,
    editPost,
    removePost,
  } = usePost(activePostId);

  const { profile: authorProfile } = useProfile(post?.userId);

  const commentsBottomSheetRef = useRef<BottomSheetModal>(null);
  const openPresentCommentsSheet = useCallback(() => {
    commentsBottomSheetRef.current?.present();
  }, []);

  const handleBack = useCallback(() => router.back(), [router]);

  const imagesUrl = useMemo(
    () => (post?.imageUrl ? [post.imageUrl] : []),
    [post?.imageUrl],
  );

  const isOwnPost = useMemo(
    () => !!(post && String(post.userId) === currentUserId),
    [post, currentUserId],
  );

  return {
    imagesUrl,
    description: post?.caption ?? "",
    username: authorProfile?.username ?? String(post?.userId ?? ""),
    profileImageUrl: authorProfile?.avatarUrl ?? "",
    accidentTime: formatPrettyDate(post?.createdAt),
    location: "",

    likeCount: post?.likeCount ?? 0,
    isLikedByCurrentUser: post?.isLikedByCurrentUser ?? false,
    commentCount: post?.commentCount ?? 0,
    toggleLike,
    comments,
    sendComment,
    removeComment,

    editPost,
    removePost,
    postId: activePostId,

    isPostLoading,
    isCommentsLoading,
    fetchNextComments,
    hasNextCommentsPage,
    isFetchingNextComments,

    commentsBottomSheetRef,
    openPresentCommentsSheet,
    handleBack,
    isOwnPost,
  };
};
