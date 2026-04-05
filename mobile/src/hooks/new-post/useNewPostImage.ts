import { useCallback, useMemo } from "react";
import { useGallerySelection } from "./useGallerySelection";
import { useMediaLibrary } from "./useMediaLibrary";
import { useRouter } from "expo-router";
import ImagePicker from "react-native-image-crop-picker";
import { useGalleryBottomSheet } from "./useGalleryBottomSheet";
import { UIAlert } from "@/src/hoc";
import { Linking, Platform } from "react-native";
import { GridItem, Photo } from "@/src/types/newPostImage";


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

  const onInitialLoad = useCallback((firstImage: Photo) => {
    setPreviewImage(firstImage);
    setSelectedImages([firstImage]);
  }, [setPreviewImage, setSelectedImages]);


  const { photos, loadAssets } = useMediaLibrary(onInitialLoad);


  const {
    bottomSheetRef,
    snapPoints,
    onGalleryItemPress,
    renderNullBackdrop
  } = useGalleryBottomSheet(handleSelectImage);

  const gridItems: GridItem[] = useMemo(() => [{ id: "camera-id" }, ...photos], [photos]);


  const onCancel = useCallback(async () => {
    bottomSheetRef.current?.dismiss();
    router.back();
  }, [router]);

  const onDone = useCallback(async () => {
    bottomSheetRef.current?.dismiss();
    const processedUris = selectedImages.map((image) => image.uri);

    if (processedUris.length > 0) {
      router.navigate({
        pathname: "/new-post",
        params: {
          uris: JSON.stringify(processedUris),
        },
      });
    }
  }, [selectedImages, router]);

  const openCamera = useCallback(async () => {
    ImagePicker.openCamera({
      mediaType: "photo",
    })
      .then((image) => {
        bottomSheetRef.current?.dismiss();

        router.navigate({
          pathname: "/new-post",
          params: { uris: JSON.stringify([image.path]) },
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
    bottomSheetRef,
    snapPoints,
    onGalleryItemPress,
    renderNullBackdrop
  };
}


const handleImagePickerError = async (error: unknown) => {
  if (Platform.OS !== "android") return;

  if (typeof error !== 'object' || error === null) {
    console.log("Unknown error format:", error);
    return;
  }

  const pickerError = error as { code?: string; message?: string };

  const code = pickerError?.code;
  const message = (pickerError?.message || "").toLowerCase();


  if (
    code === "E_PERMISSION_MISSING" ||
    code === "E_NO_CAMERA_PERMISSION" ||
    message.includes("permission") ||
    message.includes("denied")
  ) {
    UIAlert.alert(
      "No media access",
      "To take a photo, you need to allow the app to access the photos in your phone’s Settings",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => Linking.openSettings(),
        },
      ]
    );
  } else if (code === 'E_PICKER_CANCELLED') {
    console.log("User cancelled image selection");
  } else {
    console.log("Camera/Gallery error:", error);
  }
};
