import { Photo } from "@/src/app/(tabs)/profile/new-post-image";
import { NEW_POST_IMAGE_CONFIG } from "@/src/utils/newPostImageUtils";
import { useCallback, useState } from "react";



export const useGallerySelection = () => {
  const [selectedImages, setSelectedImages] = useState<Photo[]>([]);
  const [previewImage, setPreviewImage] = useState<Photo | null>(null);
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
    (item: Photo) => {
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
          if (prevSelected.length < NEW_POST_IMAGE_CONFIG.MAX_SELECTION) {
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