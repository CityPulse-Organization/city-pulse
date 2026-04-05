import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UIButton, UIImage, UISkeleton, UIText } from "../ui";
import { IconInfo } from "./IconInfo";
import type { PostItem } from "../types";

type PostProps = {
  data: PostItem;
  isLoading?: boolean;
  onPress: (id: string) => void;
};

export const Post = memo(({ data, isLoading = false, onPress }: PostProps) => {
  const handlePress = useCallback(() => {
    onPress(data.id);
  }, [data.id, onPress]);

  return (
    <View style={styles.itemWrapper}>
      <UISkeleton show={isLoading}>
        <UIButton onPress={handlePress} style={styles.card}>
          <UIImage
            isLoading={isLoading}
            isAspectRatio={true}
            size="masonry"
            borderRound="medium"
            imageUrl={data.imagesUrl[0]}
            style={styles.image}
          />

          <View style={styles.overlayWrapper}>
            <LinearGradient
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0.3 }}
              colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0)"]}
              style={styles.gradient}
              pointerEvents="none"
            />

            <View style={styles.topFlexWrapper}>
              {data.description && (
                <LinearGradient
                  colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0)"]}
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
                    {data.description}
                  </UIText>
                </LinearGradient>
              )}
            </View>

            <View style={styles.userInfoContainer}>
              <IconInfo
                profileImageUrl={data.profileImageUrl}
                username={data.username}
                statusText={data.accidentTime}
                iconSize="small"
                usernameSize="sm"
                mode="post"
              />
            </View>
          </View>
        </UIButton>
      </UISkeleton>
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  itemWrapper: {
    flex: 1,
    padding: theme.utils.s(4),
  },
  card: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: theme.utils.s(22),
    minHeight: theme.utils.vs(200),
  },
  image: {
    width: "100%",
    minHeight: theme.utils.vs(200),
  },

  overlayWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topFlexWrapper: {
    flex: 1,
  },
  topOverlay: {
    paddingHorizontal: theme.utils.s(14),
    paddingTop: theme.utils.s(16),
    paddingBottom: theme.utils.s(32),
  },
  overlayText: {
    color: theme.colors.white,
    textShadowColor: theme.colors.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    lineHeight: theme.utils.s(18),
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  userInfoContainer: {
    paddingHorizontal: theme.utils.s(12),
    paddingTop: theme.utils.s(8),
    paddingBottom: theme.utils.s(10),
  },
}));
