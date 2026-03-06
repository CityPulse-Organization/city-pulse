import { Skeleton } from "moti/skeleton";
import { Text, TextStyle } from "react-native";
import {
  StyleSheet,
  UnistylesRuntime,
  UnistylesVariants,
} from "react-native-unistyles";

type UITextProps = {
  children: React.ReactNode;
  style?: TextStyle;
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
  const themeName = UnistylesRuntime.themeName;
  return (
    <Skeleton show={isLoading} colorMode={themeName}>
      <Text {...rest} style={[style, styles.text]}>
        {children}
      </Text>
    </Skeleton>
  );
};

const styles = StyleSheet.create((theme) => ({
  text: {
    flexWrap: "wrap",
    variants: {
      size: {
        default: {
          fontSize: 16,
        },
        xxs: {
          fontSize: 10,
          fontWeight: 400,
        },
        xs: {
          fontSize: 12,
        },
        sm: {
          fontSize: 14,
        },
        md: {
          fontSize: 18,
        },
        lg: {
          fontSize: 20,
        },
        xl: {
          fontSize: 22,
        },
        xxl: {
          fontSize: 24,
        },
        extraLarge: { fontSize: 36 },
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
