import { memo } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UIButton, UIText } from "../ui/atoms";
import { BlurButton } from "./BlurButton";

type NavigationHeaderProps = {
  title: string;
  rightActionLabel?: string;
  onLeftAction: () => void;
  onRightAction?: () => void;
  isLoading?: boolean;
  rightElement?: React.ReactNode;
};

export const NavigationHeader = memo(
  ({
    title,
    rightActionLabel = "",
    onLeftAction,
    onRightAction,
    isLoading = false,
    rightElement,
  }: NavigationHeaderProps) => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <BlurButton
          onPress={onLeftAction}
          iconName="chevron-back-outline"
          style={styles.headerLeftBlurButton}
        />

      </View>

      <View style={styles.headerCenter} pointerEvents="none">
        <UIText style={styles.headerCenterText} size="md" weight="bold">
          {title}
        </UIText>
      </View>

      <View style={styles.headerRight}>
        {rightElement ? (
          rightElement
        ) : (
          onRightAction && (
            <UIButton onPress={onRightAction} isLoading={isLoading}>
              <UIText style={styles.headerRightText} size="lg" weight="bold">
                {rightActionLabel}
              </UIText>
            </UIButton>
          )
        )}
      </View>
    </View>
  ),
);

const styles = StyleSheet.create((theme) => ({
  headerContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: theme.utils.vs(10),
    paddingHorizontal: theme.utils.s(12),
  },

  headerLeft: {
    zIndex: 10,
    alignItems: "flex-start",
  },
  headerLeftBlurButton: {
    paddingHorizontal: theme.utils.s(4),
    paddingVertical: theme.utils.vs(4),
  },

  headerCenter: {
    position: "absolute",
    left: theme.utils.s(60),
    right: theme.utils.s(60),
    top: 0,
    bottom: theme.utils.vs(10),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  headerCenterText: {
    color: theme.colors.primaryText,
  },

  headerRight: {
    zIndex: 10,
    alignItems: "flex-end",
  },
  headerRightText: {
    color: theme.colors.accent,
  },
}));
