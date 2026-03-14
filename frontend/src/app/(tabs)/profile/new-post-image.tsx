import { UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import Toast from "react-native-toast-message";

import {
  InteractiveImagePreview,
  NavigationHeader,
  ThemedBackground,
} from "@/src/components";
import { Alert, Linking } from "react-native";

export const handleImagePickerError = (error: any) => {
  console.log("Image processing failed/cancelled", error);

  const code = error?.code;
  const message = error?.message || "";

  if (code === "E_PERMISSION_MISSING" || message.includes("permission")) {
    Alert.alert(
      "No media access",
      "To take a photo, you need to allow the app to access the photos in your phone’s settings",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ],
    );
  } else if (code === "E_PICKER_CANCELLED") {
    console.log("User cancelled image selection");
  } else {
    Toast.show({
      type: "error",
      text1: "Gallery Error",
      text2: message || "There was a problem accessing your media ❌",
    });
  }
};

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
export const ITEM_SIZE = CONFIG.SCREEN_WIDTH / CONFIG.COLUMN_COUNT;

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
    try {
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
    } catch (error) {
       Toast.show({
        type: "error",
        text1: "Processing Error",
        text2: "We could not process your images. Please try again ❌",
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
      Toast.show({
        type: "error",
        text1: "Gallery Error",
        text2: "Unable to load your photos. Please check permissions ❌",
      });
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

const CameraItem = memo(({ onPress }: { onPress: () => void }) => (
  <UIButton onPress={onPress} style={styles.cameraItem}>
    <Ionicons name="camera-outline" size={30} color={"white"} />
  </UIButton>
));

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
        style={{ opacity: isPreviewing ? 0.5 : 1 }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
          contentFit="cover"
        />

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
            size="lg"
            weight="bold"
            style={{ color: theme.colors.profileTextColor }}
          >
            Recents
          </UIText>
          <Ionicons
            name="chevron-forward-outline"
            size={18}
            color={theme.colors.iconColor}
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
            color={isMultiSelectMode ? "black" : "white"}
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
    padding: 20,
  },
  textContainer: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 4,
  },
  multiplyPhotosButton: {
    padding: 4,
    borderRadius: 100,
    backgroundColor: theme.colors.backgroundMultiplyPhotosButton,
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
  imageItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
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
    backgroundColor: theme.colors.backgroundSelectionBadge,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.white,
    zIndex: 10,
  },
}));
