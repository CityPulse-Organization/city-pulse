import { useCallback, useEffect, useRef, useState } from "react";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { Linking, PermissionsAndroid, Platform } from "react-native";
import { NEW_POST_IMAGE_CONFIG } from "@/src/utils/newPostImageUtils";
import { Photo } from "@/src/types/newPostImage";
import { UIAlert } from "@/src/hoc";
import { useTranslation } from "react-i18next";

export const useMediaLibrary = (onInitialLoad: (firstAsset: Photo) => void) => {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState(true);

  const isLoadingRef = useRef(false);

  const onInitialLoadRef = useRef(onInitialLoad);
  useEffect(() => {
    onInitialLoadRef.current = onInitialLoad;
  }, [onInitialLoad]);

  const loadAssets = useCallback(async () => {
    if (isLoadingRef.current || !hasNextPage) return;

    isLoadingRef.current = true;

    try {
      const result = await CameraRoll.getPhotos({
        first: NEW_POST_IMAGE_CONFIG.FETCH_LIMIT,
        assetType: "Photos",
        after: endCursor,
        groupTypes: Platform.OS === "ios" ? "SavedPhotos" : "All",
      });

      const newPhotos: Photo[] = result.edges.map((edge) => ({
        id: edge.node.image.uri,
        uri: edge.node.image.uri,
        width: edge.node.image.width,
        height: edge.node.image.height,
      }));

      if (newPhotos.length > 0) {
        setPhotos((prev) => [...prev, ...newPhotos]);
        setEndCursor(result.page_info.end_cursor);
        setHasNextPage(result.page_info.has_next_page);

        if (!endCursor && newPhotos[0]) {
          onInitialLoadRef.current(newPhotos[0]);
        }
      }
    } catch (error: any) {
      console.error("Error loading images from gallery", error);

      if (
        Platform.OS === "ios" &&
        error?.message?.toLowerCase().includes("denied")
      ) {
        UIAlert.alert(
          t('permissions.photoAccessTitle'),
          t('permissions.photoAccessMessage'),
          [
            { text: t('permissions.cancel'), style: "cancel" },
            {
              text: t('permissions.openSettings'),
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [endCursor, hasNextPage]);

  useEffect(() => {
    let cancelled = false;

    const requestAndLoad = async () => {
      const granted = await requestMediaPermission(t);

      if (cancelled) return;

      if (granted) {
        if (!isLoadingRef.current) {
          loadAssets();
        }
      }
    };

    requestAndLoad();

    return () => {
      cancelled = true;
    };
  }, [t]);

  return {
    photos,
    loadAssets,
  };
};

const requestMediaPermission = async (t: any) => {
  if (Platform.OS !== "android") return true;

  const sdkVersion = parseInt(String(Platform.Version), 10);

  const permission =
    sdkVersion >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) return true;

  return new Promise((resolve) => {
    UIAlert.alert(
      t('permissions.photoAccessTitle'),
      t('permissions.photoAccessShort'),
      [
        {
          text: t('permissions.deny'),
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: t('permissions.allow'),
          onPress: async () => {
            const result = await PermissionsAndroid.request(permission);

            if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
              Linking.openSettings();
              resolve(false);
              return;
            }

            resolve(result === PermissionsAndroid.RESULTS.GRANTED);
          },
        },
      ],
    );
  });
};
