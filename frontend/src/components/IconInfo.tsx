import { memo } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
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
  iconBorderColor?: "violet" | "faint";
  onPress?: () => void;
};

export const IconInfo = memo(
  ({
    profileImageUrl,
    isBroadCasting,
    isLoading,
    username,
    statusText,
    iconSize,
    iconBorderColor,
    usernameSize,
    usernameWeight,
  }: IconInfoProps) => {
    return (
      <View style={styles.container}>
        <Icon
          profileImageUrl={profileImageUrl}
          isLoading={isLoading}
          isBroadCasting={isBroadCasting}
          size={iconSize}
          borderColor={iconBorderColor}
        />

        <View style={styles.textWrapper}>
          <UIText
            size={usernameSize}
            weight={usernameWeight}
            style={styles.username}
          >
            {username}
          </UIText>
          <UIText style={styles.statusText} size="xs">
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
  username: { color: theme.colors.iconInfoUsernameTextColor },
  statusText: { color: theme.colors.iconInfoStatusTextColor },
}));
