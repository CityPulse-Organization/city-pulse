import React, { useCallback, useState } from 'react';
import { Linking, ScrollView, Switch, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedBackground } from '../../components';
import { UIButton, UIDivider, UIText } from '../../ui';
import { useLogout } from '../../hooks';
import { NavigationHeader } from '../../components/NavigationHeader';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

type RightElement =
    | { type: 'switch'; value: boolean; onToggle: () => void }
    | { type: 'text'; value: string }
    | { type: 'chevron' };


export default function SettingsScreen() {
    const router = useRouter();
    const { mutate: logout } = useLogout();

    const [isDarkMode, setIsDarkMode] = useState(true);
    const [mapStyle, setMapStyle] = useState<string>('Dark');

    const [isPushEnabled, setIsPushEnabled] = useState(true);
    const [isSafetyAlertsEnabled, setIsSafetyAlertsEnabled] = useState(true);
    const [isEventsNearbyEnabled, setIsEventsNearbyEnabled] = useState(true);

    const onLogoutPress = useCallback(() => {
        logout();
    }, [logout]);

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);


    const openUrl = useCallback((url: string) => {
        Linking.openURL(url).catch(() => { });
    }, []);

    const handleRateApp = useCallback(() => {
        // TODO: replace with actual store URL
        openUrl('https://apps.apple.com/app/idYOUR_APP_ID');
    }, [openUrl]);

    return (
        <ThemedBackground>
            <NavigationHeader
                title="Settings"
                onLeftAction={handleBack}
            />


            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <SettingsSection title="APPEARANCE">
                    <SettingsRow
                        icon="moon-outline"
                        title="Dark Mode"
                        rightElement={{
                            type: 'switch',
                            value: isDarkMode,
                            onToggle: () => setIsDarkMode((prev) => !prev),
                        }}
                        showDivider
                    />
                    <SettingsRow
                        icon="map-outline"
                        title="Map Style"
                        rightElement={{ type: 'text', value: mapStyle }}
                        onPress={() => router.push('/(settings)/map-style')}
                    />
                </SettingsSection>

                <SettingsSection title="GENERAL">
                    <SettingsRow
                        icon="globe-outline"
                        title="Language"
                        rightElement={{ type: 'text', value: 'English' }}
                    />
                </SettingsSection>

                <SettingsSection title="NOTIFICATIONS">
                    <SettingsRow
                        icon="notifications-outline"
                        title="Push Notifications"
                        rightElement={{
                            type: 'switch',
                            value: isPushEnabled,
                            onToggle: () => setIsPushEnabled((prev) => !prev),
                        }}
                        showDivider
                    />
                    <SettingsRow
                        icon="warning-outline"
                        title="Safety Alerts"
                        rightElement={{
                            type: 'switch',
                            value: isSafetyAlertsEnabled,
                            onToggle: () => setIsSafetyAlertsEnabled((prev) => !prev),
                        }}
                        showDivider
                    />
                    <SettingsRow
                        icon="calendar-outline"
                        title="New Events Nearby"
                        rightElement={{
                            type: 'switch',
                            value: isEventsNearbyEnabled,
                            onToggle: () => setIsEventsNearbyEnabled((prev) => !prev),
                        }}
                    />
                </SettingsSection>

                <SettingsSection title="PRIVACY">
                    <SettingsRow
                        icon="shield-outline"
                        title="Restricted Accounts"
                        rightElement={{ type: 'chevron' }}
                        showDivider
                    />
                    <SettingsRow
                        icon="lock-closed-outline"
                        title="Privacy Settings"
                        rightElement={{ type: 'chevron' }}
                    />
                </SettingsSection>

                <SettingsSection title="ABOUT & SUPPORT">
                    <SettingsRow
                        icon="help-circle-outline"
                        title="Help Center"
                        rightElement={{ type: 'chevron' }}
                        onPress={() => openUrl('https://citypulse.app/help')} // TODO: replace with actual page URL
                        showDivider
                    />
                    <SettingsRow
                        icon="bug-outline"
                        title="Report a Problem"
                        rightElement={{ type: 'chevron' }}
                        showDivider
                    />
                    <SettingsRow
                        icon="star-outline"
                        title="Rate the App"
                        rightElement={{ type: 'chevron' }}
                        onPress={handleRateApp}
                        showDivider
                    />
                    <SettingsRow
                        icon="document-text-outline"
                        title="Privacy Policy"
                        rightElement={{ type: 'chevron' }}
                        onPress={() => openUrl('https://citypulse.app/privacy')} // TODO: replace with actual page URL
                        showDivider
                    />
                    <SettingsRow
                        icon="reader-outline"
                        title="Terms of Service"
                        rightElement={{ type: 'chevron' }}
                        onPress={() => openUrl('https://citypulse.app/terms')} // TODO: replace with actual page URL
                        showDivider
                    />
                </SettingsSection>

                <SettingsSection title="ACCOUNT">
                    <SettingsRow
                        icon="person-remove-outline"
                        title="Remove Account"
                        isDestructive
                        showDivider
                    />
                    <SettingsRow
                        icon="log-out-outline"
                        title="Sign Out"
                        onPress={onLogoutPress}
                    />
                </SettingsSection>
            </ScrollView>
        </ThemedBackground>
    );
}



type SettingsSectionProps = {
    title: string;
    children: React.ReactNode;
};


const SettingsSection = ({ title, children }: SettingsSectionProps) => (
    <View style={styles.section}>
        <UIText size="xs" style={styles.sectionTitle}>
            {title}
        </UIText>
        <View style={styles.sectionCard}>{children}</View>
    </View>
);




type SettingsRowProps = {
    icon: IoniconsName;
    title: string;
    rightElement?: RightElement;
    isDestructive?: boolean;
    showDivider?: boolean;
    onPress?: () => void;
};


const SettingsRow = ({
    icon,
    title,
    rightElement,
    isDestructive = false,
    showDivider = false,
    onPress,
}: SettingsRowProps) => {
    const iconColor = isDestructive ? styles.destructiveColor.color : styles.iconColor.color;
    const textColor = isDestructive ? styles.destructiveColor.color : styles.primaryTextColor.color;

    return (
        <UIButton onPress={onPress ?? (() => { })} style={styles.rowButton} isLoading={false}>
            <View style={styles.rowInner}>

                <View style={styles.rowLeft}>
                    <View style={styles.rowIconContainer}>
                        <Ionicons name={icon} size={styles.rowIcon.height} color={iconColor} />
                    </View>
                    <UIText size="sm" weight="normal" style={[styles.rowTitle, { color: textColor }]}>
                        {title}
                    </UIText>
                </View>

                {rightElement?.type === 'switch' && (
                    <Switch
                        value={rightElement.value}
                        onValueChange={rightElement.onToggle}
                        trackColor={{
                            false: styles.switchTrackOff.backgroundColor,
                            true: styles.switchTrackOn.backgroundColor,
                        }}
                        thumbColor={styles.switchThumb.backgroundColor}
                        ios_backgroundColor={styles.switchTrackOff.backgroundColor}
                    />
                )}
                {rightElement?.type === 'text' && (
                    <View style={styles.rowRightTextContainer}>
                        <UIText size="sm" style={styles.rowRightText}>
                            {rightElement.value}
                        </UIText>
                        <Ionicons
                            name="chevron-forward"
                            size={styles.chevronIcon.height}
                            color={styles.mutedColor.color}
                        />
                    </View>
                )}
                {rightElement?.type === 'chevron' && (
                    <Ionicons
                        name="chevron-forward"
                        size={styles.chevronIcon.height}
                        color={styles.mutedColor.color}
                    />
                )}
            </View>

            {showDivider && <UIDivider />}
        </UIButton>
    );
};




const styles = StyleSheet.create((theme, rt) => ({
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: theme.utils.s(16),
        paddingBottom: theme.utils.vs(40),
        paddingTop: theme.utils.vs(20),
        gap: theme.utils.vs(30),
    },

    section: {
        gap: theme.utils.vs(10),
    },
    sectionTitle: {
        color: theme.colors.muted,
        textTransform: 'uppercase',
        letterSpacing: 1.1,
        paddingHorizontal: theme.utils.s(4),
    },
    sectionCard: {
        backgroundColor: theme.colors.backgroundSubtle,
        borderRadius: theme.utils.ms(14),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },

    rowButton: {
        paddingHorizontal: theme.utils.s(14),
    },
    rowInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.utils.vs(16),
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.utils.s(12),
        flex: 1,
    },
    rowIconContainer: {
        width: theme.utils.s(28),
        alignItems: 'center',
    },
    rowIcon: {
        height: theme.utils.s(20),
    },
    rowTitle: {
        color: theme.colors.primaryText,
    },

    rowRightTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.utils.s(2),
    },
    rowRightText: {
        color: theme.colors.muted,
    },
    chevronIcon: {
        height: theme.utils.s(16),
    },

    switchTrackOn: {
        backgroundColor: theme.colors.accent,
    },
    switchTrackOff: {
        backgroundColor: theme.colors.lightMuted,
    },
    switchThumb: {
        backgroundColor: theme.colors.white,
    },

    divider: {
        height: 1,
        backgroundColor: theme.colors.borderSubtle,
        marginLeft: theme.utils.s(54),
    },

    primaryTextColor: {
        color: theme.colors.primaryText,
    },
    mutedColor: {
        color: theme.colors.muted,
    },
    iconColor: {
        color: theme.colors.accent,
    },
    destructiveColor: {
        color: theme.colors.red,
    },
}));