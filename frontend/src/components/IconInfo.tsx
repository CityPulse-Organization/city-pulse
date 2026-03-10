import { memo } from "react";
import { View } from "react-native";
import { StyleSheet, UnistylesVariants, useUnistyles } from "react-native-unistyles";
import { UIText } from "../ui";
import { Icon } from "./Icon";

export type IconInfoProps = {
  profileImageUrl?: string | undefined;
  isBroadCasting?: boolean;
  isLoading?: boolean;
  username: string;
  usernameSize?: "sm";
  usernameWeight?: "bold";
  statusText?: string;
  iconSize?: "small" | "medium" | "comment";
  onPress?: () => void;
} & UnistylesVariants<typeof styles>;;

export const IconInfo = memo(
  ({
    profileImageUrl,
    isBroadCasting,
    isLoading,
    username,
    statusText,
    iconSize,
    usernameSize,
    usernameWeight,
    mode,
  }: IconInfoProps) => {
    const { theme } = useUnistyles();
    styles.useVariants({ mode: mode });

    return (
      <View style={styles.container}>
        <Icon
          profileImageUrl={profileImageUrl}
          isLoading={isLoading}
          isBroadCasting={isBroadCasting}
          size={iconSize}
        />

        <View style={styles.textWrapper}>
          <UIText
            size={usernameSize}
            weight={usernameWeight}
            style={styles.usernameText}
          >
            {username}
          </UIText>
          <UIText
            style={styles.statusText}
            size="xs"
          >
            {statusText}
          </UIText>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.ms(10),
  },
  textWrapper: {
    flexShrink: 1,
    gap: theme.utils.s(4),
  },

  usernameText: {
    variants: {
      mode: {
        default: { color: theme.colors.primaryText },
        post: { color: theme.colors.white },
      },
    },
  },
  statusText: {
    variants: {
      mode: {
        default: { color: theme.colors.muted },
        post: { color: theme.colors.lightGray },
      },
    },
  },
}));
