import { scale, UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { memo } from "react";
import {
  StyleSheet,
  UnistylesVariants,
  useUnistyles,
} from "react-native-unistyles";


const FALLBACK_ICON_SIZES = {
  medium: scale(60),
  comment: scale(24),
  small: scale(18),
  default: scale(28),
} as const;



export type IconProps = {
  profileImageUrl?: string;
  isBroadCasting?: boolean;
  isLoading?: boolean;
} & UnistylesVariants<typeof styles>;

export const Icon = memo(
  ({
    profileImageUrl,
    size,
    isBroadCasting = false,
    isLoading = false,
  }: IconProps) => {
    const { theme } = useUnistyles();
    styles.useVariants({ size: size });

    const fallbackSize = FALLBACK_ICON_SIZES[size as keyof typeof FALLBACK_ICON_SIZES] || FALLBACK_ICON_SIZES.default;

    return (
      <UIButton style={styles.button} onPress={() => { }} isLoading={isLoading}>
        {profileImageUrl ? (
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.image}
            cachePolicy="memory-disk"
            priority="normal"
          />
        ) : (
          <Ionicons
            color={theme.colors.icon}
            size={fallbackSize}
            name="person"
          />
        )}

        {isBroadCasting ? (
          <UIText weight="bold" size="xs" style={styles.iconText}>
            LIVE
          </UIText>
        ) : null}
      </UIButton>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  button: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: 999,
    padding: theme.utils.s(2),
    borderWidth: 2,
    borderColor: theme.colors.mutedAccent,

    variants: {
      size: {
        default: {
          width: theme.utils.s(50),
          height: theme.utils.s(50),
        },
        medium: {
          height: theme.utils.s(100),
          width: theme.utils.s(100),
        },
        small: {
          height: theme.utils.s(34),
          width: theme.utils.s(34),
        },
        comment: {
          height: theme.utils.s(40),
          width: theme.utils.s(40),
        },
      },
    },
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  iconText: {
    position: "absolute",
    bottom: theme.utils.vs(-8),
    alignSelf: "center",
    color: theme.colors.white,
    backgroundColor: theme.colors.alert,
    paddingHorizontal: theme.utils.s(4),
    paddingVertical: theme.utils.vs(2),
    borderRadius: theme.utils.ms(6),
    overflow: "hidden",
    textAlign: "center",
  },
  username: {
    color: theme.colors.white,
    paddingBottom: theme.utils.vs(10),
  },
}));
