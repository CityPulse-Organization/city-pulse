import { ThemedBackground } from "@/src/components";
import { UIText } from "@/src/ui";
import { StyleSheet } from "react-native-unistyles";

export default function ChatScreen() {
  return (
    <ThemedBackground>
      <UIText style={styles.text}>ChatScreen</UIText>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  text: {
    color: theme.colors.white,
  },
}));
