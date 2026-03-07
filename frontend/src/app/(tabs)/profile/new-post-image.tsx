import { InteractiveImagePreview, NavigationHeader, ThemedBackground } from "@/src/components";
import { UIButton, UIText } from "@/src/ui";
import { handleImagePickerError } from "@/src/ui/molecules/mediaErrorHandler";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
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

type Asset = MediaLibrary.Asset;

type GridItem = Asset | { id: "camera-id" };

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

  const { photos, loadAssets } = useMediaLibrary(
    useCallback(
      (firstImage) => {
        setPreviewImage(firstImage);
        setSelectedImages([firstImage]);
      },
      [setPreviewImage, setSelectedImages],
    ),
  );

  const gridItems: GridItem[] = [{ id: "camera-id" }, ...photos];

  const onCancel = () => router.back();

  const onDone = async () => {
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
  };

  const openCamera = () => {
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
      .catch((e) => {
        handleImagePickerError(e);
      });
  };

  const renderItem = useCallback(
    ({ item }: { item: GridItem }) => {
      if (item.id === "camera-id") {
        return <CameraItem onPress={openCamera} />;
      }

      item = item as Asset;
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
    [selectedImages, previewImage, isMultiSelectMode, handleSelectImage],
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
  const [selectedImages, setSelectedImages] = useState<Asset[]>([]);
  const [previewImage, setPreviewImage] = useState<Asset | null>(null);
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
    (item: Asset) => {
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

const useMediaLibrary = (onInitialLoad: (firstAsset: Asset) => void) => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState<Asset[]>([]);
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
          sortBy: ["creationTime"],
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
  }, [permissionResponse?.status, requestPermission]);

  return {
    photos,
    loadAssets,
    hasPermission: permissionResponse?.status === "granted",
  };
};

const processSelectedImages = async (
  selectedImages: Asset[],
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
        multiple: true,
        cropping: true,
        cropperCircleOverlay: false,
        freeStyleCropEnabled: true,
        mediaType: CONFIG.CROPPER.mediaType,
      });
      return [image.path];
    } else {
      return selectedImages.map((img) => img.uri);
    }
  } catch (e: any) {
    handleImagePickerError(e);
    return null;
  }
};

const CameraItem = memo(({ onPress }: { onPress: () => void }) => {
  const { theme } = useUnistyles();

  return (
    <UIButton onPress={onPress} style={styles.cameraItem}>
      <Ionicons
        name="camera-outline"
        size={30}
        color={theme.colors.profileIconColor}
      />
    </UIButton>
  );
});

type GalleryItemProps = {
  item: Asset;
  isSelected: boolean;
  selectionIndex: number;
  isPreviewing: boolean;
  isMultiSelectMode: boolean;
  onPress: (item: Asset) => void;
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
    const [imageUri, setImageUri] = useState<string>(item.uri);

    useEffect(() => {
      if (item.uri.startsWith("ph://")) {
        MediaLibrary.getAssetInfoAsync(item.id)
          .then((assetInfo) => {
            if (assetInfo.localUri) {
              setImageUri(assetInfo.localUri);
            }
          })
          .catch(() => {});
      }
    }, [item.uri, item.id]);

    return (
      <UIButton
        onPress={() => onPress(item)}
        style={styles.galleryCell}
        disabled={isPreviewing}
      >
        <Image
          source={{ uri: imageUri }}
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
            style={{ color: theme.colors.profileTextColor }}
          >
            Recents
          </UIText>
          <Ionicons
            name="chevron-forward-outline"
            size={14}
            color={theme.colors.profileIconColor}
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
            size={20}
            color={
              isMultiSelectMode
                ? theme.colors.black
                : theme.colors.profileIconColor
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
    paddingTop: 10,
  },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
  },
  textContainer: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 6,
  },
  multiplyPhotosButton: {
    padding: 4,
    borderRadius: 100,
  },
  multiplyPhotosButtonActive: {
    backgroundColor: theme.colors.white,
  },
  cameraItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: theme.colors.backgroundCameraButton,
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
    borderColor: theme.colors.lightViolet,
  },
  dimmedImage: {
    opacity: 0.5,
  },
  listContent: {
    paddingBottom: 100,
  },
  selectionBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.darkViolet,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.white,
    zIndex: 10,
  },
}));
