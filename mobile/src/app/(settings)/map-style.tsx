import React, { useCallback, useState, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '@/src/hooks/useSettingsStore';
import { InfoBanner } from '@/src/components/settings/InfoBanner';
import { SelectableCard } from '@/src/components/settings/SelectableCard';


export type MapStyleId = 'dark' | 'light' | 'satellite' | 'terrain';

export type MapStyleOption = {
    id: MapStyleId;
    label: string;
    description: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    previewGradient: readonly [string, string, ...string[]];
    accentColor: string;
};

const MAP_STYLES: MapStyleOption[] = [
    {
        id: 'dark',
        label: 'Dark',
        description: 'Minimalist dark canvas — ideal for night-time city navigation.',
        icon: 'moon',
        previewGradient: ['#0f0f1a', '#1a1a2e', '#16213e'],
        accentColor: 'rgba(199, 180, 253, 0.55)',
    },
    {
        id: 'light',
        label: 'Light',
        description: 'Clean, high-contrast view for daytime use.',
        icon: 'sunny',
        previewGradient: ['#e8eaf6', '#f3f4f6', '#dde1f0'],
        accentColor: 'rgba(100, 60, 180, 0.4)',
    },
    {
        id: 'satellite',
        label: 'Satellite',
        description: 'Real aerial imagery for precise location awareness.',
        icon: 'earth',
        previewGradient: ['#1b3a2d', '#2d5a3e', '#1a4a35'],
        accentColor: 'rgba(120, 220, 150, 0.4)',
    },
    {
        id: 'terrain',
        label: 'Terrain',
        description: 'Topographic layer — great for outdoor events and hiking.',
        icon: 'trail-sign',
        previewGradient: ['#2d3a1e', '#4a5e2b', '#3a4e24'],
        accentColor: 'rgba(180, 220, 100, 0.4)',
    },
];



export default function MapStyleScreen() {
    const router = useRouter();
    const mapStyle = useSettingsStore((state) => state.mapStyle);
    const setMapStyle = useSettingsStore((state) => state.setMapStyle);
    const [selected, setSelected] = useState<MapStyleId>(mapStyle);

    useEffect(() => {
        setSelected(mapStyle);
    }, [mapStyle]);

    const handleSelect = useCallback((id: MapStyleId) => {
        setSelected(id);
    }, []);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const handleApply = useCallback(() => {
        setMapStyle(selected);
        router.back();
    }, [router, selected, setMapStyle]);

    const selectedOption = MAP_STYLES.find((s) => s.id === selected)!;

    return (
        <ThemedBackground>
            <NavigationHeader
                title="Map Style"
                rightActionLabel="Apply"
                onLeftAction={handleBack}
                onRightAction={handleApply}
            />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <InfoBanner
                    text="Choose how the map looks across the whole app. Switching to a light style helps readability in bright sunlight."
                    icon="map"
                />

                <View style={styles.grid}>
                    {MAP_STYLES.map((option) => (
                        <SelectableCard
                            key={option.id}
                            isSelected={selected === option.id}
                            onSelect={handleSelect}
                            previewContent={<MapPreviewTile gradient={option.previewGradient} accentColor={option.accentColor} />}
                            id={option.id}
                            title={option.label}
                            description={option.description}
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
                            {selectedOption.label} — Currently selected
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
