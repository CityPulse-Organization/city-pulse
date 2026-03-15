import { Image, ImageProps } from "expo-image";
import { memo, useCallback, useState } from "react";
import { View } from "react-native";
import {
  StyleSheet,
  UnistylesRuntime,
  UnistylesVariants,
} from "react-native-unistyles";
import { UISkeleton } from "./UISkeleton";

type UIImageProps = {
  imageUrl: string | undefined;
  isLoading?: boolean;
  isAspectRatio?: boolean;
} & UnistylesVariants<typeof styles> &
  ImageProps;

export const UIImage = memo(
  ({
    imageUrl,
    size,
    borderRound,
    isLoading = false,
    isAspectRatio,
    style,
    ...props
  }: UIImageProps) => {
    const [imagePreparing, setImagePreparing] = useState(true);
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(
      undefined,
    );

    styles.useVariants({ size: size, borderRound: borderRound });

    const dynamicStyle = aspectRatio ? { aspectRatio: aspectRatio } : {};

    const handleLoadStart = useCallback(() => setImagePreparing(true), []);
    const handleLoadEnd = useCallback(() => setImagePreparing(false), []);

    const handleLoad = useCallback(
      (event: { source: { width: number; height: number } }) => {
        if (isAspectRatio && event.source.width && event.source.height) {
          setAspectRatio(event.source.width / event.source.height);
        }
      },
      [isAspectRatio],
    );

    if (isLoading) {
      return <UISkeleton size={size} borderRound={borderRound} style={style} />;
    }
    return (
      <View style={[styles.image, dynamicStyle, style]}>
        <Image
          {...props}
          source={{ uri: imageUrl }}
          style={[styles.image, dynamicStyle, style]}
          contentFit="cover"
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onLoadEnd={handleLoadEnd}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create((theme, rt) => ({
  image: {
    variants: {
      size: {
        default: {
          width: theme.utils.s(40),
          height: theme.utils.vs(40),
        },
        liveIcon: {
          width: theme.utils.s(50),
          height: theme.utils.vs(50),
        },
        masonry: {
          width: "100%",
        },
        small: {
          width: rt.screen.width - theme.utils.s(170),
          height: theme.utils.vs(120),
        },
        medium: {
          width: rt.screen.width - theme.utils.s(120),
          height: theme.utils.vs(150),
        },
        large: {
          width: rt.screen.width - theme.utils.s(70),
          height: theme.utils.vs(170),
        },
        full: {
          width: rt.screen.width,
          height: rt.screen.height,
        },
        post: {
          width: rt.screen.width - theme.utils.s(60),
        },
      },
      borderRound: {
        default: {
          borderRadius: 0,
        },
        small: {
          borderRadius: theme.utils.ms(4),
        },
        medium: {
          borderRadius: theme.utils.ms(8),
        },
        large: {
          borderRadius: theme.utils.ms(16),
        },
        full: {
          borderRadius: 999,
        },
      },
    },
  },
}));
