import { useCallback } from "react";
import {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export const useCollapsibleGallery = (previewHeight: number) => {
    const scrollY = useSharedValue(0);
    const forceRevealProgress = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
        onBeginDrag: () => {
            if (forceRevealProgress.value > 0) {
                forceRevealProgress.value = withTiming(0, { duration: 300 });
            }
        },
    });

    const revealHeader = useCallback(() => {
        forceRevealProgress.value = withTiming(1, { duration: 300 });
    }, []);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const scrollOffset = interpolate(
            scrollY.value,
            [0, previewHeight],
            [0, -previewHeight],
            Extrapolation.CLAMP,
        );

        const hiddenAmount = -scrollOffset;
        const translateY = scrollOffset + (hiddenAmount * forceRevealProgress.value);

        return {
            transform: [{ translateY }],
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
        };
    });

    const listAnimatedStyle = useAnimatedStyle(() => {
        const scrollOffset = interpolate(
            scrollY.value,
            [0, previewHeight],
            [0, -previewHeight],
            Extrapolation.CLAMP,
        );

        const hiddenAmount = -scrollOffset;
        const translateY = hiddenAmount * forceRevealProgress.value;

        return {
            transform: [{ translateY }],
            flex: 1,
        };
    });

    return {
        scrollHandler,
        headerAnimatedStyle,
        listAnimatedStyle,
        revealHeader,
    };
};