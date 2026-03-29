import { Photo } from "@/src/app/(tabs)/profile/new-post-image";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef } from "react";

export const useGalleryBottomSheet = (handleSelectImage: (item: Photo) => void) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ["45%", "90%"], []);

    useFocusEffect(
        useCallback(() => {
            bottomSheetRef.current?.present();
            return () => {
                bottomSheetRef.current?.dismiss();
            };
        }, [])
    );

    const onGalleryItemPress = useCallback((item: Photo) => {
        handleSelectImage(item);
        bottomSheetRef.current?.snapToIndex(0);
    }, [handleSelectImage]);

    const renderNullBackdrop = useCallback(() => null, []);

    return {
        bottomSheetRef,
        snapPoints,
        onGalleryItemPress,
        renderNullBackdrop,
    };
};