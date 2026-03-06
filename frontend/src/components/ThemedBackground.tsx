import { StyleProp, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView
      style={styles.safeArea}
      edges={withSafeArea ? ["top", "bottom"] : []}
    >
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "stretch",
    backgroundColor: theme.colors.backgroundColor,
  },
}));
