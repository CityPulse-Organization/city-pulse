import {
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import { useSharedValue } from "react-native-reanimated";
import { ICarouselInstance } from "react-native-reanimated-carousel";

export const useImageCarousel = (imagesUrl: string[]) => {
    const [visible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const carouselRef = useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);


    const formattedImages = useMemo(() => imagesUrl.map((url) => ({ uri: url })), [imagesUrl]);
    const paginationData = useMemo(() => imagesUrl.map((url) => ({ color: url })), [imagesUrl]);


    const onPressPagination = useCallback((index: number) => {
        carouselRef.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    }, []);

    const onPressImage = useCallback((index: number) => {
        setCurrentIndex(index);
        setIsVisible(true);
    }, []);

    const onPressClose = useCallback((imageIndex: number) => {
        setIsVisible(false);
        onPressPagination(imageIndex);
    }, [onPressPagination]);

    const handleCloseGallery = useCallback(() => {
        setIsVisible(false);
    }, []);

    return {
        visible,
        currentIndex,
        carouselRef,
        progress,
        formattedImages,
        paginationData,
        onPressPagination,
        onPressImage,
        onPressClose,
        handleCloseGallery
    };
}