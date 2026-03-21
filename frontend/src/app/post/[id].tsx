import {
  IconInfo,
  MOCK_COMMENTS,
  MOCK_LIKE_COUNT,
  ThemedBackground,
} from "@/src/components";
import { BlurButton } from "@/src/components/BlurButton";
import { ImagesCarousel } from "@/src/components/post/imagesCarousel";
import { MenuOptionBottomSheet } from "@/src/components/post/MenuOptionBottomSheet";
import { GradientCard } from "@/src/components/referrals";
import { usePostDetails } from "@/src/hooks/post/usePostDetails";
import { UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
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
    <ThemedBackground style={styles.page}>
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
            <GradientCard
              colors={[
                "rgba(168,36,224,0.45)",
                "rgba(124,77,255,0.20)",
                "rgba(206,147,216,0.10)",
              ]}
              style={styles.descriptionCardOuter}
            >
              <View style={styles.descriptionCardInner}>
                <UIText size="sm" style={styles.descriptionText}>
                  {description}
                </UIText>
              </View>
            </GradientCard>
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
            <GradientIconBox
              isActive={isLikedByCurrentUser}
              iconName={isLikedByCurrentUser ? "heart" : "heart-outline"}
              iconColor={isLikedByCurrentUser ? styles.likeIconActive.color : styles.likeIcon.color}
            />

            <UIText weight="normal" size="sm" style={
              isLikedByCurrentUser ? styles.actionCountActive : styles.actionCount
            }>
              {totalLikeCount}
            </UIText>
          </UIButton>

          <UIButton onPress={openPresentCommentsSheet} style={styles.actionPost}>
            <GradientIconBox
              isActive={false}
              iconName="chatbubble-outline"
              iconColor={styles.commentIcon.color}
            />

            <UIText weight="normal" size="sm" style={styles.actionCount}>{MOCK_COMMENTS.length}</UIText>
          </UIButton>

          <UIButton onPress={toggleSaveStatus} style={styles.actionPost}>
            <GradientIconBox
              isActive={isSavedByCurrentUser}
              iconName={isSavedByCurrentUser ? "bookmark" : "bookmark-outline"}
              iconColor={isSavedByCurrentUser ? styles.saveIconActive.color : styles.saveIcon.color}
            />
          </UIButton>
        </View>
      </View>
    );
  },
);

const GradientIconBox = memo(({
  isActive,
  iconName,
  iconColor
}: {
  isActive: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}) => {
  return (
    <LinearGradient
      colors={isActive
        ? [styles.activeGradientActionIconStop0.backgroundColor, styles.activeGradientActionIconStop1.backgroundColor]
        : [styles.inactiveGradientActionIconStop0.backgroundColor, styles.inactiveGradientActionIconStop1.backgroundColor]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.actionIconGrad}
    >
      <Ionicons
        name={iconName}
        size={styles.actionIcon.height}
        color={iconColor}
      />
    </LinearGradient>
  );
});


const styles = StyleSheet.create((theme, rt) => ({
  page: {
    flex: 1,
    paddingTop: 0,
  },
  contentContainerStyle: {
    paddingBottom: rt.insets.bottom + theme.utils.s(10),
  },

  contentContainer: {
    paddingHorizontal: theme.utils.s(16),
    marginTop: theme.utils.vs(20),
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
    gap: theme.utils.s(6),
  },
  actionPost: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(6),
  },

  actionCount: {
    color: theme.colors.muted,
  },
  actionCountActive: {
    color: theme.colors.accent,
  },

  likeIcon: {
    color: theme.colors.icon,
  },
  likeIconActive: {
    color: theme.colors.burgundy,
  },
  commentIcon: {
    color: theme.colors.icon,
  },
  saveIcon: {
    color: theme.colors.icon,
  },
  saveIconActive: {
    color: theme.colors.white,
  },

  activeGradientActionIconStop0: {
    backgroundColor: theme.colors.activeGradientIcon[0],
  },
  activeGradientActionIconStop1: {
    backgroundColor: theme.colors.activeGradientIcon[1],
  },

  inactiveGradientActionIconStop0: {
    backgroundColor: theme.colors.inactiveGradientIcon[0],
  },
  inactiveGradientActionIconStop1: {
    backgroundColor: theme.colors.inactiveGradientIcon[1],
  },

  actionIcon: {
    height: theme.utils.s(18),
  },

  actionIconGrad: {
    width: theme.utils.s(32),
    height: theme.utils.s(32),
    borderRadius: theme.utils.s(16),
    alignItems: "center",
    justifyContent: "center",
  },

  descriptionCardOuter: {
    marginBottom: theme.utils.vs(32),
  },
  descriptionCardInner: {
    backgroundColor: theme.colors.backgroundOverlay,

    paddingHorizontal: theme.utils.s(16),
    paddingTop: theme.utils.vs(16),
    paddingBottom: theme.utils.vs(20),
  },
  descriptionText: {
    color: theme.colors.primaryText,
    lineHeight: theme.utils.ms(22),
    letterSpacing: 0.5,
  },
}));
