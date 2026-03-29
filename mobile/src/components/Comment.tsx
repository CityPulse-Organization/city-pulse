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
};

export const Comment = memo(({ comment, isReply = false }: CommentProps) => {
  const iconSize = isReply ? "small" : "comment";
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);
  const [totalLikeCount, setTotalLikeCount] = useState(0);

  const toggleLikeStatus = useCallback(() => {
    setIsLikedByCurrentUser((prev) => {
      const nextStatus = !prev;
      setTotalLikeCount((currentCount) =>
        nextStatus ? currentCount + 1 : currentCount - 1,
      );
      return nextStatus;
    });
  }, []);

  const handleReply = useCallback(() => {
    // TODO: Keyboard opening / user tagging logic
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.commentHeaderRow}>
        <View style={styles.iconContainer}>
          <Icon profileImageUrl={comment.profileImageUrl} size={iconSize} />
        </View>

        <View style={styles.commentBody}>
          <View style={styles.commentMeta}>
            <UIText size="sm" weight="bold" style={styles.username}>
              {comment.username}
            </UIText>

            <UIText size="xs" style={styles.commentTime}>
              {comment.timeAgo}
            </UIText>
          </View>

          <UIText size="sm" style={styles.commentText}>
            {comment.commentText}
          </UIText>

          <UIButton onPress={handleReply} style={styles.actionButton}>
            <UIText size="sm" weight="normal" style={styles.actionText}>
              Reply
            </UIText>
          </UIButton>
        </View>

        <UIButton onPress={toggleLikeStatus} style={styles.likeContainer}>
          <Ionicons
            name={isLikedByCurrentUser ? "heart" : "heart-outline"}
            size={styles.likeSize.height}
            color={
              isLikedByCurrentUser
                ? styles.likeActive.color
                : styles.likeInactive.color
            }
          />
          <UIText size="xs" weight="normal" style={styles.likeCountText}>
            {totalLikeCount}
          </UIText>
        </UIButton>
      </View>
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  container: {
    width: "100%",
    paddingBottom: theme.utils.vs(6),
  },

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
  username: {
    color: theme.colors.primaryText,
  },
  commentTime: {
    color: theme.colors.muted,
  },
  commentText: {
    color: theme.colors.primaryText,
  },

  likeContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    flexShrink: 0,
    paddingLeft: theme.utils.s(20),
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
  },
  actionText: {
    color: theme.colors.muted,
  },
}));
