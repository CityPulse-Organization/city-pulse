import { StyleSheet } from "react-native-unistyles";

import { memo } from "react";
import { View } from "react-native";

export const UIDivider = memo(() => {
  return <View style={styles.divider} />;
});

const styles = StyleSheet.create((theme) => ({
  divider: {
    height: 2,
    backgroundColor: theme.colors.dividerColor,
    alignSelf: "stretch",
  },
}));
