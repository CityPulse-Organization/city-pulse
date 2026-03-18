import { ThemedBackground } from "@/src/components";
import { UIText } from "@/src/ui";
import { Link } from "expo-router";
import { StyleSheet } from "react-native-unistyles";

export default function ChatsScreen() {
  return (
    <ThemedBackground>
      <Link href="/chats/[id]" asChild>
        <UIText style={styles.text}>ChatsScreen</UIText>
      </Link>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  text: {
    color: theme.colors.white,
  },
}));
