import { memo } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";
import { UIText } from "../ui";
import { Icon } from "./Icon";

export type IconInfoProps = {
  profileImageUrl?: string | undefined;
  isLoading?: boolean;
  username: string;
  usernameSize?: "sm";
  usernameWeight?: "bold";
  statusText?: string;
  iconSize?: "small" | "medium" | "comment";
  onPress?: () => void;
} & UnistylesVariants<typeof styles>;

export const IconInfo = memo(
  ({
    profileImageUrl,
    isLoading,
    username,
    statusText,
    iconSize,
    usernameSize,
    usernameWeight,
    mode,
    onPress,
  }: IconInfoProps) => {
    styles.useVariants({ mode: mode });

    return (
      <Pressable style={styles.container} onPress={onPress}>
        <Icon
          profileImageUrl={profileImageUrl}
          isLoading={isLoading}
          size={iconSize}
          colorEmptyIcon={mode === "post" ? styles.emptyIcon.color : undefined}
        />

        <View style={styles.textWrapper}>
          <UIText
            size={usernameSize}
            weight={usernameWeight}
            style={styles.usernameText}
          >
            {username}
          </UIText>
          <UIText style={styles.statusText} size="xs">
            {statusText}
          </UIText>
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.ms(10),
  },
  emptyIcon: {
    color: theme.colors.white,
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
