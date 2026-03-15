import { memo } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";

type UISkeletonProps = {
  style?: StyleProp<ViewStyle>;
} & UnistylesVariants<typeof styles>;

export const UISkeleton = memo(({ style }: UISkeletonProps) => {
  return <View style={[styles.skeleton, style]} />;
});

const styles = StyleSheet.create((theme, rt) => ({
  skeleton: {
    backgroundColor: theme.colors.dividerColor || "rgba(0,0,0,0.1)",
    variants: {
      size: {
        default: { width: theme.utils.s(40), height: theme.utils.s(40) },
        liveIcon: {
          width: theme.utils.s(50),
          height: theme.utils.s(50),
        },
        masonry: {
          width: "100%",
          height: theme.utils.vs(150),
        },
        small: {
          width: rt.screen.width - theme.utils.s(170),
          height: theme.utils.vs(120),
        },
        medium: {
          width: rt.screen.width - theme.utils.s(120),
          height: theme.utils.vs(150),
        },
        large: {
          width: rt.screen.width - theme.utils.s(70),
          height: theme.utils.vs(170),
        },
        full: {
          width: rt.screen.width,
          height: rt.screen.height,
        },
        post: {
          width: "100%",
          height: theme.utils.vs(200),
        },
      },
      borderRound: {
        default: { borderRadius: 0 },
        small: { borderRadius: theme.utils.ms(4) },
        medium: { borderRadius: theme.utils.ms(8) },
        large: { borderRadius: theme.utils.ms(16) },
        full: { borderRadius: 999 },
      },
    },
  },
}));
