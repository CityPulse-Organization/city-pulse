import { useCallback, useMemo } from "react";
import { useGallerySelection } from "./useGallerySelection";
import { useMediaLibrary } from "./useMediaLibrary";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { CONFIG, GridItem } from "@/src/app/(tabs)/profile/new-post-image";
import ImagePicker from "react-native-image-crop-picker";
import { handleImagePickerError } from "@/src/utils/handleImagePickerError";


export const useNewPostImage = () => {
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

  const onCancel = useCallback(async () => router.back(), [router]);

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

  return {
    gridItems,
    loadAssets,
    previewImage,
    selectedImages,
    isMultiSelectMode,
    toggleMultiSelect,
    handleSelectImage,
    onCancel,
    onDone,
    openCamera,
  };
}


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


