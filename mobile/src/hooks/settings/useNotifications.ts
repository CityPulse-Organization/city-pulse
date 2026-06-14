import { useCallback, useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { settingsStore } from '@/src/store/settings';
import { useStore } from 'zustand';
import Toast from 'react-native-toast-message';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});


export const useNotifications = () => {
    const isPushEnabled = useStore(settingsStore, (s) => s.isPushEnabled);
    const setIsPushEnabled = useStore(settingsStore, (s) => s.setIsPushEnabled);

    // On mount, check if the permission is still granted.
    // If the user revoked it from system settings, sync the store.
    useEffect(() => {
        (async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted' && isPushEnabled) {
                setIsPushEnabled(false);
            }
        })();
    }, []);


    const togglePush = useCallback(async () => {
        if (isPushEnabled) {
            // User wants to turn OFF notifications.
            // On iOS/Android we cannot revoke permission from code.
            // Guide the user to system settings.
            setIsPushEnabled(false);
            Toast.show({
                type: 'info',
                text1: 'Notifications disabled',
                text2: 'To fully disable, go to your device Settings.',
            });
            return;
        }

        // User wants to turn ON notifications.
        const { status: existingStatus } = await Notifications.getPermissionsAsync();

        if (existingStatus === 'granted') {
            // Permission already granted, just flip the switch.
            setIsPushEnabled(true);
            return;
        }

        // Request permission
        const { status } = await Notifications.requestPermissionsAsync();

        if (status === 'granted') {
            setIsPushEnabled(true);

            // Get the push token (can be sent to backend later)
            try {
                const token = await Notifications.getExpoPushTokenAsync({
                    projectId: Constants.expoConfig?.extra?.eas?.projectId
                });
                console.log('[Push] Expo push token:', token.data);
                // TODO: send token to backend via API if needed
            } catch (err) {
                console.warn('[Push] Failed to get push token:', err);
            }
        } else if (status === 'denied') {
            // Permission was denied — guide user to settings
            Toast.show({
                type: 'error',
                text1: 'Permission denied',
                text2: 'Enable notifications in your device Settings.',
            });

            if (Platform.OS === 'ios') {
                Linking.openSettings();
            }
        }
    }, [isPushEnabled, setIsPushEnabled]);

    return {
        isPushEnabled,
        togglePush,
    };
};
