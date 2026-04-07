import { GestureResponderEvent, Pressable, StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { moderateScale } from "../unistyles";
import * as Haptics from 'expo-haptics';
import { useCallback } from "react";

import { UISkeleton } from "./UISkeleton";

type UIButtonProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  hasHapticFeedback?: boolean;
} & React.ComponentProps<typeof Pressable>;

export const UIButton = ({
  children,
  style,
  onPress,
  isLoading = false,
  hasHapticFeedback = false,
  ...rest
}: UIButtonProps) => {
  const handlePress = useCallback((e: GestureResponderEvent) => {
    if (hasHapticFeedback) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    onPress?.(e);
  }, [onPress, hasHapticFeedback]);

  return (
    <UISkeleton show={isLoading}>
      <Pressable
        onPress={handlePress}
        {...rest}
        style={({ pressed }) => [
          styles.button,
          style,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    </UISkeleton>
  );
};


const styles = StyleSheet.create({
  button: {
    gap: moderateScale(4),
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
});
