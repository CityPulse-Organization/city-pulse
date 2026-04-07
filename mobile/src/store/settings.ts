import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UnistylesRuntime } from 'react-native-unistyles';
import type { MapStyleId, LanguageId } from '@/src/types/settings';

export type AppTheme = 'dark' | 'light';

interface SettingsState {
    theme: AppTheme;
    mapStyle: MapStyleId;
    language: LanguageId;
    isBiometricEnabled: boolean;

    setTheme: (theme: AppTheme) => void;
    toggleTheme: () => void;
    setMapStyle: (style: MapStyleId) => void;
    setLanguage: (language: LanguageId) => void;
    setIsBiometricEnabled: (enabled: boolean) => void;
}

export const settingsStore = createStore<SettingsState>()(
    persist(
        (set) => ({
            theme: 'dark',
            mapStyle: 'dark',
            language: 'en',
            isBiometricEnabled: false,

            setTheme: (theme) => {
                UnistylesRuntime.setTheme(theme);
                set({ theme });
            },

            toggleTheme: () => {
                const nextTheme = settingsStore.getState().theme === 'dark' ? 'light' : 'dark';
                UnistylesRuntime.setTheme(nextTheme);
                set({ theme: nextTheme });
            },

            setMapStyle: (mapStyle) => set({ mapStyle }),
            setLanguage: (language) => set({ language }),
            setIsBiometricEnabled: (isBiometricEnabled) => set({ isBiometricEnabled }),
        }),
        {
            name: 'app-settings-storage',
            storage: createJSONStorage(() => AsyncStorage),

            onRehydrateStorage: () => (state, error) => {
                if (state && !error) {
                    UnistylesRuntime.setTheme(state.theme);
                }
            },
        }
    )
);