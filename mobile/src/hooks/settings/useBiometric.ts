import { useCallback, useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import { settingsStore } from '@/src/store/settings';
import { useStore } from 'zustand';
import { UIAlert } from '@/src/hoc';
import Toast from 'react-native-toast-message';
import { BiometricSupportStatus } from '@/src/types/settings';
import { checkBiometricAvailability } from '@/src/utils/settings';


export const useBiometric = () => {
    const isBiometricEnabled = useStore(settingsStore, (state) => state.isBiometricEnabled);
    const setIsBiometricEnabled = useStore(settingsStore, (state) => state.setIsBiometricEnabled);

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
                text1: 'Biometric authentication successful',
            });
        }
    }, [supportStatus],
    );


    const toggleBiometric = useCallback(async () => {
        if (supportStatus === 'unavailable') {
            UIAlert.alert(
                'Biometrics Unavailable',
                'Your device does not have compatible biometric hardware.',
            );
            return;
        }

        if (supportStatus === 'not_enrolled') {
            UIAlert.alert(
                'No Biometrics Enrolled',
                Platform.OS === 'ios'
                    ? 'Please set up Face ID or Touch ID in your iPhone Settings.'
                    : 'Please enroll a fingerprint or face in your device Settings.',
            );
            return;
        }

        const promptMessage = isBiometricEnabled
            ? 'Authenticate to disable biometric unlock'
            : 'Authenticate to enable biometric unlock';

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
