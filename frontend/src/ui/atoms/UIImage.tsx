import { Image, ImageProps } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { Skeleton } from "moti/skeleton";
import { memo, useEffect, useState } from "react";
import { Image as RNImage, View } from "react-native";
import {
  StyleSheet,
  UnistylesRuntime,
  UnistylesVariants,
} from "react-native-unistyles";
import { moderateScale, scale, verticalScale } from "../unistyles";

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
    isLoading,
    isAspectRatio,
    style,
    ...props
  }: UIImageProps) => {
    const [imagePreparing, setImagePreparing] = useState(true);
    const [resolvedUri, setResolvedUri] = useState<string | undefined>(
      imageUrl,
    );
    styles.useVariants({ size: size, borderRound: borderRound });
    const themeName = UnistylesRuntime.themeName;

    const [aspectRatio, setAspectRatio] = useState<number | undefined>(
      undefined,
    );

    useEffect(() => {
      if (!imageUrl) {
        setResolvedUri(undefined);
        return;
      }

      if (imageUrl.startsWith("ph://")) {
        const assetId = imageUrl.replace("ph://", "").split("/")[0];
        MediaLibrary.getAssetInfoAsync(assetId)
          .then((assetInfo) => {
            if (assetInfo.localUri) {
              setResolvedUri(assetInfo.localUri);
            } else {
              setResolvedUri(imageUrl);
            }
          })
          .catch(() => {
            setResolvedUri(imageUrl);
          });
      } else {
        setResolvedUri(imageUrl);
      }
    }, [imageUrl]);

    useEffect(() => {
      if (!isAspectRatio || !resolvedUri) {
        setAspectRatio(undefined);
        return;
      }

      if (resolvedUri.startsWith("ph://")) {
        return;
      }

      RNImage.getSize(resolvedUri, (width, height) => {
        if (width > 0 && height > 0) {
          setAspectRatio(width / height);
        }
      });
    }, [resolvedUri, isAspectRatio]);

    const dynamicStyle = aspectRatio ? { aspectRatio: aspectRatio } : {};

    return (
      <View style={[styles.image, dynamicStyle, style]}>
        <Skeleton show={imagePreparing || isLoading} colorMode={themeName}>
          <Image
            {...props}
            style={[styles.image, dynamicStyle, style]}
            contentFit="cover"
            onLoadStart={() => setImagePreparing(true)}
            onLoadEnd={() => setImagePreparing(false)}
            source={{
              uri: resolvedUri,
            }}
          />
        </Skeleton>
      </View>
    );
  },
);

const styles = StyleSheet.create((theme, rt) => ({
  image: {
    variants: {
      size: {
        default: { width: scale(40), height: scale(40) },
        liveIcon: {
          width: scale(50),
          height: scale(50),
        },
        masonry: {
          width: "100%",
        },
        small: {
          width: rt.screen.width - scale(170),
          height: verticalScale(120),
        },
        medium: {
          width: rt.screen.width - scale(120),
          height: verticalScale(150),
        },
        large: {
          width: rt.screen.width - scale(70),
          height: verticalScale(170),
        },
        full: {
          width: rt.screen.width,
          height: rt.screen.height,
        },
        post: {
          width: rt.screen.width - 60,
        },
      },
      borderRound: {
        default: {
          borderRadius: 0,
        },
        small: {
          borderRadius: moderateScale(4),
        },
        medium: {
          borderRadius: moderateScale(8),
        },
        large: {
          borderRadius: moderateScale(16),
        },
        full: {
          borderRadius: 999,
        },
      },
    },
  },
}));
