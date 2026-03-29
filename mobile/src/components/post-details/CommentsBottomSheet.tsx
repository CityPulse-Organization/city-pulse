import {
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { Comment } from "../Comment";
import { UIBottomSheet, UIButton, UIDivider, UIText, UIEmptyState } from "@/src/ui";
import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "../Icon";
import { StyleSheet } from "react-native-unistyles";
import type { CommentResponse, CommentItem } from "@/src/types";

const COMMENTS_CHUNK = 20;

type CommentsBottomSheetProps = {
  profileImageUrl: string;
  commentsBottomSheetRef: React.RefObject<BottomSheetModal | null>;
  comments: CommentResponse[];
  onSendComment: (text: string) => void;
  fetchNextComments: () => void;
  hasNextCommentsPage: boolean;
  isFetchingNextComments: boolean;
};

export const CommentsBottomSheet = memo(
  ({
    profileImageUrl,
    commentsBottomSheetRef,
    comments,
    onSendComment,
    fetchNextComments,
    hasNextCommentsPage,
    isFetchingNextComments,
  }: CommentsBottomSheetProps) => {
    const [footerHeight, setFooterHeight] = useState(0);

    const renderCommentsFooter = useCallback(
      (footerProps: BottomSheetFooterProps) => (
        <CommentsFooter
          bottomSheetProps={footerProps}
          profileImageUrl={profileImageUrl}
          onHeightChange={setFooterHeight}
          onSendComment={onSendComment}
        />
      ),
      [profileImageUrl, onSendComment],
    );

    const mappedComments: CommentItem[] = useMemo(
      () =>
        comments.map((c) => ({
          id: String(c.id),
          username: String(c.userId),
          commentText: c.text,
          timeAgo: new Date(c.createdAt).toLocaleDateString(),
          profileImageUrl: undefined,
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
    const renderItem = useCallback(
      ({ item: commentData }: { item: CommentItem }) => (
        <Comment comment={commentData} />
      ),
      [],
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
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: footerHeight },
          ]}
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
          renderItem={renderItem}
        />
      </UIBottomSheet>
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
  profileImageUrl: string;
  onHeightChange: (height: number) => void;
  onSendComment: (text: string) => void;
};

const CommentsFooter = memo(
  ({
    bottomSheetProps,
    profileImageUrl,
    onHeightChange,
    onSendComment,
  }: CommentsFooterProps) => {
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
        onSendComment(commentText.trim());
      }
      setCommentText("");
    }, [commentText, onSendComment]);

    return (
      <BottomSheetFooter {...bottomSheetProps}>
        <View
          style={styles.footerContainer}
          onLayout={(e) => onHeightChange(e.nativeEvent.layout.height)}
        >
          <UIDivider height={styles.footerDivider.height} />

          <View style={styles.footerInputBar(isInputActive)}>
            <Icon profileImageUrl={profileImageUrl} size="comment" />

            <BottomSheetTextInput
              style={styles.footerInput}
              placeholder="Add a comment..."
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
    color: theme.colors.mutedAccent,
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
}));
