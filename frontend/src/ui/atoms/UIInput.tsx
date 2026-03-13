import { StyleProp, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import {
  StyleSheet,
  UnistylesVariants,
} from "react-native-unistyles";

type UIInputProps = {
  leftElement?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  dividerColor?: "accent";
} & TextInputProps &
  UnistylesVariants<typeof styles>;

export const UIInput = ({
  leftElement,
  dividerColor,
  containerStyle,
  inputStyle,
  placeholderTextColor,
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

    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
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
}));
