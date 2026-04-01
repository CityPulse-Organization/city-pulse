import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UnistylesRuntime } from 'react-native-unistyles';
import type { MapStyleId } from '../app/(settings)/map-style';

export type AppTheme = 'dark' | 'light';

interface SettingsState {
    theme: AppTheme;
    mapStyle: MapStyleId;

    setTheme: (theme: AppTheme) => void;
    setMapStyle: (style: MapStyleId) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'dark',
            mapStyle: 'dark',

            setTheme: (theme) => {
                UnistylesRuntime.setTheme(theme);
                set({ theme });
            },
            setMapStyle: (mapStyle) => set({ mapStyle }),
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