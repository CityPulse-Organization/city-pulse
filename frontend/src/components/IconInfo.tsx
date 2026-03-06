import { memo } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UIButton, UIText } from "../ui";
import { Icon } from "./Icon";

export type IconInfoProps = {
  profileImageUrl?: string | undefined;
  isBroadCasting?: boolean;
  isLoading?: boolean;
  username: string;
  usernameSize?: "sm";
  usernameWeight?: "bold";
  statusText?: string;
  iconSize?: "small";
  iconBorderColor?: "violet" | "faint";
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
        <UIButton isLoading={isLoading} onPress={() => {}}>
          <Icon
            profileImageUrl={profileImageUrl}
            isBroadCasting={isBroadCasting}
            size={iconSize}
            borderColor={iconBorderColor}
          />
        </UIButton>

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
    gap: 4,
  },
  username: { color: theme.colors.iconInfoUsernameTextColor },
  statusText: { color: theme.colors.iconInfoStatusTextColor },
}));
