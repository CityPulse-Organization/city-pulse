import { useCallback, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { CONFIG } from "@/src/app/(tabs)/profile/new-post-image";


export const useGallerySelection = () => {
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