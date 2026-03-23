import { UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const AVATAR_GRADIENTS: [string, string][] = [
  ["#a824e0", "#7C4DFF"],
  ["#E040FB", "#7C4DFF"],
  ["#CE93D8", "#a824e0"],
  ["#7C4DFF", "#E040FB"],
];

type ReferralRowProps = {
  username: string;
  joinedAt: string;
  index: number;
};

export const ReferralRow = memo(({ username, joinedAt, index }: ReferralRowProps) => {
  const grad = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <View style={styles.row}>
      <LinearGradient
        colors={grad}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatar}
      >
        <UIText size="sm" weight="bold" style={styles.avatarText}>
          {username[0].toUpperCase()}
        </UIText>
      </LinearGradient>
      <View style={styles.info}>
        <UIText size="sm" weight="bold" style={styles.primaryText}>
          @{username}
        </UIText>
        <UIText size="xxs" style={styles.mutedText}>
          Joined {joinedAt}
        </UIText>
      </View>
      <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.check}>
        <Ionicons name="checkmark" size={12} color="#fff" />
      </LinearGradient>
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(12),
    paddingHorizontal: theme.utils.s(14),
    paddingVertical: theme.utils.vs(12),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  avatar: {
    width: theme.utils.s(34),
    height: theme.utils.s(34),
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff" },
  info: { flex: 1, gap: theme.utils.vs(1) },
  check: {
    width: theme.utils.s(22),
    height: theme.utils.s(22),
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: theme.colors.primaryText },
  mutedText: { color: theme.colors.muted },
}));
