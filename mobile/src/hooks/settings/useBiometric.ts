import { useCallback, useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import { settingsStore } from '@/src/store/settings';
import { useStore } from 'zustand';
import { UIAlert } from '@/src/hoc';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { BiometricSupportStatus } from '@/src/types/settings';
import { checkBiometricAvailability } from '@/src/utils/settings';


export const useBiometric = () => {
    const isBiometricEnabled = useStore(settingsStore, (s) => s.isBiometricEnabled);
    const setIsBiometricEnabled = useStore(settingsStore, (s) => s.setIsBiometricEnabled);
    const { t } = useTranslation();

    const [supportStatus, setSupportStatus] = useState<BiometricSupportStatus>('checking');
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
        (async () => {
            const status = await checkBiometricAvailability();
            setSupportStatus(status);
        })();
    }, []);


    const authenticate = useCallback(async (reason: string): Promise<boolean> => {
        if (supportStatus !== 'ready') return false;

        setIsAuthenticating(true);
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: reason,
            });
            return result.success;
        } catch {
            Toast.show({
                type: 'error',
                text1: 'Biometric authentication failed',
            });
            return false;
        } finally {
            setIsAuthenticating(false);
            Toast.show({
                type: 'success',
                text1: t('biometric.authSuccess'),
            });
        }
    }, [supportStatus],
    );


    const toggleBiometric = useCallback(async () => {
        if (supportStatus === 'unavailable') {
            UIAlert.alert(
                t('biometric.unavailableTitle'),
                t('biometric.unavailableMessage'),
            );
            return;
        }

        if (supportStatus === 'not_enrolled') {
            UIAlert.alert(
                t('biometric.notEnrolledTitle'),
                Platform.OS === 'ios'
                    ? t('biometric.notEnrolledIos')
                    : t('biometric.notEnrolledAndroid'),
            );
            return;
        }

        const promptMessage = isBiometricEnabled
            ? t('biometric.disablePrompt')
            : t('biometric.enablePrompt');

        const success = await authenticate(promptMessage);
        if (success) {
            setIsBiometricEnabled(!isBiometricEnabled);
        }
    }, [supportStatus, isBiometricEnabled, authenticate, setIsBiometricEnabled]);

    return {
        isBiometricEnabled,
        supportStatus,
        isAuthenticating,
        toggleBiometric,
    };
};
