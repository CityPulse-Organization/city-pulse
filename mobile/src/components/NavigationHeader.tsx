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
        <UIText
          style={styles.headerCenterText}
          size="md"
          weight="bold"
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.75}
          ellipsizeMode="tail"
        >
          {title}
        </UIText>
      </View>

      <View style={styles.headerRight}>
        {rightElement ? (
          rightElement
        ) : (
          onRightAction && (
            <UIButton onPress={onRightAction} isLoading={isLoading}>
              <UIText
                style={styles.headerRightText}
                size="lg"
                weight="bold"
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.75}
                ellipsizeMode="tail"
              >
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
    paddingBottom: theme.utils.vs(10),
    paddingHorizontal: theme.utils.s(12),
  },

  headerLeft: {
    flex: 1,
    alignItems: "flex-start",
    zIndex: 10,
  },
  headerLeftBlurButton: {
    paddingHorizontal: theme.utils.s(4),
    paddingVertical: theme.utils.vs(4),
  },

  headerCenter: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.utils.s(8),
  },
  headerCenterText: {
    color: theme.colors.primaryText,
    textAlign: "center",
  },

  headerRight: {
    flex: 1,
    alignItems: "flex-end",
    zIndex: 10,
  },
  headerRightText: {
    color: theme.colors.accent,
  },
}));