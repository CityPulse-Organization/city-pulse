import { StyleProp, View, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type ThemedBackgroundProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  withSafeArea?: boolean;
};

export const ThemedBackground = ({
  children,
  style,
  withSafeArea = true,
}: ThemedBackgroundProps) => {
  return (
    <View
      style={[
        withSafeArea ? styles.safeArea : styles.background,
        styles.content,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  background: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
    paddingTop: rt.insets.top,
    paddingBottom: rt.insets.bottom,
    paddingLeft: rt.insets.left,
    paddingRight: rt.insets.right,
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "stretch",
  },
}));
