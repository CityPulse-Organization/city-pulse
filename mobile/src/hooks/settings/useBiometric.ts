import { useCallback, useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import { useSettingsStore } from '@/src/hooks/useSettingsStore';
import { UIAlert } from '@/src/hoc';



export type BiometricSupportStatus =
    | 'checking'
    | 'unavailable'
    | 'not_enrolled'
    | 'ready';



export const useBiometric = () => {
    const isBiometricEnabled = useSettingsStore((state) => state.isBiometricEnabled);
    const setIsBiometricEnabled = useSettingsStore((state) => state.setIsBiometricEnabled);

    const [supportStatus, setSupportStatus] = useState<BiometricSupportStatus>('checking');
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
        (async () => {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                setSupportStatus('unavailable');
                return;
            }

            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                setSupportStatus('not_enrolled');
                return;
            }

            setSupportStatus('ready');
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
            return false;
        } finally {
            setIsAuthenticating(false);
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
