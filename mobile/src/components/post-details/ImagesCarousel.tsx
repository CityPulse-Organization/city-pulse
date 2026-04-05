import { UIButton, UIImage, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback } from "react";
import { View, Dimensions } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Carousel, {
  TAnimationStyle,
  Pagination,
} from "react-native-reanimated-carousel";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  Extrapolation,
} from "react-native-reanimated";
import ImageView from "react-native-image-viewing";
import { BlurView } from "expo-blur";
import { BlurButton } from "../BlurButton";
import { useImageCarousel } from "@/src/hooks/post/useImageCarousel";

const PAGE_WIDTH = Dimensions.get("window").width;

export const ImagesCarousel = memo(
  ({ imagesUrl, location }: { imagesUrl: string[]; location: string }) => {
    const {
      visible,
      currentIndex,
      carouselRef,
      progress,
      formattedImages,
      paginationData,
      onPressPagination,
      onPressImage,
      onPressClose,
      handleCloseGallery,
      onSnapToItem,
    } = useImageCarousel(imagesUrl);

    const renderCarouselSlide = useCallback(
      ({
        item: imageUrl,
        index,
        animationValue,
      }: {
        item: string;
        index: number;
        animationValue: any;
      }) => {
        return (
          <CarouselSlideItem
            key={index}
            imageUrl={imageUrl}
            index={index}
            animationValue={animationValue}
            onPressImage={onPressImage}
          />
        );
      },
      [onPressImage],
    );

    const animationStyle: TAnimationStyle = React.useCallback(
      (value: number) => {
        "worklet";

        const zIndex = interpolate(
          value,
          value > 0 ? [0, 1] : [-1, 0],
          value > 0 ? [10, 20] : [-10, 0],
          Extrapolation.CLAMP,
        );
        const translateX = interpolate(
          value,
          [-2, 0, 1],
          [-PAGE_WIDTH * 0.5, 0, PAGE_WIDTH],
        );

        return {
          transform: [{ translateX }],
          zIndex,
        };
      },
      [PAGE_WIDTH],
    );

    const renderHeader = useCallback(
      ({ imageIndex }: { imageIndex: number }) => (
        <View style={styles.fullScreenHeader}>
          <BlurButton
            iconName="close"
            onPress={() => onPressClose(imageIndex)}
          />
        </View>
      ),
      [onPressClose],
    );

    const renderFooter = useCallback(
      ({ imageIndex }: { imageIndex: number }) => {
        if (imagesUrl.length <= 1) return null;
        return (
          <View style={styles.fullScreenFooter}>
            <BlurView intensity={80} tint="dark" style={styles.fullScreenPill}>
              <UIText size="md" weight="bold" style={styles.fullScreenText}>
                {imageIndex + 1} / {imagesUrl.length}
              </UIText>
            </BlurView>
          </View>
        );
      },
      [imagesUrl.length],
    );

    return (
      <View style={styles.imageContainer}>
        <Carousel
          ref={carouselRef}
          data={imagesUrl}
          onProgressChange={progress}
          onSnapToItem={onSnapToItem}
          loop={false}
          width={PAGE_WIDTH}
          scrollAnimationDuration={1200}
          customAnimation={animationStyle}
          renderItem={renderCarouselSlide}
          windowSize={3}
        />

        {imagesUrl.length > 1 && (
          <Pagination.Basic<{ color: string }>
            progress={progress}
            data={paginationData}
            dotStyle={styles.dot}
            activeDotStyle={styles.dotActive}
            containerStyle={styles.carouselFooter}
            horizontal
            onPress={onPressPagination}
          />
        )}

        <LinearGradient
          colors={[
            styles.gradientStop0.backgroundColor,
            styles.gradientStop1.backgroundColor,
            styles.gradientStop2.backgroundColor,
          ]}
          locations={[0, 0.5, 1]}
          style={styles.gradient}
          pointerEvents="none"
        />

        {location ? (
          <View style={styles.locationContainer} pointerEvents="none">
            <Ionicons
              name="location-outline"
              size={styles.locationIcon.height}
              color={styles.locationIcon.color}
            />
            <UIText size="sm" style={styles.locationText}>
              {location}
            </UIText>
          </View>
        ) : null}

        <ImageView
          images={formattedImages}
          imageIndex={currentIndex}
          visible={visible}
          HeaderComponent={renderHeader}
          FooterComponent={renderFooter}
          onRequestClose={handleCloseGallery}
        />
      </View>
    );
  },
);

const CarouselSlideItem = memo(
  ({ imageUrl, index, animationValue, onPressImage }: any) => {
    const handlePress = useCallback(() => {
      onPressImage(index);
    }, [index, onPressImage]);

    return (
      <CustomItem animationValue={animationValue}>
        <UIButton onPress={handlePress} style={styles.carouselSlide}>
          <UIImage imageUrl={imageUrl} style={styles.headerImage} />
        </UIButton>
      </CustomItem>
    );
  },
);

type CustomItemProps = {
  animationValue: SharedValue<number>;
  children?: React.ReactNode;
};

const CustomItem: React.FC<CustomItemProps> = ({
  animationValue,
  children,
}) => {
  const maskStyle = useAnimatedStyle(
    () => {
      const backgroundColor = interpolateColor(
        animationValue.value,
        [-1, 0, 1],
        ["#000000dd", "transparent", "#000000dd"],
      );

      return {
        backgroundColor,
      };
    },
    [animationValue],
  );

  return (
    <View style={styles.customItemWrapper}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[styles.animatedMask, maskStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  imageContainer: {
    width: "100%",
    height: theme.utils.vs(440),
    position: "relative",
  },
  carouselSlide: {
    width: rt.screen.width,
    height: theme.utils.vs(440),
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientStop0: { backgroundColor: theme.colors.gradientOverlay[0] },
  gradientStop1: { backgroundColor: theme.colors.gradientOverlay[1] },
  gradientStop2: { backgroundColor: theme.colors.gradientOverlay[2] },

  customItemWrapper: { flex: 1 },
  animatedMask: { ...StyleSheet.absoluteFillObject },

  locationContainer: {
    position: "absolute",
    bottom: theme.utils.vs(20),
    left: theme.utils.s(16),
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(6),
    borderWidth: 1,
    backgroundColor: theme.colors.backgroundOverlay,
    borderColor: theme.colors.darkAccent,
    borderRadius: 999,
    paddingHorizontal: theme.utils.s(12),
    paddingVertical: theme.utils.vs(6),
  },
  locationIcon: {
    height: theme.utils.s(14),
    color: theme.colors.accent,
  },
  locationText: {
    color: theme.colors.accent,
  },

  carouselFooter: {
    gap: theme.utils.s(8),
  },
  dot: {
    borderRadius: 100,
    backgroundColor: theme.colors.muted,
    width: theme.utils.s(10),
    height: theme.utils.s(10),
  },
  dotActive: {
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: theme.colors.darkAccent,
  },

  fullScreenHeader: {
    paddingHorizontal: theme.utils.s(16),
    paddingTop: Math.max(rt.insets.top + theme.utils.vs(6), theme.utils.vs(30)),
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "static",
  },
  fullScreenFooter: {
    paddingHorizontal: theme.utils.s(16),
    paddingTop: theme.utils.vs(10),
    paddingBottom: Math.max(
      rt.insets.bottom + theme.utils.vs(10),
      theme.utils.vs(30),
    ),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  fullScreenPill: {
    paddingHorizontal: theme.utils.s(16),
    paddingVertical: theme.utils.vs(8),
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: theme.colors.backgroundSubtle,
    borderWidth: 0.5,
    borderColor: theme.colors.muted,
  },
  fullScreenText: {
    color: theme.colors.primaryText,
    letterSpacing: 1,
  },
}));
