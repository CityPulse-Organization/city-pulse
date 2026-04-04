import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useRouter } from 'expo-router';

import { ThemedBackground } from '../../components';
import { NavigationHeader } from '../../components/NavigationHeader';
import { UIText } from '../../ui';
import { InfoBanner } from '@/src/components/settings/InfoBanner';
import { useSettingsStore } from '@/src/hooks/useSettingsStore';
import { SelectableCard } from '@/src/components/settings/SelectableCard';
import { LanguageId } from '@/src/types/settings';
import { LANGUAGES } from '@/src/utils/settings';




export default function LanguageScreen() {
    const router = useRouter();
    const currentLanguage = useSettingsStore((s) => s.language);
    const setLanguage = useSettingsStore((s) => s.setLanguage);

    const handleSelect = useCallback((id: LanguageId) => {
        // TODO: call API to change language
        setLanguage(id);
    }, []);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const selectedOption = LANGUAGES.find((language) => language.id === currentLanguage)!;

    return (
        <ThemedBackground>
            <NavigationHeader
                title="Language"
                onLeftAction={handleBack}
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
                            isSelected={currentLanguage === option.id}
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
