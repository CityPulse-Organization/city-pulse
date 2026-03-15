import { useCallback, useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { CONFIG } from "@/src/app/(tabs)/profile/new-post-image";


export const useMediaLibrary = (
  onInitialLoad: (firstAsset: MediaLibrary.Asset) => void,
) => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const loadAssets = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { assets: newPhotos, endCursor: newCursor } =
        await MediaLibrary.getAssetsAsync({
          first: CONFIG.FETCH_LIMIT,
          mediaType: ["photo"],
          sortBy: ["modificationTime"],
          after: endCursor,
        });

      if (newPhotos.length > 0) {
        setPhotos((prev) => [...prev, ...newPhotos]);
        setEndCursor(newCursor);

        if (!endCursor && newPhotos[0]) {
          onInitialLoad(newPhotos[0]);
        }
      }
    } catch (e) {
      console.error("Error loading images from gallery", e);
    } finally {
      setIsLoading(false);
    }
  }, [endCursor, isLoading, onInitialLoad]);

  useEffect(() => {
    if (permissionResponse?.status === "granted") {
      loadAssets();
    } else if (permissionResponse?.canAskAgain) {
      requestPermission();
    }
  }, [permissionResponse?.status, requestPermission, loadAssets]);

  return {
    photos,
    loadAssets,
    hasPermission: permissionResponse?.status === "granted",
  };
};
