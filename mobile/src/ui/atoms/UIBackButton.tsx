import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

export const UIBackButton = () => {
  const theme = UnistylesRuntime.getTheme();
  return (
    <Pressable style={styles.backButton} onPress={router.back}>
      <Ionicons
        name="chevron-back"
        size={24}
        color={theme.colors.primaryText}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  backButton: {
    zIndex: 1,
    width: theme.utils.s(40),
    height: theme.utils.s(40),
    justifyContent: "center",
    alignItems: "center",
  },
}));
