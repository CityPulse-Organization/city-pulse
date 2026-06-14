import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { settingsStore } from '@/src/store/settings';
import { useStore } from 'zustand';
import { useLogout, useDeleteAccount } from '../../hooks';
import { useBiometric } from './useBiometric';
import { useNotifications } from './useNotifications';
import { UIAlert } from '@/src/hoc';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';


export const useSettings = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const mapStyle = useStore(settingsStore, (state) => state.mapStyle);
    const theme = useStore(settingsStore, (state) => state.theme);
    const setTheme = useStore(settingsStore, (state) => state.setTheme);
    const language = useStore(settingsStore, (state) => state.language);
    const { mutate: logout } = useLogout();
    const { mutate: deleteAccountMutate, isPending: isDeletingAccount } = useDeleteAccount();


    const { isPushEnabled, togglePush } = useNotifications();

    const {
        isBiometricEnabled,
        supportStatus: biometricSupportStatus,
        isAuthenticating: isBiometricAuthenticating,
        toggleBiometric,
    } = useBiometric();

    const isDarkMode = theme === 'dark';


    const handleBack = useCallback(() => router.back(), [router]);
    const navToMapStyle = useCallback(() => router.push('/(settings)/map-style'), [router]);
    const navToChangePassword = useCallback(() => router.push('/(settings)/change-password'), [router]);
    const navToReportProblem = useCallback(() => router.push('/(settings)/report-problem'), [router]);
    const navToRestrictedAccounts = useCallback(() => router.push('/(settings)/restricted-accounts'), [router]);
    const navToLanguage = useCallback(() => router.push('/(settings)/language'), [router]);


    const toggleTheme = useCallback(() => setTheme(isDarkMode ? 'light' : 'dark'), [isDarkMode, setTheme]);
    const onLogoutPress = useCallback(() => logout(), [logout]);

    const handleDeleteAccount = useCallback(() => {
        UIAlert.alert(
            t('deleteAccount.title'),
            t('deleteAccount.message'),
            [
                { text: t('deleteAccount.cancel'), style: 'cancel' },
                {
                    text: t('deleteAccount.confirm'),
                    style: 'destructive',
                    onPress: () => {
                        deleteAccountMutate(undefined, {
                            onSuccess: () => {
                                Toast.show({
                                    type: 'success',
                                    text1: t('deleteAccount.successTitle'),
                                    text2: t('deleteAccount.successMessage'),
                                });
                            },
                            onError: () => {
                                Toast.show({
                                    type: 'error',
                                    text1: t('deleteAccount.errorTitle'),
                                    text2: t('deleteAccount.errorMessage'),
                                });
                            },
                        });
                    },
                },
            ],
        );
    }, [deleteAccountMutate, t]);


    const openUrl = useCallback((url: string) => {
        Linking.openURL(url).catch(() => { });
    }, []);

    // TODO: replace with actual page URLs
    const openHelpUrl = useCallback(() => openUrl('https://citypulse.app/help'), [openUrl]);
    const openPrivacyUrl = useCallback(() => openUrl('https://citypulse.app/privacy'), [openUrl]);
    const openTermsUrl = useCallback(() => openUrl('https://citypulse.app/terms'), [openUrl]);
    const handleRateApp = useCallback(() => openUrl('https://apps.apple.com/app/idYOUR_APP_ID'), [openUrl]);

    return {
        state: { mapStyle, isDarkMode, isPushEnabled, isBiometricEnabled, isBiometricAuthenticating, biometricSupportStatus, language },
        actions: {
            handleBack, navToMapStyle, navToChangePassword, navToReportProblem,
            navToRestrictedAccounts, navToLanguage, openHelpUrl, openPrivacyUrl, openTermsUrl,
            handleRateApp, toggleTheme, togglePush, toggleBiometric, onLogoutPress,
            handleDeleteAccount,
        }
    };
};