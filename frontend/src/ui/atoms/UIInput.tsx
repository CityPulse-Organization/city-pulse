import { TextInput, TextInputProps, View, ViewStyle } from "react-native";
import {
  StyleSheet,
  UnistylesVariants,
  useUnistyles,
} from "react-native-unistyles";
import { moderateScale, scale } from "../unistyles";

type UIInputProps = {
  rightElement?: React.ReactNode;
  style?: ViewStyle;
} & TextInputProps &
  UnistylesVariants<typeof styles>;

export const UIInput = ({
  rightElement,
  inputTheme,
  style,
  placeholderTextColor,
  ...props
}: UIInputProps) => {
  const { theme } = useUnistyles();
  styles.useVariants({
    inputTheme: inputTheme,
  });
  return (
    <View style={[styles.container, style]}>
      <TextInput
        placeholderTextColor={
          placeholderTextColor
            ? placeholderTextColor
            : inputTheme === "dark"
            ? theme.colors.lightGray
            : theme.colors.gray
        }
        {...props}
        style={[styles.input, style]}
      />
      {rightElement ? (
        <>
          <View style={styles.divider} />
          <View style={styles.rightElement}>{rightElement}</View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  divider: {
    height: "100%",
    width: scale(1),
    backgroundColor: theme.colors.lightGray,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: theme.colors.black10,
    marginHorizontal: scale(8),
    backgroundColor: theme.colors.black,
  },
  input: {
    flex: 8,
    paddingLeft: moderateScale(10),
    variants: {
      inputTheme: {
        dark: {
          color: theme.colors.white,
          backgroundColor: theme.colors.black,
        },
        default: {
          color: theme.colors.black,
          backgroundColor: theme.colors.white,
        },
      },
    },
  },
  rightElement: {
    flex: 1,
  },
}));
