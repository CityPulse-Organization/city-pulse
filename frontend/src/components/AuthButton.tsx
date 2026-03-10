import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";
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

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Pressable
        style={styles.button}
        onPress={onPress}
        disabled={loading}
      >
        <UIText size="xl" weight="bold" style={styles.text}>
          {label}
        </UIText>
        {loading ? (
          <ActivityIndicator color={styles.icon.color} />
        ) : (
          <Ionicons name="arrow-forward" color={styles.icon.color} size={26} />
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
    variants: {
      variant: {
        default: {
          borderColor: theme.colors.darkGray,
        },
        violet: {
          borderColor: theme.colors.darkViolet,
        },
      },
    },
  },
  text: {
    variants: {
      variant: {
        default: {
          color: theme.colors.primaryTextColor,
        },
        violet: {
          color: theme.colors.violet,
        },
      },
    },
  },
  icon: {
    variants: {
      variant: {
        default: {
          color: "white",
        },
        violet: {
          color: "#C7B4FD",
        },
      },
    },
  },
}));
