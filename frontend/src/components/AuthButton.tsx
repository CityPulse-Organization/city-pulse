import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View, StyleSheet as RNStyleSheet } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";
import { LinearGradient } from "expo-linear-gradient";
import { UIText } from "../ui";

type AuthButtonProps = {
  label: string;
  onPress: () => void | Promise<void>;
  loading?: boolean;
} & UnistylesVariants<typeof styles>;

export const AuthButton = ({
  label,
  onPress,
  variant = "violet",
  loading,
}: AuthButtonProps) => {
  styles.useVariants({ variant });

  const gradientColors = variant === "violet"
    ? (["#A78BFA", "#7f2fed"] as const)
    : (["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.02)"] as const);

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        disabled={loading}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
        <UIText size="lg" weight="bold" style={styles.text}>
          {label}
        </UIText>
        {loading ? (
          <ActivityIndicator color={styles.icon.color} size="small" />
        ) : (
          <Ionicons name="arrow-forward" color={styles.icon.color} size={22} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom: rt.insets.bottom + 40,
    paddingRight: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 999,
    overflow: "hidden", // Ensures gradient respects borderRadius
    variants: {
      variant: {
        default: {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
        violet: {
          shadowColor: "#7f2fed",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        },
      },
    },
  },
  gradient: {
    ...RNStyleSheet.absoluteFillObject,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  text: {
    variants: {
      variant: {
        default: { color: theme.colors.textColor },
        violet: { color: "#FFFFFF" },
      },
    },
  },
  icon: {
    variants: {
      variant: {
        default: { color: theme.colors.iconColor },
        violet: { color: "#FFFFFF" },
      },
    },
  },
}));

