import React, { memo } from "react";
import { View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { Ionicons } from "@expo/vector-icons";
import { UIText } from "./UIText";
import { LinearGradient } from "expo-linear-gradient";

type UIEmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  description?: string;
};

const GRADIENT_COLORS = [
  "rgba(168,36,224,0.15)",
  "rgba(124,77,255,0.1)",
  "rgba(206,147,216,0.05)",
] as const;

export const UIEmptyState = memo(
  ({
    icon = "information-circle-outline",
    title = "No data found",
    description = "There are no items to display right now.",
  }: UIEmptyStateProps) => {
    const theme = UnistylesRuntime.getTheme();

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconWrapper}
        >
          <Ionicons
            name={icon}
            size={theme.utils.s(48)}
            color={theme.colors.accent}
          />
        </LinearGradient>

        <UIText size="lg" weight="bold" style={styles.title}>
          {title}
        </UIText>

        <UIText size="md" weight="normal" style={styles.description}>
          {description}
        </UIText>
      </View>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: theme.utils.vs(120),
    paddingHorizontal: theme.utils.s(40),
  },
  iconWrapper: {
    width: theme.utils.s(100),
    height: theme.utils.s(100),
    borderRadius: theme.utils.ms(50),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.utils.vs(24),
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  title: {
    color: theme.colors.primaryText,
    marginBottom: theme.utils.vs(12),
    textAlign: "center",
  },
  description: {
    color: theme.colors.muted,
    textAlign: "center",
    lineHeight: theme.utils.vs(22),
    maxWidth: "80%",
  },
}));
