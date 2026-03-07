import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { memo } from "react";
import { View } from "react-native";

type UIDividerProps = {
  color?: string;
  height?: number;
};

export const UIDivider = memo(({ color, height }: UIDividerProps) => (
  <View style={[
    styles.divider,
    color ? { backgroundColor: color } : null,
    height ? { height: height } : null,
  ]} />
));

const styles = StyleSheet.create((theme) => ({
  divider: {
    height: 1,
    backgroundColor: theme.colors.dividerColor,
    alignSelf: "stretch",
  },
}));
