import { UIImage, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, {
    memo,
    useCallback,
    useRef,
    useState,
} from "react";
import { FlatList, View, ViewToken } from "react-native";
import { StyleSheet } from "react-native-unistyles";




// TODO: https://rn-carousel.dev/
export const ImagesCarousel = memo(({ imagesUrl, location }: { imagesUrl: string[], location: string }) => {
    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
    const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

    const handleViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0) {
                setActiveCarouselIndex(viewableItems[0].index ?? 0);
            }
        },
    ).current;

    const renderCarouselSlide = useCallback(
        ({ item: imageUrl }: { item: string }) => (
            <View style={styles.carouselSlide}>
                <UIImage
                    imageUrl={imageUrl}
                    isAspectRatio={false}
                    style={styles.headerImage}
                />
            </View>
        ),
        [],
    );

    const keyExtractor = useCallback((imageUrl: string) => imageUrl, []);

    return (
        <View style={styles.imageContainer}>
            <FlatList
                data={imagesUrl}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={keyExtractor}
                viewabilityConfig={viewConfigRef.current}
                onViewableItemsChanged={handleViewableItemsChanged}
                renderItem={renderCarouselSlide}
            />

            <LinearGradient
                colors={[
                    styles.gradientStop0.backgroundColor,
                    styles.gradientStop1.backgroundColor,
                    styles.gradientStop2.backgroundColor,
                ] as any}
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

            {imagesUrl.length > 1 && (
                <View style={styles.carouselFooter} pointerEvents="none">
                    <View style={styles.dotsRow}>
                        {imagesUrl.map((imageUrl, index) => (
                            <View
                                key={imageUrl}
                                style={[
                                    styles.dot,
                                    index === activeCarouselIndex ? styles.dotActive : styles.dotInactive,
                                ]}
                            />
                        ))}
                    </View>
                </View>
            )}
        </View>
    )
})



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
        bottom: theme.utils.vs(40),
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
        position: "absolute",
        bottom: theme.utils.vs(20),
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.utils.s(8),
    },
    dotsRow: {
        flexDirection: "row",
        gap: theme.utils.s(6),
    },
    dot: {
        height: theme.utils.vs(6),
        borderRadius: 999,
    },
    dotActive: {
        width: theme.utils.s(22),
        backgroundColor: theme.colors.mutedAccent,
    },
    dotInactive: {
        width: theme.utils.s(6),
        backgroundColor: theme.colors.muted,
    }
}));