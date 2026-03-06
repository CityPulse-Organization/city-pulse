import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UIButton, UIImage, UIText } from "../ui";

export type PostItem = {
  id: string;
  username: string;
  accidentTime: string;
  imageUrl: string;
  description?: string;
  profileImageUrl?: string;
  isBroadcasting?: boolean;
};

export type PostOptionItem = {
  id: string;
  title: string;
  iconName: string;
  color?: string;
  onClick: () => void;
};

type PostProps = {
  username: string;
  imageUrl: string;
  description?: string;
  profileImageUrl?: string;
  accidentTime?: string;
  isLoading?: boolean;
  onPress: () => void;
};

export const Post = memo(
  ({
    username,
    imageUrl,
    description,
    profileImageUrl,
    accidentTime,
    isLoading = false,
    onPress,
  }: PostProps) => {
    return (
      <View style={styles.itemWrapper}>
        <UIButton onPress={onPress} style={styles.card}>
          <UIImage
            isLoading={isLoading}
            isAspectRatio={true}
            size="masonry"
            borderRound="medium"
            imageUrl={imageUrl}
            style={styles.image}
          />

          <View style={styles.overlayWrapper}>
            <View style={styles.topFlexWrapper}>
              {description && (
                <LinearGradient
                  colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0)"]}
                  style={styles.topOverlay}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  <UIText
                    size="sm"
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    style={styles.overlayText}
                  >
                    {description}
                  </UIText>
                </LinearGradient>
              )}
            </View>

            <View style={styles.bottomOverlayContainer}>
              <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
                <View style={styles.userInfoRow}>
                  {profileImageUrl && (
                    <UIImage
                      imageUrl={profileImageUrl}
                      style={styles.avatar}
                      size="small"
                    />
                  )}
                  <View style={styles.infoCol}>
                    <UIText size="md" style={styles.usernameText}>
                      {username}
                    </UIText>
                    {accidentTime && (
                      <UIText size="xs" style={styles.timeText}>
                        {accidentTime}
                      </UIText>
                    )}
                  </View>
                </View>
              </BlurView>
            </View>
          </View>
        </UIButton>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.imageUrl === nextProps.imageUrl &&
      prevProps.profileImageUrl === nextProps.profileImageUrl &&
      prevProps.description === nextProps.description &&
      prevProps.username === nextProps.username &&
      prevProps.accidentTime === nextProps.accidentTime
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  itemWrapper: { flex: 1, padding: theme.utils.s(12) / 2, minWidth: 0 },
  card: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: theme.utils.s(22),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    minHeight: theme.utils.s(180),
  },
  image: {
    width: "100%",
    minHeight: theme.utils.s(180),
  },
  overlayWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topFlexWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  topOverlay: {
    paddingHorizontal: theme.utils.s(14),
    paddingTop: theme.utils.s(16),
    paddingBottom: theme.utils.s(32),
  },
  bottomOverlayContainer: {
    borderBottomLeftRadius: theme.utils.ms(22),
    borderBottomRightRadius: theme.utils.ms(22),
    overflow: "hidden",
  },
  blurContainer: {
    paddingHorizontal: theme.utils.s(12),
    paddingVertical: theme.utils.s(2),
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(10),
  },
  avatar: {
    width: theme.utils.s(28),
    height: theme.utils.s(28),
    borderRadius: theme.utils.s(14),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  infoCol: {
    flex: 1,
    justifyContent: "center",
  },
  usernameText: {
    color: "#fff",
    fontWeight: "600",
  },
  timeText: {
    color: "rgba(255,255,255,0.7)",
    marginTop: theme.utils.s(2),
  },
  overlayText: {
    color: "#fff",
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: theme.utils.s(18),
  },
}));
