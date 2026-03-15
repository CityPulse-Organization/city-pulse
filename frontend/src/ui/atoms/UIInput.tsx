import { StyleProp, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import {
  StyleSheet,
  UnistylesVariants,
} from "react-native-unistyles";
import { UIText } from "./UIText";

type UIInputProps = {
  leftElement?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  dividerColor?: "accent";
  error?: string;
} & TextInputProps &
  UnistylesVariants<typeof styles>;

export const UIInput = ({
  leftElement,
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
    <View style={[styles.container, containerStyle]}>

      {leftElement && (
        <View style={styles.leftElement}>{leftElement}</View>
      )}

      <TextInput
        placeholderTextColor={placeholderTextColor ?? styles.placeholderColor.color}
        style={[styles.input, inputStyle]}
        {...props}
      />

      {error ? (
        <UIText style={styles.errorText} size="xxs">
          {error}
        </UIText>
      ) : null}

    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingBottom: theme.utils.ms(4),
    marginHorizontal: theme.utils.s(8),
  },
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

  errorText: {
    color: theme.colors.alert,
  },
}));
