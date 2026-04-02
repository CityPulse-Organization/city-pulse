import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedBackground } from '../../components';
import { NavigationHeader } from '../../components/NavigationHeader';
import { UIText } from '../../ui';
import { InfoBanner } from '@/src/components/settings/InfoBanner';
import { useSettingsStore } from '@/src/hooks/useSettingsStore';
import { SelectableCard } from '@/src/components/settings/SelectableCard';




export type LanguageId =
    | 'en'
    | 'uk'
    | 'de'
    | 'fr'
    | 'es'
    | 'pl'
    | 'it'
    | 'pt'
    | 'ru';

export type LanguageOption = {
    id: LanguageId;
    label: string;
    nativeLabel: string;
    flag: string;
    region: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
};



const LANGUAGES: LanguageOption[] = [
    {
        id: 'en',
        label: 'English',
        nativeLabel: 'English',
        flag: '🇺🇸',
        region: 'United States',
        icon: 'globe-outline',
    },
    {
        id: 'uk',
        label: 'Ukrainian',
        nativeLabel: 'Українська',
        flag: '🇺🇦',
        region: 'Ukraine',
        icon: 'globe-outline',
    },
    {
        id: 'de',
        label: 'German',
        nativeLabel: 'Deutsch',
        flag: '🇩🇪',
        region: 'Germany',
        icon: 'globe-outline',
    },
    {
        id: 'fr',
        label: 'French',
        nativeLabel: 'Français',
        flag: '🇫🇷',
        region: 'France',
        icon: 'globe-outline',
    },
    {
        id: 'es',
        label: 'Spanish',
        nativeLabel: 'Español',
        flag: '🇪🇸',
        region: 'Spain',
        icon: 'globe-outline',
    },
    {
        id: 'pl',
        label: 'Polish',
        nativeLabel: 'Polski',
        flag: '🇵🇱',
        region: 'Poland',
        icon: 'globe-outline',
    },
    {
        id: 'it',
        label: 'Italian',
        nativeLabel: 'Italiano',
        flag: '🇮🇹',
        region: 'Italy',
        icon: 'globe-outline',
    },
    {
        id: 'pt',
        label: 'Portuguese',
        nativeLabel: 'Português',
        flag: '🇵🇹',
        region: 'Portugal',
        icon: 'globe-outline',
    },
    {
        id: 'ru',
        label: 'Russian',
        nativeLabel: 'Русский',
        flag: '🇷🇺',
        region: 'Russia',
        icon: 'globe-outline',
    },
];



export default function LanguageScreen() {
    const router = useRouter();
    const language = useSettingsStore((s) => s.language);
    const setLanguage = useSettingsStore((s) => s.setLanguage);

    const [selected, setSelected] = useState<LanguageId>(language);

    useEffect(() => {
        setSelected(language);
    }, [language]);

    const handleSelect = useCallback((id: LanguageId) => {
        setSelected(id);
    }, []);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const handleApply = useCallback(() => {
        setLanguage(selected);
        router.back();
    }, [router, selected, setLanguage]);

    const selectedOption = LANGUAGES.find((l) => l.id === selected)!;

    return (
        <ThemedBackground>
            <NavigationHeader
                title="Language"
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
                    icon="language-outline"
                    text="Choose the display language for the app. This affects menus, buttons, and other interface text."
                />

                <View style={styles.grid}>
                    {LANGUAGES.map((option) => (
                        <SelectableCard
                            key={option.id}
                            isSelected={selected === option.id}
                            onSelect={handleSelect}
                            previewContent={<UIText size="extraLarge">{option.flag}</UIText>}
                            id={option.id}
                            title={option.label}
                            description={`${option.nativeLabel} · ${option.region}`}
                            iconName={option.icon}
                        />
                    ))}
                </View>

                <View style={styles.activeCard}>
                    <View style={styles.activeCardHeader}>
                        <UIText size="xl" style={styles.activeCardFlag}>
                            {selectedOption.flag}
                        </UIText>
                        <UIText size="sm" weight="bold" style={styles.activeCardTitle}>
                            {selectedOption.label} — Currently selected
                        </UIText>
                    </View>
                    <UIText size="xs" style={styles.activeCardDesc}>
                        {selectedOption.nativeLabel} · {selectedOption.region}
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
        gap: theme.utils.vs(6),
    },
    activeCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.utils.s(10),
    },
    activeCardFlag: {
        lineHeight: theme.utils.ms(28),
    },
    activeCardTitle: {
        color: theme.colors.primaryText,
        flex: 1,
    },
    activeCardDesc: {
        color: theme.colors.muted,
        lineHeight: 20,
    },
}));
