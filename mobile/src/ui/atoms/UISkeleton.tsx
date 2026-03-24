import { memo } from "react";
import { UnistylesRuntime } from "react-native-unistyles";
import { Skeleton, type SkeletonProps } from "react-native-ease-skeleton";

export type UISkeletonProps = Partial<SkeletonProps> & {
  show?: boolean;
};

export const UISkeleton = memo(
  ({ show = false, colorMode, ...props }: UISkeletonProps) => {
    const themeName = UnistylesRuntime.themeName;

    return (
      <Skeleton
        show={show}
        colorMode={colorMode || (themeName as "light" | "dark")}
        {...props}
      />
    );
  },
);
