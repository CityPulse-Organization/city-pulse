import { UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { GradientCard } from "./GradientCard";

type PerkCardProps = {
  icon: string;
  title: string;
  desc: string;
};

export const PerkCard = memo(({ icon, title, desc }: PerkCardProps) => (
  <GradientCard
    colors={[
      "rgba(168,36,224,0.20)",
      "rgba(124,77,255,0.05)",
      "rgba(168,36,224,0.02)",
    ]}
    style={styles.outer}
  >
    <View style={styles.content}>
      <LinearGradient
        colors={["rgba(168,36,224,0.25)", "rgba(124,77,255,0.08)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconBg}
      >
        <Ionicons name={icon as any} size={18} color={styles.icon.color} />
      </LinearGradient>
      <UIText size="xs" weight="bold" style={styles.primaryText}>
        {title}
      </UIText>
      <UIText size="xxs" style={styles.mutedText} numberOfLines={2}>
        {desc}
      </UIText>
    </View>
  </GradientCard>
));

const styles = StyleSheet.create((theme) => ({
  outer: { width: "47%" },
  content: {
    paddingHorizontal: theme.utils.s(14),
    paddingVertical: theme.utils.vs(14),
    gap: theme.utils.vs(6),
  },
  iconBg: {
    width: theme.utils.s(36),
    height: theme.utils.s(36),
    borderRadius: theme.utils.s(10),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.utils.vs(2),
  },
  primaryText: { color: theme.colors.primaryText },
  mutedText: { color: theme.colors.muted },
  icon: {
    color: theme.colors.accent,
  },
}));
