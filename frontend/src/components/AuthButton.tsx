import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { UIText } from "../ui";

type AuthButtonProps = {
  label: string;
  onPress: () => void | Promise<void>;
  variant?: "default" | "violet";
  loading?: boolean;
};

export const AuthButton = ({
  label,
  onPress,
  variant = "violet",
  loading,
}: AuthButtonProps) => {
  const { theme } = useUnistyles();

  const isDefault = variant === "default";
  const iconColor = isDefault ? "white" : "#C7B4FD";
  const textColor = isDefault
    ? theme.colors.primaryTextColor
    : theme.colors.violet;
  const borderColor = isDefault
    ? theme.colors.darkGray
    : theme.colors.darkViolet;

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Pressable
        style={[styles.button, { borderColor }]}
        onPress={onPress}
        disabled={loading}
      >
        <UIText size="xl" weight="bold" style={{ color: textColor }}>
          {label}
        </UIText>
        {loading ? (
          <ActivityIndicator color={iconColor} />
        ) : (
          <Ionicons name="arrow-forward" color={iconColor} size={26} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  button: {
    position: "absolute",
    bottom: rt.insets.bottom + 50,
    right: 30,
    paddingVertical: 20,
    paddingHorizontal: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 50,
    backgroundColor: theme.colors.bottomSheetColor,
    borderWidth: 4,
  },
  buttonText: {
    fontWeight: "bold",
  },
}));
