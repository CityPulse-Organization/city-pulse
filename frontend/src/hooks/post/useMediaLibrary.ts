import { useCallback, useEffect, useRef, useState } from "react";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { showSettingsAlert } from "@/src/utils/handleImagePickerError";
import { Photo } from "@/src/types/newPostImage";
import { CONFIG } from "@/src/utils/newPostImageUtils";


export const useMediaLibrary = (
  onInitialLoad: (firstAsset: Photo) => void,
) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isLoadingRef = useRef(false);

  const onInitialLoadRef = useRef(onInitialLoad);
  useEffect(() => {
    onInitialLoadRef.current = onInitialLoad;
  }, [onInitialLoad]);

  const loadAssets = useCallback(async () => {
    if (isLoadingRef.current || !hasNextPage) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const result = await CameraRoll.getPhotos({
        first: CONFIG.FETCH_LIMIT,
        assetType: "All",
        after: endCursor,
      });

      const newPhotos: Photo[] = result.edges.map((edge) => ({
        id: edge.node.id,
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

      if (Platform.OS === "ios" && error?.message?.toLowerCase().includes("denied")) {
        showSettingsAlert(
          "Photo Access Required",
          "City Pulse needs access to your photo library to select images. Please enable it in your device Settings.");
      }
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [endCursor, hasNextPage]);

  useEffect(() => {
    let cancelled = false;

    const requestAndLoad = async () => {
      const granted = await requestMediaPermission();

      if (cancelled) return;

      if (granted) {
        if (!isLoadingRef.current) {
          loadAssets();
        }
      }
    };

    requestAndLoad();

    return () => { cancelled = true; };
  }, []);

  return {
    photos,
    loadAssets,
  };
};


async function requestMediaPermission(): Promise<boolean> {
  if (Platform.OS !== "android") return true;

  const sdkVersion = parseInt(String(Platform.Version), 10);

  const permission =
    sdkVersion >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) return true;

  return new Promise((resolve) => {
    Alert.alert(
      "Photo Access Required",
      "City Pulse needs access to your photo library to select images.",
      [
        {
          text: "Deny",
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: "Allow",
          onPress: async () => {
            const result = await PermissionsAndroid.request(permission);
            resolve(result === PermissionsAndroid.RESULTS.GRANTED);
          },
        },
      ]
    );
  });
}

