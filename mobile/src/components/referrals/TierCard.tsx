import { UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import type { Milestone } from "@/src/types/referrals";

export const TierCard = memo(({ milestone }: { milestone: Milestone }) => {
  return (
    <LinearGradient
      colors={
        milestone.unlocked
          ? [milestone.gradient[0] + "20", milestone.gradient[1] + "08"]
          : [styles.milestone.backgroundColor, styles.milestone.backgroundColor]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.card,
        milestone.unlocked && { borderColor: milestone.gradient[0] + "40" },
      ]}
    >
      <LinearGradient
        colors={
          milestone.unlocked
            ? milestone.gradient
            : ["rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.2)"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconCircle}
      >
        <Ionicons name={milestone.icon} size={16} color="#fff" />
      </LinearGradient>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <UIText size="sm" weight="bold" style={styles.primaryText}>
            {milestone.label}
          </UIText>
          <View style={styles.countBadge}>
            <LinearGradient
              colors={
                milestone.unlocked
                  ? milestone.gradient
                  : ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.countBadgeInner}
            >
              <UIText
                size="xxs"
                weight="bold"
                style={milestone.unlocked ? styles.whiteTxt : styles.mutedText}
              >
                {milestone.count} invites
              </UIText>
            </LinearGradient>
          </View>
        </View>
        <UIText size="xs" style={styles.mutedText}>
          {milestone.reward}
        </UIText>
      </View>

      {milestone.unlocked ? (
        <LinearGradient colors={milestone.gradient} style={styles.checkCircle}>
          <Ionicons name="checkmark" size={14} color="#fff" />
        </LinearGradient>
      ) : (
        <Ionicons
          name="lock-closed"
          size={14}
          color="rgba(255, 255, 255, 0.5)"
        />
      )}
    </LinearGradient>
  );
});

const styles = StyleSheet.create((theme) => ({
  milestone: {
    backgroundColor: theme.colors.backgroundSubtle,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(12),
    paddingHorizontal: theme.utils.s(14),
    paddingVertical: theme.utils.vs(14),
    borderRadius: theme.utils.s(14),
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    overflow: "hidden",
  },
  iconCircle: {
    width: theme.utils.s(36),
    height: theme.utils.s(36),
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1, gap: theme.utils.vs(3) },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  countBadge: { borderRadius: 50, overflow: "hidden" },
  countBadgeInner: {
    paddingHorizontal: theme.utils.s(8),
    paddingVertical: theme.utils.vs(2),
  },
  checkCircle: {
    width: theme.utils.s(24),
    height: theme.utils.s(24),
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: theme.colors.primaryText },
  mutedText: { color: theme.colors.muted },
  whiteTxt: { color: "#fff" },
}));
