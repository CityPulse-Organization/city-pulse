import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback, useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UIButton, UIText } from "../ui";
import { Icon } from "./Icon";
import type { CommentItem } from "../types";

type CommentProps = {
  comment: CommentItem;
  isReply?: boolean;
  onReplyPress?: () => void;
  onViewReplies?: (commentId: string) => void | Promise<void>;
  isExpanded?: boolean;
  onToggleLike?: (isLiked: boolean) => void;
};

export const Comment = memo(
  ({
    comment,
    isReply = false,
    onReplyPress,
    onViewReplies,
    isExpanded = false,
    onToggleLike,
  }: CommentProps) => {
    const iconSize = isReply ? "small" : "comment";

    const [isLiked, setIsLiked] = useState(comment.isLikedByMe);

    const likeCount =
      (comment.likeCount || 0) +
      (isLiked === comment.isLikedByMe ? 0 : isLiked ? 1 : -1);

    const toggleLikeStatus = useCallback(() => {
      setIsLiked((prev) => !prev);
      onToggleLike?.(isLiked);
    }, [isLiked, onToggleLike]);

    const handleReply = useCallback(() => {
      onReplyPress?.();
    }, [onReplyPress]);

    return (
      <View style={styles.container(isReply)}>
        <View style={styles.commentHeaderRow}>
          <View style={styles.iconContainer}>
            <Icon profileImageUrl={comment.profileImageUrl} size={iconSize} />
          </View>

          <View style={styles.commentBody}>
            <View style={styles.commentMeta}>
              <View style={styles.usernameWrapper}>
                <UIText
                  size="sm"
                  weight="bold"
                  style={styles.username}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {comment.username}
                </UIText>
              </View>

              <UIText size="xs" style={styles.commentTime}>
                {comment.timeAgo}
              </UIText>
            </View>

            <UIText size="sm" style={styles.commentText}>
              {comment.commentText}
            </UIText>

            {!isReply && (
              <UIButton onPress={handleReply} style={styles.actionButton}>
                <UIText size="sm" weight="normal" style={styles.actionText}>
                  Reply
                </UIText>
              </UIButton>
            )}

            {comment.replyCount > 0 && !isReply && (
              <UIButton
                onPress={() => onViewReplies?.(comment.id)}
                style={styles.actionButton}
              >
                <UIText size="sm" weight="normal" style={styles.actionText}>
                  View {comment.replyCount}{" "}
                  {comment.replyCount === 1 ? "reply" : "replies"}
                </UIText>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={styles.actionText.color}
                />
              </UIButton>
            )}
          </View>

          <UIButton onPress={toggleLikeStatus} style={styles.likeContainer}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={styles.likeSize.height}
              color={
                isLiked
                  ? styles.likeActive.color
                  : styles.likeInactive.color
              }
            />
            <UIText size="xs" weight="normal" style={styles.likeCountText}>
              {likeCount}
            </UIText>
          </UIButton>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  container: (isReply: boolean) => ({
    width: "100%",
    paddingBottom: theme.utils.vs(6),
    paddingLeft: isReply ? theme.utils.s(40) : 0,
  }),

  commentHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.utils.s(10),
  },

  iconContainer: {
    flexShrink: 0,
  },

  commentBody: {
    flex: 1,
  },

  commentMeta: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: theme.utils.vs(4),
    gap: theme.utils.s(10),
  },
  usernameWrapper: {
    flexShrink: 1,
  },
  username: {
    color: theme.colors.primaryText,
  },
  commentTime: {
    flexShrink: 0,
    color: theme.colors.muted,
  },
  commentText: {
    color: theme.colors.primaryText,
  },

  likeContainer: {
    flexShrink: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.utils.s(2),
  },
  likeCountText: {
    color: theme.colors.muted,
  },
  likeSize: {
    height: theme.utils.s(18),
  },
  likeActive: {
    color: theme.colors.lightRed,
  },
  likeInactive: {
    color: theme.colors.icon,
  },

  actionButton: {
    alignSelf: "flex-start",
    paddingVertical: theme.utils.vs(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    color: theme.colors.muted,
  },
}));
