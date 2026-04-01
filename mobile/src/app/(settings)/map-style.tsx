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
import { MapStyleCard } from '@/src/components/settings/MapStyleCard';
import { useSettingsStore } from '@/src/hooks/useSettingsStore';


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
                <UIText size="xs" style={styles.subtitle}>
                    Choose how the map looks across the whole app. Switching to a light
                    style helps readability in bright sunlight.
                </UIText>
                <View style={styles.grid}>
                    {MAP_STYLES.map((option) => (
                        <MapStyleCard
                            key={option.id}
                            option={option}
                            isSelected={selected === option.id}
                            onSelect={handleSelect}
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
}));
