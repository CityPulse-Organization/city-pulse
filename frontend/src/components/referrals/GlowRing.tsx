import { UIText } from "@/src/ui";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import type { GlowAnimations, Milestone } from "@/src/types/referrals";

type GlowRingProps = {
  current: number;
  total: number;
  progress: number;
  remaining: number;
  milestones: Milestone[];
  animations: GlowAnimations;
};

const RING_SIZE = 120;

const PulseRing = memo(({ delay }: { delay: number }) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.5, { duration: 0 }),
          withTiming(2, { duration: 2400, easing: Easing.out(Easing.quad) }),
        ),
        -1,
      ),
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 0 }),
          withTiming(0, { duration: 2400, easing: Easing.in(Easing.quad) }),
        ),
        -1,
      ),
    );
  }, [delay, scale, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.pulseRing, animStyle]} />;
});

export const GlowRing = memo(
  ({
    current,
    total,
    progress,
    remaining,
    milestones,
    animations,
  }: GlowRingProps) => {
    const { ringPulse } = animations;

    const ringStyle = useAnimatedStyle(() => ({
      transform: [{ scale: ringPulse.value }],
    }));

    return (
      <View style={styles.container}>
        <PulseRing delay={0} />
        <PulseRing delay={800} />
        <PulseRing delay={1600} />

        <Animated.View style={ringStyle}>
          <LinearGradient
            colors={["#a824e0", "#9C27B0", "#7C4DFF", "#E040FB", "#a824e0"]}
            locations={[0, 0.25, 0.5, 0.75, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ringOuter}
          >
            <View style={styles.ringCenter}>
              <UIText size="extraLarge" weight="bold" style={styles.ringNumber}>
                {current}
              </UIText>
              <UIText style={styles.ringOf}>of {total}</UIText>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.progressTrack}>
          <LinearGradient
            colors={["#a824e0", "#7C4DFF", "#E040FB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
          {milestones.map((m) => (
            <View
              key={m.id}
              style={[
                styles.progressDot,
                { left: `${(m.count / total) * 100}%` },
              ]}
            >
              <LinearGradient
                colors={
                  m.unlocked
                    ? m.gradient
                    : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
                }
                style={styles.progressDotInner}
              />
            </View>
          ))}
        </View>

        <UIText size="sm" style={styles.subtitle}>
          {remaining > 0
            ? `${remaining} more invite${remaining === 1 ? "" : "s"} to go`
            : "🎉 Premium unlocked!"}
        </UIText>
      </View>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    marginVertical: theme.utils.vs(14),
    overflow: "visible",
    gap: theme.utils.vs(40),
  },
  pulseRing: {
    position: "absolute",
    width: theme.utils.s(RING_SIZE),
    height: theme.utils.vs(RING_SIZE),
    borderRadius: RING_SIZE / 2,
    borderWidth: 2,
    borderColor: "#a824e0",
    shadowColor: "#7C4DFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  ringOuter: {
    width: theme.utils.s(120),
    height: theme.utils.vs(120),
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    width: theme.utils.s(98),
    height: theme.utils.vs(98),
    borderRadius: 999,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  ringNumber: {
    color: theme.colors.accent,
  },
  ringOf: { color: theme.colors.muted },
  progressTrack: {
    width: "85%",
    height: theme.utils.vs(6),
    backgroundColor: theme.colors.backgroundSubtle,
    borderRadius: 999,
    marginTop: theme.utils.vs(18),
    marginBottom: theme.utils.vs(6),
    overflow: "visible",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressDot: {
    position: "absolute",
    top: -theme.utils.vs(3),
    marginLeft: -theme.utils.s(6),
    width: theme.utils.s(12),
    height: theme.utils.s(12),
    borderRadius: 999,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  progressDotInner: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  subtitle: {
    color: theme.colors.muted,
    marginTop: theme.utils.vs(10),
    textAlign: "center",
  },
}));
