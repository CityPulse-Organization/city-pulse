import {
  IconInfo,
  MOCK_COMMENTS,
  MOCK_LIKE_COUNT,
  ThemedBackground,
} from "@/src/components";
import { BlurButton } from "@/src/components/BlurButton";
import { ImagesCarousel } from "@/src/components/post/imagesCarousel";
import { MenuOptionBottomSheet } from "@/src/components/post/MenuOptionBottomSheet";
import { usePostDetails } from "@/src/hooks/post/usePostDetails";
import { UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { memo, useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { CommentsBottomSheet } from "@/src/components/post/CommentsBottomSheet";

export default function PostDetailScreen() {
  const {
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
  } = usePostDetails();

  return (
    <ThemedBackground style={styles.page} withoutSafeArea={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        bounces={false}
      >
        <ImagesCarousel imagesUrl={imagesUrl} location={location} />

        <View style={styles.contentContainer}>
          <UserInfoRow
            profileImageUrl={profileImageUrl}
            username={username}
            accidentTime={accidentTime}
            isBroadcasting={isBroadcasting}
            openPresentCommentsSheet={openPresentCommentsSheet}
          />

          {!!description && (
            <BlurView
              intensity={10}
              tint={"dark"}
              style={styles.descriptionCard}
            >
              <UIText size="sm" style={styles.descriptionText}>
                {description}
              </UIText>
            </BlurView>
          )}
        </View>
      </ScrollView>

      <BlurButton onPress={handleBack} iconName="chevron-back" />

      <CommentsBottomSheet
        profileImageUrl={profileImageUrl}
        commentsBottomSheetRef={commentsBottomSheetRef}
      />
      <MenuOptionBottomSheet isOwnPost={isOwnPost} />
    </ThemedBackground>
  );
}

type UserInfoRowProps = {
  profileImageUrl: string;
  username: string;
  accidentTime: string;
  isBroadcasting: boolean;
  openPresentCommentsSheet: () => void;
};

const UserInfoRow = memo(
  ({
    profileImageUrl,
    username,
    accidentTime,
    isBroadcasting,
    openPresentCommentsSheet,
  }: UserInfoRowProps) => {
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);
    const [totalLikeCount, setTotalLikeCount] = useState(MOCK_LIKE_COUNT);

    const toggleLikeStatus = useCallback(() => {
      setIsLikedByCurrentUser((prev) => {
        const nextStatus = !prev;
        setTotalLikeCount((currentCount) =>
          nextStatus ? currentCount + 1 : currentCount - 1,
        );
        return nextStatus;
      });
    }, []);

    const [isSavedByCurrentUser, setIsSavedByCurrentUser] = useState(false);
    const toggleSaveStatus = useCallback(() => {
      setIsSavedByCurrentUser((prev) => !prev);
    }, []);

    return (
      <View style={styles.userInfoRow}>
        <IconInfo
          profileImageUrl={profileImageUrl}
          username={username}
          statusText={accidentTime}
          isBroadCasting={isBroadcasting}
          usernameWeight="bold"
        />

        <View style={styles.actionsRow}>
          <UIButton onPress={toggleLikeStatus} style={styles.actionPost}>
            <Ionicons
              name={isLikedByCurrentUser ? "heart" : "heart-outline"}
              size={styles.likeIcon.height}
              color={
                isLikedByCurrentUser
                  ? styles.likeIconActive.color
                  : styles.likeIcon.color
              }
            />
            <UIText weight="normal" style={styles.actionCount}>
              {totalLikeCount}
            </UIText>
          </UIButton>

          <UIButton
            onPress={openPresentCommentsSheet}
            style={styles.actionPost}
          >
            <Ionicons
              name="chatbubble-outline"
              size={styles.commentIcon.height}
              color={styles.commentIcon.color}
            />
            <UIText style={styles.actionCount}>{MOCK_COMMENTS.length}</UIText>
          </UIButton>

          <UIButton onPress={toggleSaveStatus} style={styles.actionPost}>
            <Ionicons
              name={isSavedByCurrentUser ? "bookmark" : "bookmark-outline"}
              size={styles.saveIcon.height}
              color={
                isSavedByCurrentUser
                  ? styles.saveIconActive.color
                  : styles.saveIcon.color
              }
            />
          </UIButton>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create((theme, rt) => ({
  page: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: rt.insets.bottom + theme.utils.s(10),
  },

  contentContainer: {
    paddingHorizontal: theme.utils.s(20),
    marginTop: theme.utils.vs(10),
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.utils.vs(20),
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(16),
  },
  actionPost: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(6),
  },
  actionCount: {
    color: theme.colors.muted,
    fontSize: theme.utils.ms(14),
  },

  likeIcon: {
    height: theme.utils.s(20),
    color: theme.colors.icon,
  },
  likeIconActive: {
    color: theme.colors.lightRed,
  },
  commentIcon: {
    height: theme.utils.s(20),
    color: theme.colors.icon,
  },
  saveIcon: {
    height: theme.utils.s(20),
    color: theme.colors.icon,
  },
  saveIconActive: {
    color: theme.colors.mutedAccent,
  },

  descriptionCard: {
    backgroundColor: theme.colors.backgroundOverlay,
    padding: theme.utils.s(20),
    borderRadius: theme.utils.ms(22),
    borderWidth: 1,
    borderColor: theme.colors.mutedAccent,
    marginBottom: theme.utils.vs(32),
    opacity: 0.9,
  },
  descriptionText: {
    color: theme.colors.primaryText,
    lineHeight: theme.utils.ms(22),
  },
}));
