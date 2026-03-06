import { UIButton, UIText } from "@/src/ui";
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
  username?: string;
  profileImageUrl?: string;
  isBroadCasting?: boolean;
  isLoading?: boolean;
} & UnistylesVariants<typeof styles>;

export const Icon = memo(
  ({
    username,
    profileImageUrl,
    size,
    isBroadCasting = false,
    isLoading = false,
  }: IconProps) => {
    const { theme } = useUnistyles();
    const [imageUri, setImageUri] = useState<string | undefined>(
      profileImageUrl,
    );
    styles.useVariants({ size: size });

    useEffect(() => {
      if (!profileImageUrl) {
        setImageUri(undefined);
        return;
      }

      // Convert ph:// URLs to file:// URIs for expo-image
      if (profileImageUrl.startsWith("ph://")) {
        // Extract asset ID from ph:// URL format: ph://ID/PATH
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
            // Fallback to original URI if conversion fails
            setImageUri(profileImageUrl);
          });
      } else {
        setImageUri(profileImageUrl);
      }
    }, [profileImageUrl]);

    return (
      <UIButton style={styles.button} onPress={() => {}} isLoading={isLoading}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.icon}
            cachePolicy="memory-disk"
            priority="normal"
          />
        ) : (
          <Ionicons
            color={theme.colors.white}
            size={styles.icon.height}
            name="person"
          />
        )}

        {isBroadCasting ? (
          <UIText weight="bold" size="xs" style={styles.iconText}>
            LIVE
          </UIText>
        ) : null}
        {username ? <UIText style={styles.username}>{username}</UIText> : null}
      </UIButton>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  icon: {
    alignItems: "center",
    borderRadius: 999,
    variants: {
      size: {
        default: {
          width: 50,
          height: 50,
        },
        medium: {
          height: 130,
          width: 130,
        },
      },
    },
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconText: {
    position: "absolute",
    bottom: -8,
    alignSelf: "center",
    color: theme.colors.white,
    backgroundColor: theme.colors.alert,
    paddingHorizontal: 6,
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
