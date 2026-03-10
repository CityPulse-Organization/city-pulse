import { InteractiveImagePreview, NavigationHeader, ThemedBackground } from "@/src/components";
import { UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Dimensions, Linking, View } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

const CONFIG = {
  SCREEN_WIDTH: Dimensions.get("window").width,
  COLUMN_COUNT: 4,
  FETCH_LIMIT: 40,
  MAX_SELECTION: 10,
  CROPPER: {
    width: 1080,
    height: 1350,
    mediaType: "photo" as const,
  },
};

const GAP = 4;
export const ITEM_SIZE =
  (CONFIG.SCREEN_WIDTH - GAP * (CONFIG.COLUMN_COUNT - 1)) / CONFIG.COLUMN_COUNT;


type GridItem = MediaLibrary.Asset | { id: "camera-id" };

export default function AddNewPostImageScreen() {
  const router = useRouter();

  const {
    selectedImages,
    setSelectedImages,
    previewImage,
    setPreviewImage,
    isMultiSelectMode,
    toggleMultiSelect,
    handleSelectImage,
  } = useGallerySelection();

  const onInitialLoad = useCallback((firstImage: MediaLibrary.Asset) => {
    setPreviewImage(firstImage);
    setSelectedImages([firstImage]);
  }, [setPreviewImage, setSelectedImages]);

  const { photos, loadAssets } = useMediaLibrary(onInitialLoad);

  const gridItems: GridItem[] = useMemo(() => [{ id: "camera-id" }, ...photos], [photos]);

  const onCancel = () => router.back();

  const onDone = useCallback(async () => {
    const processedUris = await processSelectedImages(selectedImages);

    if (processedUris) {
      router.navigate({
        pathname: "/(tabs)/profile/new-post",
        params:
          processedUris.length === 1
            ? { imageUri: processedUris[0] }
            : { uris: processedUris },
      });
    }
  }, [selectedImages, router]);

  const openCamera = useCallback(() => {
    ImagePicker.openCamera({
      width: CONFIG.CROPPER.width,
      height: CONFIG.CROPPER.height,
      cropping: true,
      mediaType: CONFIG.CROPPER.mediaType,
      includeExif: false,
    })
      .then((image) => {
        router.navigate({
          pathname: "/(tabs)/profile/new-post",
          params: { imageUri: image.path },
        });
      })
      .catch((e: unknown) => {
        handleImagePickerError(e);
      });
  }, [router]);

  const renderItem = useCallback(
    ({ item }: { item: GridItem }) => {
      if (!("uri" in item)) {
        return <CameraItem onPress={openCamera} />;
      }

      const selectionIndex = selectedImages.findIndex(
        (img) => img.id === item.id,
      );
      const isSelected = selectionIndex >= 0;
      const isPreviewing = previewImage?.id === item.id;

      return (
        <GalleryItem
          item={item}
          isSelected={isSelected}
          selectionIndex={selectionIndex}
          isPreviewing={isPreviewing}
          isMultiSelectMode={isMultiSelectMode}
          onPress={handleSelectImage}
        />
      );
    },
    [selectedImages, previewImage?.id, isMultiSelectMode, handleSelectImage, openCamera],
  );

  return (
    <ThemedBackground>
      <NavigationHeader
        title="New Post"
        onLeftAction={onCancel}
        onRightAction={onDone}
      />

      <View style={styles.container}>
        <InteractiveImagePreview imageUri={previewImage?.uri} />

        <GalleryHeader
          isMultiSelectMode={isMultiSelectMode}
          onToggleMultiSelect={toggleMultiSelect}
        />

        <FlashList
          data={gridItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          getItemType={(item) =>
            item.id === "camera-id" ? "camera" : "gallery"
          }
          numColumns={CONFIG.COLUMN_COUNT}
          onEndReached={loadAssets}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          extraData={{ selectedImages, isMultiSelectMode, previewImage }}
        />
      </View>
    </ThemedBackground>
  );
}






const useGallerySelection = () => {
  const [selectedImages, setSelectedImages] = useState<MediaLibrary.Asset[]>([]);
  const [previewImage, setPreviewImage] = useState<MediaLibrary.Asset | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  const toggleMultiSelect = useCallback(() => {
    setIsMultiSelectMode((prev) => {
      const nextMode = !prev;

      if (!nextMode && previewImage) {
        setSelectedImages([previewImage]);
      }

      return nextMode;
    });
  }, [previewImage]);

  const handleSelectImage = useCallback(
    (item: MediaLibrary.Asset) => {
      setPreviewImage(item);

      if (!isMultiSelectMode) {
        setSelectedImages([item]);
        return;
      }

      setSelectedImages((prevSelected) => {
        const index = prevSelected.findIndex((img) => img.id === item.id);

        if (index >= 0) {
          const newSelection = prevSelected.filter((img) => img.id !== item.id);
          return newSelection.length > 0 ? newSelection : prevSelected;
        } else {
          if (prevSelected.length < CONFIG.MAX_SELECTION) {
            return [...prevSelected, item];
          }
          return prevSelected;
        }
      });
    },
    [isMultiSelectMode],
  );

  return {
    selectedImages,
    setSelectedImages,
    previewImage,
    setPreviewImage,
    isMultiSelectMode,
    toggleMultiSelect,
    handleSelectImage,
  };
};

const useMediaLibrary = (
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

const processSelectedImages = async (
  selectedImages: MediaLibrary.Asset[],
): Promise<string[] | null> => {
  if (selectedImages.length === 0) return null;

  try {
    if (selectedImages.length === 1) {
      const image = await ImagePicker.openCropper({
        path: selectedImages[0].uri,
        width: CONFIG.CROPPER.width,
        height: CONFIG.CROPPER.height,
        compressImageMaxWidth: CONFIG.CROPPER.width,
        compressImageMaxHeight: CONFIG.CROPPER.height,
        cropping: true,
        cropperCircleOverlay: false,
        freeStyleCropEnabled: true,
        mediaType: CONFIG.CROPPER.mediaType,
      });
      return [image.path];
    } else {
      return selectedImages.map((image) => image.uri);
    }
  } catch (e: unknown) {
    handleImagePickerError(e);
    return null;
  }
};

const handleImagePickerError = (error: unknown) => {
  console.log("Image processing failed/cancelled", error);

  if (typeof error !== 'object' || error === null) {
    console.log("Unknown error format:", error);
    return;
  }

  const pickerError = error as { code?: string; message?: string };

  const code = pickerError?.code;
  const message = pickerError?.message || "";

  if (code === 'E_PERMISSION_MISSING' || message.includes('permission')) {
    Alert.alert(
      "No media access",
      "To take a photo, you need to allow the app to access the photos in your phone’s settings",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() }
      ]
    );
  } else if (code === 'E_PICKER_CANCELLED') {
    console.log("User cancelled image selection");
  } else {
    console.log("Camera/Gallery error:", error);
  }
};







const CameraItem = memo(({ onPress }: { onPress: () => void }) => {
  const { theme } = useUnistyles();

  return (
    <UIButton onPress={onPress} style={styles.cameraItem}>
      <Ionicons
        name="camera-outline"
        size={theme.utils.s(30)}
        color={theme.colors.muted}
      />
    </UIButton>
  );
});

type GalleryItemProps = {
  item: MediaLibrary.Asset;
  isSelected: boolean;
  selectionIndex: number;
  isPreviewing: boolean;
  isMultiSelectMode: boolean;
  onPress: (item: MediaLibrary.Asset) => void;
};

const GalleryItem = memo(
  ({
    item,
    isSelected,
    selectionIndex,
    isPreviewing,
    isMultiSelectMode,
    onPress,
  }: GalleryItemProps) => {
    return (
      <UIButton
        onPress={() => onPress(item)}
        style={styles.galleryCell}
        disabled={isPreviewing}
      >
        <Image
          source={{ uri: item.uri }}
          style={[
            {
              width: ITEM_SIZE,
              height: ITEM_SIZE,
            },
            isPreviewing && styles.dimmedImage,
          ]}
          contentFit="cover"
        />

        {isPreviewing && <View style={styles.previewBorder} />}

        {isMultiSelectMode && isSelected && (
          <View style={styles.selectionBadge}>
            <UIText size={"xs"} weight={"bold"} style={{ color: "white" }}>
              {selectionIndex + 1}
            </UIText>
          </View>
        )}
      </UIButton>
    );
  },
);

type GalleryHeaderProps = {
  isMultiSelectMode: boolean;
  onToggleMultiSelect: () => void;
};

const GalleryHeader = memo(
  ({ isMultiSelectMode, onToggleMultiSelect }: GalleryHeaderProps) => {
    const { theme } = useUnistyles();

    return (
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <UIText
            size="md"
            weight="normal"
            style={{ color: theme.colors.primaryText }}
          >
            Recents
          </UIText>

          <Ionicons
            name="chevron-forward-outline"
            size={theme.utils.s(14)}
            color={theme.colors.icon}
          />
        </View>

        <UIButton
          onPress={onToggleMultiSelect}
          style={[
            styles.multiplyPhotosButton,
            isMultiSelectMode && styles.multiplyPhotosButtonActive,
          ]}
        >
          <Ionicons
            name="albums-outline"
            size={theme.utils.s(20)}
            color={
              isMultiSelectMode
                ? theme.colors.iconSelected
                : theme.colors.icon
            }
          />
        </UIButton>
      </View>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    paddingTop: theme.utils.vs(10),
  },

  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.utils.s(14),
  },
  textContainer: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: theme.utils.s(6),
  },

  multiplyPhotosButton: {
    padding: theme.utils.s(4),
    borderRadius: theme.utils.ms(100),
  },
  multiplyPhotosButtonActive: {
    backgroundColor: theme.colors.buttonSelectedBackground,
  },

  cameraItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: theme.colors.backgroundSubtle,
    justifyContent: "center",
    alignItems: "center",
  },

  galleryCell: {
    marginRight: GAP,
    marginBottom: GAP,
  },
  previewBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2.4,
    borderColor: theme.colors.accent,
  },
  dimmedImage: {
    opacity: 0.5,
  },
  listContent: {
    paddingBottom: theme.utils.vs(80),
  },
  selectionBadge: {
    position: "absolute",
    top: theme.utils.vs(5),
    right: theme.utils.s(5),
    width: theme.utils.s(24),
    height: theme.utils.vs(24),
    borderRadius: theme.utils.ms(12),
    backgroundColor: theme.colors.mutedAccent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.white,
    zIndex: 10,
  },
}));
