import { useCallback } from 'react';
import { ScrollView, View } from 'react-native';

import { StyleSheet } from 'react-native-unistyles';
import { useRouter } from 'expo-router';

import { ThemedBackground } from '../../components';
import { NavigationHeader } from '../../components/NavigationHeader';
import { InfoBanner } from '@/src/components/settings/InfoBanner';
import { settingsStore } from '@/src/store/settings';
import { useStore } from 'zustand';
import { LanguageId } from '@/src/types/settings';
import { LANGUAGES } from '@/src/utils/settings';
import { LanguageRow } from '@/src/components/settings/LanguageRow';



export default function LanguageScreen() {
    const router = useRouter();
    const currentLanguage = useStore(settingsStore, (s) => s.language);
    const setLanguage = useStore(settingsStore, (s) => s.setLanguage);

    const handleSelect = useCallback((id: LanguageId) => {
        setLanguage(id);
    }, []);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

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

                <View style={styles.listCard}>
                    {LANGUAGES.map((option, index) => (
                        <LanguageRow
                            key={option.id}
                            option={option}
                            isSelected={currentLanguage === option.id}
                            onSelect={handleSelect}
                            isLast={index === LANGUAGES.length - 1}
                        />
                    ))}
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
        gap: theme.utils.vs(16),
    },

    listCard: {
        backgroundColor: theme.colors.backgroundSubtle,
        borderRadius: theme.utils.ms(16),
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        overflow: 'hidden',
    }
}));
