import { Pressable, StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { moderateScale } from "../unistyles";
import { UISkeleton } from "./UISkeleton";

type UIButtonProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  isLoading?: boolean;
} & React.ComponentProps<typeof Pressable>;

export const UIButton = ({
  children,
  style,
  onPress,
  isLoading = false,
  ...rest
}: UIButtonProps) => {
  if (isLoading) {
    return <UISkeleton style={[styles.button, style]} />;
  }

  return (
    <Pressable onPress={onPress} {...rest} style={[styles.button, style]}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    gap: moderateScale(4),
  },
});
