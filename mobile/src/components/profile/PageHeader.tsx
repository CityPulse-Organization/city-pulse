import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UIButton, UIText } from "../../ui/atoms";
import { BlurButton } from "../BlurButton";

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
  }: NavigationHeaderProps) => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <BlurButton
          onPress={onLeftAction}
          iconName="chevron-back-outline"
          style={styles.headerLeftBlurButton}
        />

      </View>

      <View style={styles.headerCenter}>
        <UIText
          style={styles.headerCenterText}
          size="md"
          weight="bold"
        >
          {title}
        </UIText>
      </View>

      <View style={styles.headerRight}>
        <UIButton onPress={onRightAction} isLoading={false}>
          <UIText
            style={styles.headerRightText}
            size="lg"
            weight="bold"
          >
            {rightActionLabel}
          </UIText>
        </UIButton>
      </View>
    </View>
  ));

const styles = StyleSheet.create((theme) => ({
  headerContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    paddingBottom: theme.utils.vs(10),
    paddingHorizontal: theme.utils.s(12),
  },

  headerLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerLeftBlurButton: {
    paddingHorizontal: theme.utils.s(4),
    paddingVertical: theme.utils.vs(4),
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.primaryText,
  },
  headerCenterText: {
    color: theme.colors.primaryText,
  },

  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  headerRightText: {
    color: theme.colors.accent,
  },
}));
