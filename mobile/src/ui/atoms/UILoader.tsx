import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

const RING_SIZE = 60;

type UILoaderProps = {
  containerStyle?: any;
  isLoading?: boolean;
};

export const UILoader = ({ containerStyle, isLoading }: UILoaderProps) => {
  const show = isLoading === undefined ? true : isLoading;

  if (!show) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(400)}
      style={[styles.loaderWrap, containerStyle]}
    >
      <PulseRing delay={0} />
      <PulseRing delay={600} />
      <PulseRing delay={1200} />
      <View style={styles.centerDot} />
    </Animated.View>
  );
};

const PulseRing = ({ delay }: { delay: number }) => {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.4, { duration: 0 }),
          withTiming(1.8, { duration: 1800, easing: Easing.out(Easing.quad) }),
        ),
        -1,
      ),
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 0 }),
          withTiming(0, { duration: 1800, easing: Easing.in(Easing.quad) }),
        ),
        -1,
      ),
    );
  }, [delay, scale, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.ring, animStyle]} />;
};

const styles = StyleSheet.create((theme) => ({
  loaderWrap: {
    width: RING_SIZE * 2,
    height: RING_SIZE * 2,
    justifyContent: "center",
    alignItems: "center",
  },
  ring: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 2,
    borderColor: "#A78BFA",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  centerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#A78BFA",
    shadowColor: "#C4B5FD",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
}));
