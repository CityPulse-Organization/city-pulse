import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { UIButton, UIText } from "../../ui/atoms";

type NavigationHeaderProps = {
  title: string;
  rightActionLabel?: string;
  onLeftAction: () => void;
  onRightAction: () => void;
};

export const NavigationHeader = memo(
  ({
    title,
    rightActionLabel = "Done",
    onLeftAction,
    onRightAction,
  }: NavigationHeaderProps) => {
    const { theme } = useUnistyles();

    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <UIButton onPress={onLeftAction} isLoading={false}>
            <Ionicons
              color={theme.colors.iconColor}
              size={20}
              name={"chevron-back-outline"}
            />
          </UIButton>
        </View>

        <View style={styles.headerCenter}>
          <UIText
            style={{ color: theme.colors.profileTextColor }}
            size="md"
            weight="bold"
          >
            {title}
          </UIText>
        </View>

        <View style={styles.headerRight}>
          <UIButton onPress={onRightAction} isLoading={false}>
            <UIText
              style={{ color: theme.colors.lightViolet }}
              size="lg"
              weight="bold"
            >
              {rightActionLabel}
            </UIText>
          </UIButton>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  headerContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    padding: 8,
    paddingTop: 10,
  },
  headerLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.profileTextColor,
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
}));
