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

  const isMultiline = props.multiline;

  return (
    <View style={styles.wrapper}>
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

        {!isMultiline && error && (
          <UIText style={styles.errorText} size="xxs">
            {error}
          </UIText>
        )}

      </View>

      {isMultiline && error && (
        <UIText style={styles.errorTextBottom} size="xxs">
          {error}
        </UIText>
      )}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    width: "100%",
    gap: theme.utils.vs(4),
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

  rightElement: {
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    color: theme.colors.alert,
  },
  errorTextBottom: {
    color: theme.colors.alert,
    paddingLeft: theme.utils.s(4), // Delikatne wcięcie, żeby tekst zrównał się z wpisywanym hasłem/mailem
  },
}));
