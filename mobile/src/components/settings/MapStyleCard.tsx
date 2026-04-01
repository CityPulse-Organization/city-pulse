import React, { useCallback, useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    Pressable,
    View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { UIText } from '../../ui';
import { LinearGradient } from 'expo-linear-gradient';
import { MapStyleId, MapStyleOption } from '@/src/app/(settings)/map-style';


type MapStyleCardProps = {
    option: MapStyleOption;
    isSelected: boolean;
    onSelect: (id: MapStyleId) => void;
};

export const MapStyleCard = ({ option, isSelected, onSelect }: MapStyleCardProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const checkScale = useRef(new Animated.Value(isSelected ? 1 : 0)).current;
    const ringOpacity = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

    const handlePress = useCallback(() => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.96,
                duration: 80,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
        ]).start();

        onSelect(option.id);
    }, [onSelect, option.id, scaleAnim]);


    useEffect(() => {
        Animated.parallel([
            Animated.spring(checkScale, {
                toValue: isSelected ? 1 : 0,
                friction: 4,
                tension: 200,
                useNativeDriver: true,
            }),
            Animated.timing(ringOpacity, {
                toValue: isSelected ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isSelected, checkScale, ringOpacity]);

    return (
        <Pressable onPress={handlePress} style={styles.pressable}>
            <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
                <Animated.View
                    style={[
                        styles.accentRing,
                        { opacity: ringOpacity },
                    ]}
                    pointerEvents="none"
                />

                <View style={styles.previewContainer}>
                    <MapPreviewTile
                        gradient={option.previewGradient}
                        accentColor={option.accentColor}
                    />

                    <Animated.View
                        style={[
                            styles.checkBadge,
                            { transform: [{ scale: checkScale }], opacity: checkScale },
                        ]}
                    >
                        <Ionicons
                            name="checkmark"
                            size={styles.iconCheckBadge.height}
                            color={styles.iconCheckBadge.color}
                        />
                    </Animated.View>
                </View>

                <View style={styles.info}>
                    <View style={styles.labelRow}>
                        <Ionicons
                            name={option.icon}
                            size={styles.iconLabel.height}
                            color={isSelected ? styles.selectedIconLabel.color : styles.iconLabel.color}
                        />
                        <UIText
                            size="sm"
                            weight="bold"
                            style={[
                                styles.label,
                                isSelected && styles.labelSelected,
                            ]}
                        >
                            {option.label}
                        </UIText>
                    </View>
                    <UIText size="xxs" style={styles.description} numberOfLines={2}>
                        {option.description}
                    </UIText>
                </View>
            </Animated.View>
        </Pressable>
    );
};



const MapPreviewTile = ({ gradient, accentColor }: {
    gradient: readonly [string, string, ...string[]];
    accentColor: string;
}) => (
    <LinearGradient colors={gradient} style={styles.tile} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <HorizontalRoads accentColor={accentColor} />
        <VerticalRoad accentColor={accentColor} />
        <CityBlocks accentColor={accentColor} />
        <CityPulseDot />
    </LinearGradient>
);

const HorizontalRoads = ({ accentColor }: { accentColor: string }) => (
    <>
        <View style={[styles.road, styles.roadH1, { backgroundColor: accentColor }]} />
        <View style={[styles.road, styles.roadH2, { backgroundColor: accentColor }]} />
    </>
);

const VerticalRoad = ({ accentColor }: { accentColor: string }) => (
    <View style={[styles.road, styles.roadV1, { backgroundColor: accentColor }]} />
);

const CityBlocks = ({ accentColor }: { accentColor: string }) => (
    <>
        <View style={[styles.block, styles.block1, { backgroundColor: accentColor }]} />
        <View style={[styles.block, styles.block2, { backgroundColor: accentColor }]} />
        <View style={[styles.block, styles.block3, { backgroundColor: accentColor }]} />
    </>
);

const CityPulseDot = () => (
    <View style={styles.pulseDot} />
);





const styles = StyleSheet.create((theme) => ({
    pressable: {
        width: '48%',
    },
    card: {
        borderRadius: theme.utils.ms(16),
        backgroundColor: theme.colors.backgroundSubtle,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        overflow: 'hidden',
    },

    accentRing: {
        position: 'absolute',
        inset: 0,
        borderRadius: theme.utils.ms(16),
        borderWidth: 2,
        borderColor: theme.colors.lightAccent,
        zIndex: 10,
    },
    previewContainer: {
        height: theme.utils.vs(110),
        margin: theme.utils.s(8),
        borderRadius: theme.utils.ms(10),
        overflow: 'hidden',
    },
    checkBadge: {
        position: 'absolute',
        top: theme.utils.s(7),
        right: theme.utils.s(7),
        width: theme.utils.s(22),
        height: theme.utils.s(22),
        borderRadius: 99,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCheckBadge: {
        height: theme.utils.vs(16),
        color: theme.colors.white,
    },


    info: {
        paddingHorizontal: theme.utils.s(10),
        paddingBottom: theme.utils.vs(12),
        gap: theme.utils.vs(4),
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.utils.s(5),
    },

    iconLabel: {
        height: theme.utils.vs(16),
        color: theme.colors.muted,
    },
    selectedIconLabel: {
        color: theme.colors.lightAccent,
    },

    label: {
        color: theme.colors.muted,
    },
    labelSelected: {
        color: theme.colors.lightAccent,
    },

    description: {
        color: theme.colors.muted,
        lineHeight: 16,
    },


    tile: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },

    road: {
        position: 'absolute',
        borderRadius: 2,
    },

    roadH1: {
        top: '30%',
        left: 0,
        right: 0,
        height: 2,
    },
    roadH2: {
        top: '65%',
        left: 0,
        right: 0,
        height: 1,
    },

    roadV1: {
        left: '45%',
        top: 0,
        bottom: 0,
        width: 2,
    },

    block: {
        position: 'absolute',
        borderRadius: 3,
        opacity: 0.7,
    },
    block1: {
        top: '10%',
        left: '10%',
        width: '28%',
        height: '16%',
    },
    block2: {
        top: '40%',
        left: '55%',
        width: '32%',
        height: '20%',
    },
    block3: {
        top: '72%',
        left: '10%',
        width: '22%',
        height: '14%',
    },

    pulseDot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.lightAccent,
        top: '28%',
        left: '43%',
    },
}));