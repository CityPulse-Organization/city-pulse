import { Pressable, PressableStateCallbackType, StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { moderateScale } from "../unistyles";

import { UISkeleton } from "./UISkeleton";

type UIButtonProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  hasPressEffect?: boolean;
} & React.ComponentProps<typeof Pressable>;

export const UIButton = ({
  children,
  style,
  onPress,
  isLoading = false,
  hasPressEffect = false,
  ...rest
}: UIButtonProps) => {
  return (
    <UISkeleton show={isLoading}>
      <Pressable
        onPress={onPress}
        {...rest}
        style={({ pressed }) => [
          styles.button,
          style,
          hasPressEffect && pressed && styles.pressed,
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
