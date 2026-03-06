import { Skeleton } from "moti/skeleton";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { moderateScale } from "../unistyles";

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
  isLoading,
  ...rest
}: UIButtonProps) => {
  const themeName = UnistylesRuntime.themeName;
  return (
    <Skeleton show={isLoading} colorMode={themeName}>
      <Pressable onPress={onPress} {...rest} style={[styles.button, style]}>
        {children}
      </Pressable>
    </Skeleton>
  );
};

const styles = StyleSheet.create({
  button: {
    gap: moderateScale(4),
  },
});
