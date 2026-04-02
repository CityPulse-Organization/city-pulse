import { useCallback, useState } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/src/hooks/useSettingsStore';
import { useLogout } from '../../hooks';


export const useSettings = () => {
    const router = useRouter();

    const mapStyle = useSettingsStore((state) => state.mapStyle);
    const theme = useSettingsStore((state) => state.theme);
    const setTheme = useSettingsStore((state) => state.setTheme);
    const language = useSettingsStore((state) => state.language);
    const { mutate: logout } = useLogout();


    const [isPushEnabled, setIsPushEnabled] = useState(true);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

    const isDarkMode = theme === 'dark';


    const handleBack = useCallback(() => router.back(), [router]);
    const navToMapStyle = useCallback(() => router.push('/(settings)/map-style'), [router]);
    const navToChangePassword = useCallback(() => router.push('/(settings)/change-password'), [router]);
    const navToReportProblem = useCallback(() => router.push('/(settings)/report-problem'), [router]);
    const navToRestrictedAccounts = useCallback(() => router.push('/(settings)/restricted-accounts'), [router]);
    const navToLanguage = useCallback(() => router.push('/(settings)/language'), [router]);


    const toggleTheme = useCallback(() => setTheme(isDarkMode ? 'light' : 'dark'), [isDarkMode, setTheme]);
    const togglePushEnabled = useCallback(() => setIsPushEnabled((prev) => !prev), []);
    const toggleBiometric = useCallback(() => setIsBiometricEnabled((prev) => !prev), []);
    const onLogoutPress = useCallback(() => logout(), [logout]);


    const openUrl = useCallback((url: string) => {
        Linking.openURL(url).catch(() => { });
    }, []);

    // TODO: replace with actual page URLs
    const openHelpUrl = useCallback(() => openUrl('https://citypulse.app/help'), [openUrl]);
    const openPrivacyUrl = useCallback(() => openUrl('https://citypulse.app/privacy'), [openUrl]);
    const openTermsUrl = useCallback(() => openUrl('https://citypulse.app/terms'), [openUrl]);
    const handleRateApp = useCallback(() => openUrl('https://apps.apple.com/app/idYOUR_APP_ID'), [openUrl]);

    return {
        state: { mapStyle, isDarkMode, isPushEnabled, isBiometricEnabled, language },
        actions: {
            handleBack, navToMapStyle, navToChangePassword, navToReportProblem,
            navToRestrictedAccounts, navToLanguage, openHelpUrl, openPrivacyUrl, openTermsUrl,
            handleRateApp, toggleTheme, togglePushEnabled, toggleBiometric, onLogoutPress
        }
    };
};