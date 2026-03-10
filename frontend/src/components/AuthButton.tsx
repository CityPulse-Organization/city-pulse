import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { UIText } from "../ui";

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "default" | "violet";
};

export const AuthButton = ({
  label,
  onPress,
  variant = "violet",
}: AuthButtonProps) => {
  const { theme } = useUnistyles();

  const isDefault = variant === "default";
  const iconColor = isDefault ? "white" : "#C7B4FD";
  const textColor = isDefault
    ? theme.colors.primaryText
    : theme.colors.violet;
  const borderColor = isDefault
    ? theme.colors.darkGray
    : theme.colors.mutedAccent;

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Pressable style={[styles.button, { borderColor }]} onPress={onPress}>
        <UIText size="xl" weight="bold" style={{ color: textColor }}>
          {label}
        </UIText>
        <Ionicons name="arrow-forward" color={iconColor} size={26} />
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
