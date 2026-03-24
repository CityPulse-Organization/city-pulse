import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type GradientCardProps = {
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  style?: any;
};

export const GradientCard = memo(
  ({
    children,
    colors = ["rgba(168,36,224,0.4)", "rgba(124,77,255,0.15)", "rgba(168,36,224,0.05)"],
    style,
  }: GradientCardProps) => (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.border, style]}
    >
      <View style={styles.inner}>{children}</View>
    </LinearGradient>
  ),
);

const styles = StyleSheet.create((theme) => ({
  border: {
    borderRadius: theme.utils.s(16),
    padding: 1.5,
  },
  inner: {
    borderRadius: theme.utils.s(15),
    backgroundColor: theme.colors.background,
    overflow: "hidden",
  },
}));
