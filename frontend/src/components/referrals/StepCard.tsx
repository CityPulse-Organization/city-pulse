import { UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { GradientCard } from "../GradientCard";
import type { HowItWorksStep } from "@/src/types/referrals";

export const StepCard = memo(({ step, title, desc, icon }: HowItWorksStep) => (
  <GradientCard
    colors={[
      "rgba(168,36,224,0.25)",
      "rgba(124,77,255,0.08)",
      "rgba(168,36,224,0.02)",
    ]}
  >
    <View style={styles.row}>
      <LinearGradient
        colors={["#a824e0", "#7C4DFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bubble}
      >
        <UIText size="sm" weight="bold" style={styles.whiteTxt}>
          {step}
        </UIText>
      </LinearGradient>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Ionicons name={icon} size={14} color={styles.icon.color} />
          <UIText size="sm" weight="bold" style={styles.primaryText}>
            {title}
          </UIText>
        </View>
        <UIText size="xs" style={styles.mutedText}>
          {desc}
        </UIText>
      </View>
    </View>
  </GradientCard>
));

const styles = StyleSheet.create((theme) => ({
  icon: {
    color: theme.colors.accent,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(14),
    paddingHorizontal: theme.utils.s(14),
    paddingVertical: theme.utils.vs(14),
  },
  bubble: {
    width: theme.utils.s(34),
    height: theme.utils.s(34),
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, gap: theme.utils.vs(2) },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(6),
  },
  primaryText: { color: theme.colors.primaryText },
  mutedText: { color: theme.colors.muted },
  whiteTxt: { color: "#fff" },
}));
