import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UIButton, UIText } from "../ui";
import { Icon } from "./Icon";


export const MOCK_COMMENTS: CommentItem[] = [
  {
    id: "c1",
    username: "kyrylo",
    commentText: "Looks serious. Hope everyone is ok.",
    timeAgo: "2m ago",
    profileImageUrl: "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
  },
  {
    id: "c2",
    username: "alex",
    commentText: "Any updates? Which street is blocked? Anything else?",
    timeAgo: "5m ago",
    profileImageUrl: "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
  },
  {
    id: "c3",
    username: "maria",
    commentText: "Thanks for sharing. Stay safe!",
    timeAgo: "12m ago",
    profileImageUrl: undefined,
  },
  {
    id: "c4",
    username: "kyrylo",
    commentText: "Looks serious. Hope everyone is ok.",
    timeAgo: "2m ago",
    profileImageUrl: "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
  },
  {
    id: "c5",
    username: "alex",
    commentText: "Any updates? Which street is blocked? Anything else?",
    timeAgo: "5m ago",
    profileImageUrl: "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
  },
  {
    id: "c6",
    username: "maria",
    commentText: "Thanks for sharing. Stay safe!",
    timeAgo: "12m ago",
    profileImageUrl: undefined,
  },
  {
    id: "c7",
    username: "kyrylo",
    commentText: "Looks serious. Hope everyone is ok.",
    timeAgo: "2m ago",
    profileImageUrl: "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
  },
  {
    id: "c8",
    username: "alex",
    commentText: "Any updates? Which street is blocked? Anything else?",
    timeAgo: "5m ago",
    profileImageUrl: "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
  },
  {
    id: "c9",
    username: "maria",
    commentText: "Thanks for sharing. Stay safe!",
    timeAgo: "12m ago",
    profileImageUrl: undefined,
  },
  {
    id: "c10",
    username: "kyrylo",
    commentText: "Looks serious. Hope everyone is ok.",
    timeAgo: "2m ago",
    profileImageUrl: "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
  },
  {
    id: "c11",
    username: "alex",
    commentText: "Any updates? Which street is blocked? Anything else?",
    timeAgo: "5m ago",
    profileImageUrl: "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
  },
];

export const MOCK_LIKE_COUNT = 12;



export type CommentItem = {
  id: string;
  username: string;
  commentText: string;
  timeAgo: string;
  profileImageUrl?: string;
};

const REPLIES_CHUNK = 8;

type CommentProps = {
  comment: CommentItem;
  isReply?: boolean;
};

export const Comment = memo(({ comment, isReply = false }: CommentProps) => {
  const iconSize = isReply ? "small" : "comment";
  const [isLoading, setIsLoading] = useState(false);

  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);
  const [totalLikeCount, setTotalLikeCount] = useState(MOCK_LIKE_COUNT);
  const toggleLikeStatus = useCallback(() => {
    setIsLikedByCurrentUser((prev) => {
      const nextStatus = !prev;
      setTotalLikeCount((currentCount) => (nextStatus ? currentCount + 1 : currentCount - 1));
      return nextStatus;
    });
  }, []);

  const handleReply = useCallback(() => {
    // TODO: Keyboard opening / user tagging logic
  }, []);

  const [visibleRepliesCount, setVisibleRepliesCount] = useState(0);

  const handleLoadMoreReplies = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    setVisibleRepliesCount((prev) => prev + REPLIES_CHUNK);
    setIsLoading(false);
  }, []);

  const handleHideReplies = useCallback(() => {
    setVisibleRepliesCount(0);
  }, []);

  const isShowingAnyReplies = visibleRepliesCount > 0;

  const totalReplies = MOCK_COMMENTS.length;
  const hasMoreReplies = visibleRepliesCount < totalReplies;

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

          {!isReply && !isShowingAnyReplies && totalReplies > 0 && (
            <UIButton onPress={handleLoadMoreReplies} style={styles.actionButton}>
              <UIText size="sm" weight="normal" style={styles.actionText}>
                ⸻ View {totalReplies} replies
              </UIText>
            </UIButton>
          )}
        </View>

        <UIButton onPress={toggleLikeStatus} style={styles.likeContainer}>
          <Ionicons
            name={isLikedByCurrentUser ? "heart" : "heart-outline"}
            size={styles.likeSize.height}
            color={isLikedByCurrentUser ? styles.likeActive.color : styles.likeInactive.color}
          />
          <UIText size="xs" weight="normal" style={styles.likeCountText}>
            {totalLikeCount}
          </UIText>
        </UIButton>
      </View>


      {isShowingAnyReplies && (
        <View style={styles.repliesContainer}>
          {MOCK_COMMENTS.slice(0, visibleRepliesCount).map((reply) => (
            <Comment key={reply.id} comment={reply} isReply={true} />
          ))}

          {isLoading ? (
            <ActivityIndicator size="small" color={styles.loading.color} />
          ) : hasMoreReplies ? (
            <UIButton onPress={handleLoadMoreReplies} style={styles.actionButton}>
              <UIText size="sm" weight="normal" style={styles.actionText}>
                ⸻ View {totalReplies - visibleRepliesCount} more replies
              </UIText>
            </UIButton>
          ) : (
            <UIButton onPress={handleHideReplies} style={styles.actionButton}>
              <UIText size="sm" weight="normal" style={styles.actionText}>
                ⸻ Hide replies
              </UIText>
            </UIButton>
          )}
        </View>
      )}
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
    height: theme.utils.s(18)
  },
  likeActive: {
    color: theme.colors.lightRed,
  },
  likeInactive: {
    color: theme.colors.icon,
  },

  repliesContainer: {
    marginLeft: theme.utils.s(46),
    paddingTop: theme.utils.vs(6),
  },

  actionButton: {
    alignSelf: 'flex-start',
    paddingVertical: theme.utils.vs(4)
  },
  actionText: {
    color: theme.colors.muted,
  },

  loading: {
    color: theme.colors.accent,
  }
}));
