import { StyleProp, Text, TextStyle } from "react-native";
import { StyleSheet, UnistylesVariants } from "react-native-unistyles";
import { scale } from "../unistyles";
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
  isLoading,
  ...rest
}: UITextProps) => {
  styles.useVariants({ size: size, weight: weight });
  if (isLoading) {
    return <UISkeleton size="medium" />;
  }

  return (
    <Text {...rest} style={[style, styles.text]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create((theme) => ({
  text: {
    flexWrap: "wrap",
    variants: {
      size: {
        default: {
          fontSize: scale(16),
        },
        xxs: {
          fontSize: scale(10),
          fontWeight: 400,
        },
        xs: {
          fontSize: scale(12),
        },
        sm: {
          fontSize: scale(14),
        },
        md: {
          fontSize: scale(18),
        },
        lg: {
          fontSize: scale(20),
        },
        xl: {
          fontSize: scale(22),
        },
        xxl: {
          fontSize: scale(24),
        },
        extraLarge: { fontSize: scale(36) },
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
