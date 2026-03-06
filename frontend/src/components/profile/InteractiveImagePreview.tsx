import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image as RNImage,
    View,
} from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PREVIEW_HEIGHT = SCREEN_WIDTH * 0.75;

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
  const { isLoading, dimensions, panGesture, animatedStyle } = useImageGeometry(
    imageUri,
    SCREEN_WIDTH,
    PREVIEW_HEIGHT,
  );

  if (isLoading || !dimensions) {
    return (
      <View style={[styles.viewport, styles.centered]}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.viewport}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={styles.imageContainer}>
            <Animated.Image
              source={{ uri: imageUri }}
              style={[
                {
                  width: dimensions.width,
                  height: dimensions.height,
                },
                animatedStyle,
              ]}
              resizeMode="cover"
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const useImageGeometry = (
  imageUri: string | undefined,
  viewportWidth: number,
  viewportHeight: number,
) => {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  useEffect(() => {
    if (!imageUri) return;
    setIsLoading(true);

    RNImage.getSize(
      imageUri,
      (width, height) => {
        const newDims = calculateCoverDimensions(
          width,
          height,
          viewportWidth,
          viewportHeight,
        );

        setDimensions(newDims);

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

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      if (!dimensions) return;

      const rawX = context.value.x + event.translationX;
      const rawY = context.value.y + event.translationY;

      const minX = viewportWidth - dimensions.width;
      const minY = viewportHeight - dimensions.height;
      const maxX = 0;
      const maxY = 0;

      translateX.value = Math.min(maxX, Math.max(minX, rawX));
      translateY.value = Math.min(maxY, Math.max(minY, rawY));
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return {
    isLoading,
    dimensions,
    panGesture,
    animatedStyle,
  };
};

const calculateCoverDimensions = (
  originalW: number,
  originalH: number,
  viewportWidth: number,
  viewportHeight: number,
): ImageDimensions => {
  const scale = Math.max(viewportWidth / originalW, viewportHeight / originalH);
  return {
    width: originalW * scale,
    height: originalH * scale,
  };
};

const calculateCenterPosition = (
  imageSize: number,
  viewportSize: number,
): number => {
  return (viewportSize - imageSize) / 2;
};

const styles = StyleSheet.create({
  root: {
    flex: 0,
  },
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
