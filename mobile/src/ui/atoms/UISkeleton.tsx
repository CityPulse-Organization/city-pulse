import { memo } from "react";
import { StyleSheet } from "react-native-unistyles";
import { Skeleton, type SkeletonProps } from "react-native-ease-skeleton";

export type UISkeletonProps = Partial<SkeletonProps> & {
  show?: boolean;
};

export const UISkeleton = memo(
  ({ show = false, colorMode, ...props }: UISkeletonProps) => {

    return (
      <Skeleton
        show={show}
        colorMode={colorMode || (styles.container.color as "light" | "dark")}
        {...props}
      />
    );
  },
);

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    color: rt.themeName,
  }
}));

