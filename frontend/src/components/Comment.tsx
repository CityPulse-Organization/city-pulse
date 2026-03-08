import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MOCK_LIKE_COUNT } from "../app/post/[id]";
import { UIButton, UIText } from "../ui";
import { Icon } from "./Icon";

export type CommentItem = {
  id: string;
  username: string;
  commentText: string;
  timeAgo: string;
  profileImageUrl?: string;
};

export const Comment = ({ comment }: { comment: CommentItem }) => {
  const { theme } = useUnistyles();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(MOCK_LIKE_COUNT);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };
  // TODO: "REPLY" button must be added!
  return (
    <View style={styles.container}>
      <Icon
        profileImageUrl={comment.profileImageUrl}
        size="comment"
        borderColor="faint"
      />

      <View style={styles.commentRow}>
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
        </View>

        <UIButton onPress={handleLike} style={styles.action}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={styles.heartIcon.width}
            color={liked ? theme.colors.lightRed : theme.colors.iconColor}
          />
          <UIText size="xs" weight="normal" style={styles.actionCount}>
            {likeCount}
          </UIText>
        </UIButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  heartIcon: {
    width: theme.utils.s(18),
  },
  container: {
    flexDirection: "row",
    gap: theme.utils.s(10),
  },
  commentRow: {
    flexDirection: "row",
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.commentDividerColor,
    paddingBottom: theme.utils.s(16),
    marginBottom: theme.utils.s(12),
  },
  commentBody: {
    flex: 1,
    flexDirection: "column",
    gap: theme.utils.s(4),
  },
  commentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(8),
  },
  username: {
    color: theme.colors.commentTextColor,
  },
  commentTime: {
    color: theme.colors.commentTimeTextColor,
  },
  commentText: {
    color: theme.colors.commentTextColor,
  },

  action: {
    flexDirection: "column",
    alignItems: "center",
    gap: theme.utils.s(2),
  },
  actionCount: {
    color: theme.colors.faintColor,
    fontSize: theme.utils.s(14),
  },
}));
