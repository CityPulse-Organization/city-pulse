import React from 'react';
import { ScrollView, Switch, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { ThemedBackground } from '../../components';
import { UIButton, UIDivider, UIText } from '../../ui';
import { NavigationHeader } from '../../components/NavigationHeader';
import { useSettings } from '@/src/hooks/settings/useSettings';


type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

type RightElement =
    | { type: 'switch'; value: boolean; onToggle: () => void }
    | { type: 'text'; value: string }
    | { type: 'chevron' };


export default function SettingsScreen() {
    const { state, actions } = useSettings();
    const { t } = useTranslation();

    return (
        <ThemedBackground>
            <NavigationHeader
                title={t('settings.title')}
                onLeftAction={actions.handleBack}
            />


            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <SettingsSection title={t('settings.sections.appearance')}>
                    <SettingsRow
                        icon="moon-outline"
                        title={t('settings.darkMode')}
                        rightElement={{
                            type: 'switch',
                            value: state.isDarkMode,
                            onToggle: actions.toggleTheme,
                        }}
                        showDivider
                    />
                    <SettingsRow
                        icon="map-outline"
                        title={t('settings.mapStyle')}
                        rightElement={{ type: 'text', value: state.mapStyle.toUpperCase() }}
                        onPress={actions.navToMapStyle}
                    />
                </SettingsSection>

                <SettingsSection title={t('settings.sections.general')}>
                    <SettingsRow
                        icon="globe-outline"
                        title={t('settings.language')}
                        rightElement={{ type: 'text', value: state.language.toUpperCase() }}
                        onPress={actions.navToLanguage}
                        showDivider
                    />
                    <SettingsRow
                        icon="notifications-outline"
                        title={t('settings.pushNotifications')}
                        rightElement={{
                            type: 'switch',
                            value: state.isPushEnabled,
                            onToggle: actions.togglePush,
                        }}
                    />
                </SettingsSection>

                <SettingsSection title={t('settings.sections.security')}>
                    <SettingsRow
                        icon="shield-outline"
                        title={t('settings.restrictedAccounts')}
                        rightElement={{ type: 'chevron' }}
                        onPress={actions.navToRestrictedAccounts}
                        showDivider
                    />

                    <SettingsRow
                        icon="key-outline"
                        title={t('settings.changePassword')}
                        rightElement={{ type: 'chevron' }}
                        onPress={actions.navToChangePassword}
                        showDivider
                    />

                    <SettingsRow
                        icon="finger-print-outline"
                        title={t('settings.biometricUnlock')}
                        subtitle={
                            state.biometricSupportStatus === 'checking'
                                ? t('settings.biometricChecking')
                                : state.biometricSupportStatus === 'unavailable'
                                    ? t('settings.biometricUnavailable')
                                    : state.biometricSupportStatus === 'not_enrolled'
                                        ? t('settings.biometricNotEnrolled')
                                        : t('settings.biometricReady')
                        }
                        rightElement={{
                            type: 'switch',
                            value: state.isBiometricEnabled,
                            onToggle: actions.toggleBiometric,
                        }}
                        isDisabled={
                            state.biometricSupportStatus === 'checking' ||
                            state.biometricSupportStatus === 'unavailable' ||
                            state.isBiometricAuthenticating
                        }
                        isLoading={state.isBiometricAuthenticating}
                    />
                </SettingsSection>

                <SettingsSection title={t('settings.sections.aboutSupport')}>
                    <SettingsRow
                        icon="help-circle-outline"
                        title={t('settings.helpCenter')}
                        rightElement={{ type: 'chevron' }}
                        onPress={actions.openHelpUrl}
                        showDivider
                    />
                    <SettingsRow
                        icon="bug-outline"
                        title={t('settings.reportProblem')}
                        rightElement={{ type: 'chevron' }}
                        onPress={actions.navToReportProblem}
                        showDivider
                    />
                    <SettingsRow
                        icon="star-outline"
                        title={t('settings.rateApp')}
                        rightElement={{ type: 'chevron' }}
                        onPress={actions.handleRateApp}
                        showDivider
                    />
                    <SettingsRow
                        icon="document-text-outline"
                        title={t('settings.privacyPolicy')}
                        rightElement={{ type: 'chevron' }}
                        onPress={actions.openPrivacyUrl}
                        showDivider
                    />
                    <SettingsRow
                        icon="reader-outline"
                        title={t('settings.termsOfService')}
                        rightElement={{ type: 'chevron' }}
                        onPress={actions.openTermsUrl}
                    />
                </SettingsSection>

                <SettingsSection title={t('settings.sections.account')}>
                    <SettingsRow
                        icon="person-remove-outline"
                        title={t('settings.removeAccount')}
                        isDestructive
                        onPress={actions.handleDeleteAccount}
                        showDivider
                    />
                    <SettingsRow
                        icon="log-out-outline"
                        title={t('settings.signOut')}
                        onPress={actions.onLogoutPress}
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


export const SettingsSection = ({ title, children }: SettingsSectionProps) => (
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
    subtitle?: string;
    rightElement?: RightElement;
    isDestructive?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    showDivider?: boolean;
    onPress?: () => void;
};


export const SettingsRow = ({
    icon,
    title,
    subtitle,
    rightElement,
    isDestructive = false,
    isDisabled = false,
    isLoading = false,
    showDivider = false,
    onPress = () => { },
}: SettingsRowProps) => {
    const iconColor = isDisabled
        ? styles.mutedColor.color
        : isDestructive ? styles.destructiveColor.color : styles.iconColor.color;
    const textColor = isDisabled
        ? styles.mutedColor.color
        : isDestructive ? styles.destructiveColor.color : styles.primaryTextColor.color;

    return (
        <UIButton
            onPress={onPress}
            style={[styles.rowButton, isDisabled && styles.rowDisabled]}
            isLoading={isLoading}
            disabled={isDisabled}
        >
            <View style={styles.rowInner}>

                <View style={styles.rowLeft}>
                    <View style={styles.rowIconContainer}>
                        <Ionicons name={icon} size={styles.rowIcon.height} color={iconColor} />
                    </View>
                    <View style={styles.rowTextGroup}>

                        <UIText size="sm" weight="normal" style={[styles.rowTitle, { color: textColor }]}>
                            {title}
                        </UIText>
                        {subtitle && (
                            <UIText size="xs" style={styles.rowSubtitle}>
                                {subtitle}
                            </UIText>
                        )}
                    </View>

                </View>

                {rightElement?.type === 'switch' && (
                    <Switch
                        value={rightElement.value}
                        onValueChange={rightElement.onToggle}
                        disabled={isDisabled}
                        trackColor={{
                            false: styles.switchTrackOff.backgroundColor,
                            true: styles.switchTrackOn.backgroundColor,
                        }}
                        thumbColor={styles.switchThumb.backgroundColor}
                        ios_backgroundColor={styles.switchTrackOff.backgroundColor}
                        style={isDisabled ? styles.switchDisabled : undefined}
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
    rowTextGroup: {
        flex: 1,
        gap: theme.utils.vs(2),
    },
    rowTitle: {
        color: theme.colors.primaryText,
    },
    rowSubtitle: {
        color: theme.colors.muted,
        lineHeight: 16,
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

    rowDisabled: {
        opacity: 0.5,
    },
    switchDisabled: {
        opacity: 0.5,
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