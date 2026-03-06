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
  statusText?: string;
};

export const IconInfo = memo(
  ({
    profileImageUrl,
    isBroadCasting,
    isLoading,
    username,
    statusText,
  }: IconInfoProps) => {
    return (
      <View style={styles.container}>
        <UIButton isLoading={isLoading} onPress={() => {}}>
          <Icon
            profileImageUrl={profileImageUrl}
            isBroadCasting={isBroadCasting}
          />
        </UIButton>

        <View style={styles.textWrapper}>
          <UIText size="md" style={styles.username}>
            {username}
          </UIText>
          <UIText style={styles.statusText} size="sm">
            {statusText}
          </UIText>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.ms(10),
  },
  textWrapper: {
    gap: 4,
  },
  username: { color: theme.colors.iconInfoUsernameTextColor },
  statusText: { color: theme.colors.iconInfoStatusTextColor },
}));
