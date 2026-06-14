import React, { useCallback } from 'react';
import {
    ScrollView,
    View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedBackground } from '../../components';
import { NavigationHeader } from '../../components/NavigationHeader';
import { UIText } from '../../ui';
import { settingsStore } from '@/src/store/settings';
import { useStore } from 'zustand';
import { InfoBanner } from '@/src/components/settings/InfoBanner';
import { SelectableCard } from '@/src/components/settings/SelectableCard';
import { MapStyleId } from '@/src/types/settings';
import { MAP_STYLES } from '@/src/utils/settings';
import { useTranslation } from 'react-i18next';





export default function MapStyleScreen() {
    const router = useRouter();
    const currentMapStyle = useStore(settingsStore, (state) => state.mapStyle);
    const setMapStyle = useStore(settingsStore, (state) => state.setMapStyle);
    const { t } = useTranslation();


    const handleSelect = useCallback((id: MapStyleId) => {
        setMapStyle(id);
        // TODO: logic to change map style
    }, [setMapStyle]);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);


    const selectedOption = MAP_STYLES.find((mapStyle) => mapStyle.id === currentMapStyle)!;

    return (
        <ThemedBackground>
            <NavigationHeader
                title={t('mapStyleScreen.title')}
                onLeftAction={handleBack}
            />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <InfoBanner
                    text={t('mapStyleScreen.banner')}
                    icon="map"
                />

                <View style={styles.grid}>
                    {MAP_STYLES.map((option) => (
                        <SelectableCard
                            key={option.id}
                            isSelected={currentMapStyle === option.id}
                            onSelect={handleSelect}
                            previewContent={<MapPreviewTile gradient={option.previewGradient} accentColor={option.accentColor} />}
                            id={option.id}
                            title={t(`mapStyles.${option.id}.label`)}
                            description={t(`mapStyles.${option.id}.description`)}
                            iconName={option.icon}
                        />
                    ))}
                </View>

                <View style={styles.activeCard}>
                    <View style={styles.activeCardHeader}>
                        <LinearGradient
                            colors={selectedOption.previewGradient}
                            style={styles.activeCardGradientDot}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                        <UIText size="sm" weight="bold" style={styles.activeCardTitle}>
                        {t('mapStyleScreen.currentlySelected', { style: selectedOption.label })}
                        </UIText>
                    </View>
                    <UIText size="xs" style={styles.activeCardDesc}>
                        {selectedOption.description}
                    </UIText>
                </View>
            </ScrollView>
        </ThemedBackground>
    );
}


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
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: theme.utils.s(16),
        paddingBottom: theme.utils.vs(48),
        paddingTop: theme.utils.vs(8),
        gap: theme.utils.vs(20),
    },

    subtitle: {
        color: theme.colors.muted,
        lineHeight: 20,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.utils.s(12),
        justifyContent: 'space-between',
    },

    activeCard: {
        backgroundColor: theme.colors.backgroundSubtle,
        borderRadius: theme.utils.ms(14),
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        padding: theme.utils.s(16),
        gap: theme.utils.vs(8),
    },
    activeCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.utils.s(10),
    },
    activeCardGradientDot: {
        width: theme.utils.s(20),
        height: theme.utils.s(20),
        borderRadius: 99,
    },
    activeCardTitle: {
        color: theme.colors.primaryText,
    },
    activeCardDesc: {
        color: theme.colors.muted,
        lineHeight: 20,
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
