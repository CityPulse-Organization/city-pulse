import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UnistylesRuntime } from 'react-native-unistyles';
import { Appearance, Platform } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import * as NavigationBar from 'expo-navigation-bar';
import type { MapStyleId, LanguageId } from '@/src/types/settings';
import i18n from '@/src/config/i18n';

export type AppTheme = 'dark' | 'light';

const THEME_BG: Record<AppTheme, string> = {
    dark: 'rgba(12, 12, 12, 1)',
    light: 'rgba(240, 240, 242, 1)',
};

/** Sync all native platform elements with the current theme */
const syncNativeTheme = (theme: AppTheme) => {
    // Sync RN color scheme — affects native modals, alerts, keyboards
    Appearance.setColorScheme(theme);

    // Sync root view background — prevents white flash on transitions
    SystemUI.setBackgroundColorAsync(THEME_BG[theme]);

    // Sync Android navigation bar
    if (Platform.OS === 'android') {
        NavigationBar.setBackgroundColorAsync(THEME_BG[theme]);
        NavigationBar.setButtonStyleAsync(theme === 'dark' ? 'light' : 'dark');
    }
};

interface SettingsState {
    theme: AppTheme;
    mapStyle: MapStyleId;
    language: LanguageId;
    isBiometricEnabled: boolean;
    isPushEnabled: boolean;

    setTheme: (theme: AppTheme) => void;
    setMapStyle: (style: MapStyleId) => void;
    setLanguage: (language: LanguageId) => void;
    setIsBiometricEnabled: (enabled: boolean) => void;
    setIsPushEnabled: (enabled: boolean) => void;
}

export const settingsStore = createStore<SettingsState>()(
    persist(
        (set) => ({
            theme: 'dark',
            mapStyle: 'dark',
            language: 'en',
            isBiometricEnabled: false,
            isPushEnabled: false,

            setTheme: (theme) => {
                UnistylesRuntime.setTheme(theme);
                syncNativeTheme(theme);
                set({ theme });
            },
            setMapStyle: (mapStyle) => set({ mapStyle }),
            setLanguage: (language) => {
                i18n.changeLanguage(language);
                set({ language });
            },
            setIsBiometricEnabled: (isBiometricEnabled) => set({ isBiometricEnabled }),
            setIsPushEnabled: (isPushEnabled) => set({ isPushEnabled }),
        }),
        {
            name: 'app-settings-storage',
            storage: createJSONStorage(() => AsyncStorage),

            onRehydrateStorage: () => (state, error) => {
                if (state && !error) {
                    UnistylesRuntime.setTheme(state.theme);
                    syncNativeTheme(state.theme);
                    i18n.changeLanguage(state.language);
                }
            },
        }
    )
);