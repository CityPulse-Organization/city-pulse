import React, { memo } from "react";
import {
  StyleSheet as RNStyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import {
  StyleSheet,
  UnistylesVariants,
  useUnistyles,
} from "react-native-unistyles";
import { moderateScale, scale } from "../unistyles";
import { UIText } from "./UIText";

type UIInputProps = {
  rightElement?: React.ReactNode;
  style?: ViewStyle;
  error?: string;
  textInputStyle?: TextStyle;
} & TextInputProps &
  UnistylesVariants<typeof styles>;

export const UIInput = memo(
  ({
    rightElement,
    inputTheme,
    style,
    placeholderTextColor,
    error,
    textInputStyle,
    ...props
  }: UIInputProps) => {
    const { theme } = useUnistyles();
    styles.useVariants({ inputTheme: inputTheme });

    const resolvedPlaceholderColor =
      placeholderTextColor ??
      (inputTheme === "dark" ? theme.colors.lightGray : theme.colors.gray);

    const inputStyle = RNStyleSheet.flatten([styles.input, textInputStyle]);

    return (
      <View style={[styles.container, style]}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholderTextColor={resolvedPlaceholderColor}
            {...props}
            style={inputStyle}
          />

          {rightElement ? (
            <View style={styles.rightContainer}>
              <View style={styles.divider} />
              <View style={styles.rightElement}>{rightElement}</View>
            </View>
          ) : null}
        </View>

        {error ? (
          <UIText style={styles.errorText} size="xxs">
            {error}
          </UIText>
        ) : null}
      </View>
    );
  },
);

UIInput.displayName = "UIInput";

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingBottom: moderateScale(4),
    marginHorizontal: scale(8),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    paddingLeft: moderateScale(10),
    paddingVertical: moderateScale(8),
    fontSize: scale(16),
    variants: {
      inputTheme: {
        dark: {
          color: theme.colors.white,
        },
        default: {
          color: theme.colors.black,
        },
      },
    },
  },
  divider: {
    height: "100%",
    width: scale(1),
    backgroundColor: theme.colors.lightGray,
    marginHorizontal: scale(8),
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightElement: {
    justifyContent: "center",
  },
  errorText: {
    width: "100%",
    color: theme.colors.alert,
    marginTop: theme.utils.vs(4),
    paddingLeft: moderateScale(10),
    fontSize: theme.utils.s(12),
  },
}));
