import { NEW_POST_IMAGE_CONFIG } from "@/src/utils/newPostImageUtils";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image as RNImage, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";


const SPRING_CONFIG = { damping: 20, stiffness: 150, mass: 0.6 };

type ImageDimensions = { width: number; height: number };


type InteractiveImagePreviewProps = { imageUri: string | undefined };

export const InteractiveImagePreview = React.memo(({ imageUri }: InteractiveImagePreviewProps) => {
  const { isLoading, panGesture, animatedStyle, staticStyle } = useImageGeometry(
    imageUri,
    NEW_POST_IMAGE_CONFIG.SCREEN_WIDTH,
    NEW_POST_IMAGE_CONFIG.IMAGE_PREVIEW_HEIGHT,
  );

  if (!imageUri) return null;

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
            style={[staticStyle, animatedStyle]}
            resizeMode="cover"
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
});



const useImageGeometry = (
  imageUri: string | undefined,
  viewportWidth: number,
  viewportHeight: number,
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageDims, setImageDims] = useState<ImageDimensions | null>(null);

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
        const newDims = calculateFitDimensions(width, height, viewportWidth, viewportHeight);
        setImageDims(newDims);

        imageWidth.value = newDims.width;
        imageHeight.value = newDims.height;
        translateX.value = calculateCenterPosition(newDims.width, viewportWidth);
        translateY.value = calculateCenterPosition(newDims.height, viewportHeight);

        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to load image size:", error);
        setIsLoading(false);
      },
    );
  }, [imageUri, viewportWidth, viewportHeight]);

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .onStart(() => {
        context.value = { x: translateX.value, y: translateY.value };
      })
      .onUpdate((event) => {
        const boundsX = calculateBoundaries(imageWidth.value, viewportWidth);
        const boundsY = calculateBoundaries(imageHeight.value, viewportHeight);

        const rawX = context.value.x + event.translationX;
        const rawY = context.value.y + event.translationY;

        translateX.value = rubberBand(rawX, boundsX.min, boundsX.max);
        translateY.value = rubberBand(rawY, boundsY.min, boundsY.max);
      })
      .onEnd((event) => {
        const boundsX = calculateBoundaries(imageWidth.value, viewportWidth);
        const boundsY = calculateBoundaries(imageHeight.value, viewportHeight);

        translateX.value = snapToBoundary(translateX.value, event.velocityX, boundsX.min, boundsX.max);
        translateY.value = snapToBoundary(translateY.value, event.velocityY, boundsY.min, boundsY.max);
      });
  }, [viewportWidth, viewportHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const staticStyle = useMemo(() => {
    if (!imageDims) return undefined;
    return { width: imageDims.width, height: imageDims.height };
  }, [imageDims]);

  return { isLoading, panGesture, animatedStyle, staticStyle };
};



const calculateFitDimensions = (originalW: number, originalH: number, viewportW: number, viewportH: number): ImageDimensions => {
  const scaleCover = Math.max(viewportW / originalW, viewportH / originalH);
  const scaleContain = Math.min(viewportW / originalW, viewportH / originalH);
  const MAX_SHRINK_LIMIT = scaleCover * 0.8;
  const finalScale = Math.max(scaleContain, MAX_SHRINK_LIMIT);

  return { width: originalW * finalScale, height: originalH * finalScale };
};

const calculateCenterPosition = (imageSize: number, viewportSize: number): number => {
  return (viewportSize - imageSize) / 2;
};



const rubberBand = (value: number, min: number, max: number) => {
  "worklet";
  const friction = 0.3;
  if (value < min) return min - (min - value) * friction;
  if (value > max) return max + (value - max) * friction;
  return value;
};


const calculateBoundaries = (imageSize: number, viewportSize: number) => {
  "worklet";
  const isLargerThanViewport = imageSize > viewportSize;
  const min = isLargerThanViewport ? viewportSize - imageSize : (viewportSize - imageSize) / 2;
  const max = isLargerThanViewport ? 0 : (viewportSize - imageSize) / 2;
  return { min, max };
};


const snapToBoundary = (currentValue: number, velocity: number, min: number, max: number) => {
  "worklet";
  if (currentValue > max) {
    return withSpring(max, { ...SPRING_CONFIG, velocity });
  }
  if (currentValue < min) {
    return withSpring(min, { ...SPRING_CONFIG, velocity });
  }
  return currentValue;
};




const styles = StyleSheet.create({
  viewport: { width: NEW_POST_IMAGE_CONFIG.SCREEN_WIDTH, height: NEW_POST_IMAGE_CONFIG.IMAGE_PREVIEW_HEIGHT, overflow: "hidden", position: "relative" },
  imageContainer: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
});