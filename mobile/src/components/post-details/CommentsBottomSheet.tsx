import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { memo, useCallback, useMemo, useState } from "react";
import { Comment } from "../Comment";
import {
  UIBottomSheet,
  UIButton,
  UIDivider,
  UIText,
  UIEmptyState,
} from "@/src/ui";
import { ActivityIndicator, View, LayoutAnimation } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "../Icon";
import { StyleSheet } from "react-native-unistyles";
import type { CommentResponse, CommentItem } from "@/src/types";
import { formatPrettyDate } from "@/src/utils";
import { axios } from "@/src/config";
import { useProfile } from "../../hooks/profile/useProfile";
import { useCommentReplies } from "../../hooks/post/usePost";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Animated, { FadeIn } from "react-native-reanimated";

type CommentsBottomSheetProps = {
  commentsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  comments: CommentResponse[];
  onSendComment: (text: string) => void;
  onSendReply: (variables: { text: string; parentId: number }) => void;
  onToggleLikeComment: (variables: {
    commentId: number;
    isCurrentlyLiked: boolean;
  }) => void;
  fetchNextComments: () => void;
  hasNextCommentsPage: boolean;
  isFetchingNextComments: boolean;
};

export const CommentsBottomSheet = memo(
  ({
    commentsBottomSheetRef,
    comments,
    onSendComment,
    onSendReply,
    onToggleLikeComment,
    fetchNextComments,
    hasNextCommentsPage,
    isFetchingNextComments,
  }: CommentsBottomSheetProps) => {
    const footerHeightShared = useSharedValue(0);
    const [replyingTo, setReplyingTo] = useState<CommentResponse | null>(null);
    const [expandedComments, setExpandedComments] = useState<Set<number>>(
      new Set(),
    );

    const onViewRepliesHandler = useCallback(async (commentId: string) => {
      const id = Number(commentId);
      setExpandedComments((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    }, []);

    const animatedPaddingStyle = useAnimatedStyle(() => ({
      paddingBottom: footerHeightShared.value,
    }));

    const renderCommentsFooter = useCallback(
      (footerProps: BottomSheetFooterProps) => (
        <CommentsFooter
          bottomSheetProps={footerProps}
          onHeightChange={(height: number) => {
            footerHeightShared.value = withTiming(height, { duration: 200 });
          }}
          onSendComment={onSendComment}
          onSendReply={onSendReply}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      ),
      [onSendComment, onSendReply, replyingTo],
    );

    const mappedComments: CommentItem[] = useMemo(
      () =>
        comments.map((comment) => ({
          id: String(comment.id),
          username: comment.authorUsername ?? "Loading...",
          commentText: comment.text,
          timeAgo: formatPrettyDate(comment?.createdAt),
          profileImageUrl: comment.authorAvatarUrl ?? undefined,
          replyCount: comment.replyCount,
          likeCount: comment.likeCount,
          isLikedByMe: comment.isLikedByMe,
        })),
      [comments],
    );

    const handleLoadMore = useCallback(() => {
      if (hasNextCommentsPage && !isFetchingNextComments) {
        fetchNextComments();
      }
    }, [fetchNextComments, hasNextCommentsPage, isFetchingNextComments]);

    const keyExtractor = useCallback(
      (commentData: CommentItem) => commentData.id,
      [],
    );

    const mapCommentToItem = useCallback(
      (comment: CommentResponse): CommentItem => ({
        id: String(comment.id),
        username: comment.authorUsername ?? "Loading...",
        commentText: comment.text,
        timeAgo: formatPrettyDate(comment.createdAt),
        profileImageUrl: comment.authorAvatarUrl ?? undefined,
        replyCount: comment.replyCount,
        likeCount: comment.likeCount,
        isLikedByMe: comment.isLikedByMe,
      }),
      [],
    );

    const renderItem = useCallback(
      ({ item: commentData }: { item: CommentItem }) => {
        const comment = comments.find((c) => String(c.id) === commentData.id);
        const isExpanded = expandedComments.has(Number(commentData.id));
        return (
          <View>
            <Comment
              comment={commentData}
              onReplyPress={
                comment
                  ? () => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut,
                      );
                      setReplyingTo(comment);
                    }
                  : undefined
              }
              onViewReplies={onViewRepliesHandler}
              isExpanded={isExpanded}
              onToggleLike={(isCurrentlyLiked) =>
                onToggleLikeComment({
                  commentId: Number(commentData.id),
                  isCurrentlyLiked,
                })
              }
            />
            {isExpanded && (
              <CommentReplies
                commentId={Number(commentData.id)}
                onToggleLikeComment={onToggleLikeComment}
              />
            )}
          </View>
        );
      },
      [comments, expandedComments, onToggleLikeComment, onViewRepliesHandler],
    );

    return (
      <UIBottomSheet
        header={<CommentsHeader />}
        ref={commentsBottomSheetRef}
        snapPoints={["75%"]}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="none"
        topInset={styles.bottomSheet.top}
        footerComponent={renderCommentsFooter}
      >
        <BottomSheetFlatList
          data={mappedComments}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, animatedPaddingStyle]}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextComments ? (
              <ActivityIndicator size="small" color={styles.loading.color} />
            ) : null
          }
          ListEmptyComponent={
            <UIEmptyState
              icon="chatbubbles-outline"
              title="No comments yet"
              description="Be the first to share your thoughts!"
            />
          }
        />
      </UIBottomSheet>
    );
  },
);

const CommentReplies = memo(
  ({
    commentId,
    onToggleLikeComment,
  }: {
    commentId: number;
    onToggleLikeComment: (params: {
      commentId: number;
      isCurrentlyLiked: boolean;
    }) => void;
  }) => {
    const { data: repliesData, isLoading } = useCommentReplies(commentId, true);

    const replies = useMemo(() => {
      if (!repliesData?.pages) return [];
      return repliesData.pages.flatMap((page) => page.content);
    }, [repliesData]);

    const mapCommentToItem = useCallback(
      (comment: CommentResponse): CommentItem => ({
        id: String(comment.id),
        username: comment.authorUsername ?? "Loading...",
        commentText: comment.text,
        timeAgo: formatPrettyDate(comment.createdAt),
        profileImageUrl: comment.authorAvatarUrl ?? undefined,
        replyCount: comment.replyCount,
        likeCount: comment.likeCount,
        isLikedByMe: comment.isLikedByMe,
      }),
      [],
    );

    if (isLoading && !repliesData) {
      return (
        <ActivityIndicator
          size="small"
          color={styles.loading.color}
          style={{ padding: 10 }}
        />
      );
    }

    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        style={styles.repliesContainer}
      >
        {replies.map((reply) => (
          <Comment
            key={reply.id}
            comment={mapCommentToItem(reply)}
            isReply
            onReplyPress={undefined}
            onViewReplies={undefined}
            onToggleLike={(isCurrentlyLiked) =>
              onToggleLikeComment({
                commentId: reply.id,
                isCurrentlyLiked,
              })
            }
          />
        ))}
      </Animated.View>
    );
  },
);

const CommentsHeader = memo(() => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Ionicons
          name="chatbubble-outline"
          size={styles.headerIcon.height}
          color={styles.headerIcon.color}
        />
        <UIText size="md" weight="normal" style={styles.headerText}>
          Comments
        </UIText>
      </View>

      <UIDivider color={styles.headerDivider.color} />
    </View>
  );
});

type CommentsFooterProps = {
  bottomSheetProps: BottomSheetFooterProps;
  onHeightChange: (height: number) => void;
  onSendComment: (text: string) => void;
  onSendReply: (variables: { text: string; parentId: number }) => void;
  replyingTo: CommentResponse | null;
  onCancelReply: () => void;
};

const CommentsFooter = memo(
  ({
    bottomSheetProps,
    onHeightChange,
    onSendComment,
    onSendReply,
    replyingTo,
    onCancelReply,
  }: CommentsFooterProps) => {
    const { profile } = useProfile();
    const currentUserAvatarUrl = profile?.avatarUrl;

    const [commentText, setCommentText] = useState("");

    const [isInputActive, setIsInputActive] = useState(false);

    const isCommentValid = commentText.trim().length > 0;

    const handleInputFocus = useCallback(() => {
      setIsInputActive(true);
    }, []);

    const handleInputBlur = useCallback(() => {
      setIsInputActive(false);
    }, []);

    const handleSendComment = useCallback(() => {
      if (commentText.trim().length > 0) {
        if (replyingTo) {
          onSendReply({ text: commentText.trim(), parentId: replyingTo.id });
          onCancelReply();
        } else {
          onSendComment(commentText.trim());
        }
      }
      setCommentText("");
    }, [commentText, replyingTo, onSendComment, onSendReply, onCancelReply]);

    return (
      <BottomSheetFooter {...bottomSheetProps}>
        <View
          style={styles.footerContainer}
          onLayout={(e) => onHeightChange(e.nativeEvent.layout.height)}
        >
          <UIDivider height={styles.footerDivider.height} />

          {replyingTo && (
            <View style={styles.replyingToContainer}>
              <UIText
                size="xs"
                style={styles.replyingToText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Replying to @{replyingTo.authorUsername ?? "Loading..."} says "
                {replyingTo.text}"
              </UIText>
              <UIButton onPress={onCancelReply} style={styles.cancelButton}>
                <Ionicons
                  name="close"
                  size={16}
                  color={styles.closeIcon.color}
                />
              </UIButton>
            </View>
          )}

          <View style={styles.footerInputBar(isInputActive)}>
            <Icon profileImageUrl={currentUserAvatarUrl!} size="comment" />

            <BottomSheetTextInput
              style={styles.footerInput}
              placeholder={replyingTo ? "Add a reply..." : "Add a comment..."}
              placeholderTextColor={styles.inputPlaceholder.color}
              onChangeText={setCommentText}
              value={commentText}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />

            <UIButton
              style={[
                styles.sendButton,
                isCommentValid && {
                  backgroundColor: styles.activeSendButton.backgroundColor,
                },
              ]}
              onPress={handleSendComment}
              disabled={!isCommentValid}
            >
              <Ionicons
                name="send-outline"
                size={styles.sendButtonIcon.height}
                color={
                  isCommentValid
                    ? styles.sendButtonIcon.color
                    : styles.sendButtonIconActive.color
                }
              />
            </UIButton>
          </View>
        </View>
      </BottomSheetFooter>
    );
  },
);

const styles = StyleSheet.create((theme, rt) => ({
  bottomSheet: {
    top: rt.insets.top,
  },
  repliesContainer: {
    gap: theme.utils.s(16),
  },
  listContent: {
    paddingHorizontal: theme.utils.s(10),
  },
  loading: {
    color: theme.colors.accent,
  },

  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(16),
    paddingBottom: theme.utils.vs(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(12),
  },
  headerText: {
    color: theme.colors.primaryText,
  },
  headerIcon: {
    height: theme.utils.s(20),
    color: theme.colors.accent,
  },
  headerDivider: {
    color: theme.colors.darkAccent,
  },

  footerContainer: {
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(14),
  },
  footerDivider: {
    height: theme.utils.vs(0.5),
  },
  footerInputBar: (isInputActive: boolean) => ({
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(10),
    paddingHorizontal: theme.utils.s(10),
    paddingBottom: isInputActive
      ? theme.utils.vs(14)
      : Math.max(rt.insets.bottom, theme.utils.vs(30)),
  }),
  footerInput: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSubtle,
    borderRadius: 999,
    paddingHorizontal: theme.utils.s(16),
    paddingVertical: theme.utils.s(10),
    color: theme.colors.primaryText,
    fontSize: theme.utils.ms(14),
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  inputPlaceholder: {
    color: theme.colors.muted,
  },

  sendButton: {
    paddingHorizontal: theme.utils.s(10),
    paddingVertical: theme.utils.s(10),
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundSubtle,
  },
  activeSendButton: {
    backgroundColor: theme.colors.accent,
  },
  sendButtonIcon: {
    height: theme.utils.s(18),
    color: theme.colors.white,
  },
  sendButtonIconActive: {
    color: theme.colors.muted,
  },
  replyingToContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.utils.s(10),
    paddingVertical: theme.utils.s(4),
  },
  replyingToText: {
    color: theme.colors.muted,
  },
  cancelButton: {
    padding: theme.utils.s(4),
  },
  closeIcon: {
    color: theme.colors.muted,
  },
}));
