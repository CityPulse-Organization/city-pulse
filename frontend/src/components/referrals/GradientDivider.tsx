import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { StyleSheet } from "react-native-unistyles";

export const GradientDivider = memo(() => (
  <LinearGradient
    colors={[
      "rgba(168,36,224,0)",
      "rgba(168,36,224,0.3)",
      "rgba(124,77,255,0.3)",
      "rgba(168,36,224,0)",
    ]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.divider}
  />
));

const styles = StyleSheet.create((theme) => ({
  divider: {
    height: 1,
    marginVertical: theme.utils.vs(20),
  },
}));
