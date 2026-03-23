import { StyleProp, Text, TextStyle } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";

import { UISkeleton } from "./UISkeleton";

type UITextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  isLoading?: boolean;
} & UnistylesVariants<typeof styles> &
  React.ComponentProps<typeof Text>;

export const UIText = ({
  children,
  style,
  size,
  weight,
  isLoading = false,
  ...rest
}: UITextProps) => {
  styles.useVariants({ size: size, weight: weight });
  return (
    <UISkeleton show={isLoading}>
      <Text {...rest} style={[style, styles.text]}>
        {children}
      </Text>
    </UISkeleton>
  );
};


const styles = StyleSheet.create((theme) => ({
  text: {
    flexWrap: "wrap",
    variants: {
      size: {
        default: {
          fontSize: theme.utils.ms(16),
        },
        xxs: {
          fontSize: theme.utils.ms(10),
          fontWeight: 400,
        },
        xs: {
          fontSize: theme.utils.ms(12),
        },
        sm: {
          fontSize: theme.utils.ms(14),
        },
        md: {
          fontSize: theme.utils.ms(18),
        },
        lg: {
          fontSize: theme.utils.ms(20),
        },
        xl: {
          fontSize: theme.utils.ms(22),
        },
        xxl: {
          fontSize: theme.utils.ms(24),
        },
        extraLarge: { fontSize: theme.utils.ms(36) },
      },
      weight: {
        default: {
          fontWeight: 400,
        },
        thin: {
          fontWeight: 100,
        },
        normal: {
          fontWeight: 500,
        },
        bold: {
          fontWeight: 900,
        },
      },
    },
  },
}));
