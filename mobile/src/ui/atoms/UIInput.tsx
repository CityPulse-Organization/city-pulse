import { StyleProp, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import {
  StyleSheet,
  UnistylesVariants,
} from "react-native-unistyles";
import { UIText } from "./UIText";

type UIInputProps = {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  dividerColor?: "accent";
  error?: string;
} & TextInputProps &
  UnistylesVariants<typeof styles>;

export const UIInput = ({
  leftElement,
  rightElement,
  dividerColor,
  containerStyle,
  inputStyle,
  placeholderTextColor,
  error,
  ...props
}: UIInputProps) => {
  styles.useVariants({
    dividerColor: dividerColor,
  });

  return (
    <View style={[styles.inputContainer, containerStyle]}>

      {leftElement && (
        <View style={styles.leftElement}>{leftElement}</View>
      )}

      <TextInput
        placeholderTextColor={placeholderTextColor ?? styles.placeholderColor.color}
        style={[styles.input, inputStyle]}
        {...props}
      />

      {rightElement && (
        <View style={styles.rightElement}>{rightElement}</View>
      )}

      {error ? (
        <UIText style={styles.errorText} size="xxs">
          {error}
        </UIText>
      ) : null}

    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    gap: theme.utils.s(10),
    variants: {
      dividerColor: {
        default: {
          borderColor: theme.colors.muted,
        },
        accent: {
          borderColor: theme.colors.violet,
        }
      },
    },
  },

  input: {
    flex: 1,
    fontSize: theme.utils.ms(16),
    color: theme.colors.primaryText,
  },

  placeholderColor: {
    color: theme.colors.muted,
  },

  leftElement: {
    justifyContent: "center",
    alignItems: "center",
  },

  rightElement: {
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    color: theme.colors.alert,
  },
}));
