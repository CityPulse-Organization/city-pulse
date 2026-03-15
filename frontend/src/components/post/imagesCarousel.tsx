import { UIImage, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, {
    memo,
    useCallback,
    useRef,
} from "react";
import { View, Dimensions } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Carousel, { TAnimationStyle, ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import Animated, { interpolate, interpolateColor, SharedValue, useAnimatedStyle, useSharedValue, Extrapolation } from "react-native-reanimated";



const PAGE_WIDTH = Dimensions.get("window").width;

export const ImagesCarousel = memo(({ imagesUrl, location }: { imagesUrl: string[], location: string }) => {
    const ref = useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);

    const renderCarouselSlide = useCallback(
        ({ item: imageUrl, index, animationValue }: { item: string, index: number, animationValue: any }) => (
            <CustomItem
                key={index}
                animationValue={animationValue}
            >
                <View style={styles.carouselSlide}>
                    <UIImage
                        imageUrl={imageUrl}
                        isAspectRatio={false}
                        style={styles.headerImage}
                    />
                </View>
            </CustomItem>
        ),
        [],
    );

    const animationStyle: TAnimationStyle = React.useCallback(
        (value: number, index: number) => {
            "worklet";

            const zIndex = interpolate(
                value,
                value > 0 ? [0, 1] : [-1, 0],
                value > 0 ? [10, 20] : [-10, 0],
                Extrapolation.CLAMP,
            );
            const translateX = interpolate(
                value,
                [-2, 0, 1],
                [-PAGE_WIDTH * 0.5, 0, PAGE_WIDTH],
            );

            return {
                transform: [{ translateX }],
                zIndex,
            };
        },
        [],
    );


    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };

    return (
        <View style={styles.imageContainer}>
            <Carousel
                ref={ref}
                data={imagesUrl}
                onProgressChange={progress}
                loop={false}
                width={PAGE_WIDTH}
                scrollAnimationDuration={1200}
                customAnimation={animationStyle}
                renderItem={renderCarouselSlide}
            />

            <Pagination.Basic<{ color: string }>
                progress={progress}
                data={imagesUrl.map((url) => ({ color: url }))}
                dotStyle={styles.dot}
                activeDotStyle={styles.dotActive}
                containerStyle={styles.carouselFooter}
                horizontal
                onPress={onPressPagination}
            />

            <LinearGradient
                colors={[
                    styles.gradientStop0.backgroundColor,
                    styles.gradientStop1.backgroundColor,
                    styles.gradientStop2.backgroundColor,
                ]}
                locations={[0, 0.6, 1]}
                style={styles.gradient}
                pointerEvents="none"
            />

            {location ? (
                <View style={styles.locationContainer} pointerEvents="none">
                    <Ionicons
                        name="location-outline"
                        size={styles.locationIcon.height}
                        color={styles.locationIcon.color}
                    />
                    <UIText size="sm" style={styles.locationText}>
                        {location}
                    </UIText>
                </View>
            ) : null}
        </View>
    )
})


type CustomItemProps = {
    animationValue: SharedValue<number>;
    children?: React.ReactNode;
}

const CustomItem: React.FC<CustomItemProps> = ({ animationValue, children }) => {
    const maskStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            animationValue.value,
            [-1, 0, 1],
            ["#000000dd", "transparent", "#000000dd"]
        );

        return {
            backgroundColor,
        };
    }, [animationValue]);

    return (
        <View style={{ flex: 1 }}>
            {children}
            <Animated.View
                pointerEvents="none"
                style={[
                    {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    },
                    maskStyle,
                ]}
            />
        </View>
    );
};


const styles = StyleSheet.create((theme, rt) => ({
    imageContainer: {
        width: "100%",
        height: theme.utils.vs(440),
        position: "relative",
    },
    carouselSlide: {
        width: rt.screen.width,
        height: theme.utils.vs(440),
    },
    headerImage: {
        width: "100%",
        height: "100%",
    },

    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    gradientStop0: { backgroundColor: theme.colors.gradientOverlay[0] },
    gradientStop1: { backgroundColor: theme.colors.gradientOverlay[1] },
    gradientStop2: { backgroundColor: theme.colors.gradientOverlay[2] },

    locationContainer: {
        position: "absolute",
        bottom: theme.utils.vs(20),
        left: theme.utils.s(16),
        flexDirection: "row",
        alignItems: "center",
        gap: theme.utils.s(6),
        borderWidth: 1,
        backgroundColor: theme.colors.backgroundOverlay,
        borderColor: theme.colors.mutedAccent,
        borderRadius: 999,
        paddingHorizontal: theme.utils.s(12),
        paddingVertical: theme.utils.vs(6),
    },
    locationIcon: {
        height: theme.utils.s(14),
        color: theme.colors.accent,
    },
    locationText: {
        color: theme.colors.accent,
    },

    carouselFooter: {
        gap: theme.utils.s(8),
    },
    dot: {
        borderRadius: 100,
        backgroundColor: theme.colors.muted,
        width: theme.utils.s(10),
        height: theme.utils.s(10),
    },
    dotActive: {
        borderRadius: 100,
        overflow: "hidden",
        backgroundColor: theme.colors.mutedAccent,
    },
}));