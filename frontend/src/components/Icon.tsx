import { scale, UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { memo, useEffect, useState } from "react";
import {
  StyleSheet,
  UnistylesVariants,
  useUnistyles,
} from "react-native-unistyles";

export type IconProps = {
  profileImageUrl?: string;
  isBroadCasting?: boolean;
  isLoading?: boolean;
  borderColor?: string;
} & UnistylesVariants<typeof styles>;

export const Icon = memo(
  ({
    profileImageUrl,
    size,
    isBroadCasting = false,
    isLoading = false,
    borderColor,
  }: IconProps) => {
    const { theme } = useUnistyles();
    const [imageUri, setImageUri] = useState<string | undefined>(
      profileImageUrl,
    );
    styles.useVariants({ size: size, borderColor: borderColor });

    useEffect(() => {
      if (!profileImageUrl) {
        setImageUri(undefined);
        return;
      }

      if (profileImageUrl.startsWith("ph://")) {
        const assetId = profileImageUrl.replace("ph://", "").split("/")[0];
        MediaLibrary.getAssetInfoAsync(assetId)
          .then((assetInfo) => {
            if (assetInfo.localUri) {
              setImageUri(assetInfo.localUri);
            } else {
              setImageUri(profileImageUrl);
            }
          })
          .catch(() => {
            setImageUri(profileImageUrl);
          });
      } else {
        setImageUri(profileImageUrl);
      }
    }, [profileImageUrl]);

    const getFallbackIconSize = () => {
      switch (size) {
        case "medium":
          return scale(60);
        case "comment":
          return scale(24);
        case "small":
          return scale(18);
        default:
          return scale(28);
      }
    };

    return (
      <UIButton style={styles.button} onPress={() => {}} isLoading={isLoading}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            cachePolicy="memory-disk"
            priority="normal"
          />
        ) : (
          <Ionicons
            color={theme.colors.iconColor}
            size={getFallbackIconSize()}
            name="person"
          />
        )}

        {isBroadCasting ? (
          <UIText weight="bold" size="xs" style={styles.iconText}>
            LIVE
          </UIText>
        ) : null}
      </UIButton>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  button: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: 999,

    variants: {
      size: {
        default: {
          width: scale(50),
          height: scale(50),
        },
        medium: {
          height: scale(100),
          width: scale(100),
        },
        small: {
          height: scale(30),
          width: scale(30),
        },
        comment: {
          height: scale(40),
          width: scale(40),
        },
      },
      borderColor: {
        default: {},
        violet: {
          borderWidth: 2,
          borderColor: theme.colors.darkViolet,
        },
        faint: {
          borderWidth: 2,
          borderColor: theme.colors.faintColor,
        },
      },
    },
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  iconText: {
    position: "absolute",
    bottom: -8,
    alignSelf: "center",
    color: theme.colors.white,
    backgroundColor: theme.colors.alert,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
    textAlign: "center",
  },
  username: {
    color: theme.colors.white,
    paddingBottom: 10,
  },
}));
