import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image as RNImage,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PREVIEW_HEIGHT = SCREEN_WIDTH * 0.9;

type ImageDimensions = {
  width: number;
  height: number;
};

type InteractiveImagePreviewProps = {
  imageUri: string | undefined;
};

export const InteractiveImagePreview = ({
  imageUri,
}: InteractiveImagePreviewProps) => {
  const { isLoading, panGesture, animatedStyle } = useImageGeometry(
    imageUri,
    SCREEN_WIDTH,
    PREVIEW_HEIGHT,
  );

  if (!imageUri) {
    return null;
  }

  if (isLoading) {
    return (
      <View style={[styles.viewport, styles.centered]}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View style={styles.viewport}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.imageContainer}>
          <Animated.Image
            source={{ uri: imageUri }}
            style={animatedStyle}
            resizeMode="cover"
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const useImageGeometry = (
  imageUri: string | undefined,
  viewportWidth: number,
  viewportHeight: number,
) => {
  const [isLoading, setIsLoading] = useState(true);

  const imageWidth = useSharedValue(0);
  const imageHeight = useSharedValue(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  useEffect(() => {
    if (!imageUri) return;
    setIsLoading(true);

    RNImage.getSize(
      imageUri,
      (width, height) => {
        const newDims = calculateFitDimensions(
          width,
          height,
          viewportWidth,
          viewportHeight,
        );

        imageWidth.value = newDims.width;
        imageHeight.value = newDims.height;

        translateX.value = calculateCenterPosition(
          newDims.width,
          viewportWidth,
        );
        translateY.value = calculateCenterPosition(
          newDims.height,
          viewportHeight,
        );

        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to load image size:", error);
        setIsLoading(false);
      },
    );
  }, [imageUri, viewportWidth, viewportHeight]);


  const rubberBand = (value: number, min: number, max: number) => {
    "worklet";
    const friction = 0.3;
    if (value < min) return min - (min - value) * friction;
    if (value > max) return max + (value - max) * friction;
    return value;
  };




  const panGesture = useMemo(() => {
    return Gesture.Pan().onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
      .onUpdate((event) => {
        const rawX = context.value.x + event.translationX;
        const rawY = context.value.y + event.translationY;

        const isWider = imageWidth.value > viewportWidth;
        const isTaller = imageHeight.value > viewportHeight;

        const minX = isWider ? viewportWidth - imageWidth.value : (viewportWidth - imageWidth.value) / 2;
        const maxX = isWider ? 0 : (viewportWidth - imageWidth.value) / 2;

        const minY = isTaller ? viewportHeight - imageHeight.value : (viewportHeight - imageHeight.value) / 2;
        const maxY = isTaller ? 0 : (viewportHeight - imageHeight.value) / 2;

        translateX.value = rubberBand(rawX, minX, maxX);
        translateY.value = rubberBand(rawY, minY, maxY);
      })
      .onEnd((event) => {
        const isWider = imageWidth.value > viewportWidth;
        const isTaller = imageHeight.value > viewportHeight;

        const minX = isWider ? viewportWidth - imageWidth.value : (viewportWidth - imageWidth.value) / 2;
        const maxX = isWider ? 0 : (viewportWidth - imageWidth.value) / 2;

        const minY = isTaller ? viewportHeight - imageHeight.value : (viewportHeight - imageHeight.value) / 2;
        const maxY = isTaller ? 0 : (viewportHeight - imageHeight.value) / 2;

        const springConfig = {
          damping: 20,
          stiffness: 150,
          mass: 0.6,
        };

        if (translateX.value > maxX) {
          translateX.value = withSpring(maxX, { ...springConfig, velocity: event.velocityX });
        } else if (translateX.value < minX) {
          translateX.value = withSpring(minX, { ...springConfig, velocity: event.velocityX });
        }

        if (translateY.value > maxY) {
          translateY.value = withSpring(maxY, { ...springConfig, velocity: event.velocityY });
        } else if (translateY.value < minY) {
          translateY.value = withSpring(minY, { ...springConfig, velocity: event.velocityY });
        }
      });
  }, [viewportWidth, viewportHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: imageWidth.value,
    height: imageHeight.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return {
    isLoading,
    panGesture,
    animatedStyle,
  };
};

const calculateFitDimensions = (
  originalW: number,
  originalH: number,
  viewportW: number,
  viewportH: number,
): ImageDimensions => {
  const scaleCover = Math.max(viewportW / originalW, viewportH / originalH);
  const scaleContain = Math.min(viewportW / originalW, viewportH / originalH);

  const MAX_SHRINK_LIMIT = scaleCover * 0.8;

  const finalScale = Math.max(scaleContain, MAX_SHRINK_LIMIT);

  return {
    width: originalW * finalScale,
    height: originalH * finalScale,
  };
};

const calculateCenterPosition = (
  imageSize: number,
  viewportSize: number,
): number => {
  return (viewportSize - imageSize) / 2;
};

const styles = StyleSheet.create({
  viewport: {
    width: SCREEN_WIDTH,
    height: PREVIEW_HEIGHT,
    overflow: "hidden",
    position: "relative",
  },
  imageContainer: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
