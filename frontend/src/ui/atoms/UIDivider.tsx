import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { memo } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

type UIDividerProps = {
  color?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export const UIDivider = memo(({ color, height, style }: UIDividerProps) => (
  <View style={[
    styles.divider,
    color ? { backgroundColor: color } : null,
    height ? { height: height } : null,
    style
  ]} />
));

const styles = StyleSheet.create((theme) => ({
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    alignSelf: "stretch",
  },
}));
