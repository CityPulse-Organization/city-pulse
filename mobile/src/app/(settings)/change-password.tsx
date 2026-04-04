import React, { memo, useCallback, useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller, useWatch, Control } from 'react-hook-form';

import { ThemedBackground } from '../../components';
import { NavigationHeader } from '../../components/NavigationHeader';
import { UIButton, UIDivider, UIInput, UIKeyboardAvoidingScrollView, UIText } from '../../ui';
import { InfoBanner } from '@/src/components/settings/InfoBanner';
import { FooterButton } from '@/src/components/SaveButton';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { StrengthLevel } from '@/src/types/settings';
import { getStrength, STRENGTH_COLORS, STRENGTH_LABELS } from '@/src/utils/settings';


const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required.'),

    newPassword: z.string()
        .min(8, 'Must be at least 8 characters.')
        .regex(/[A-Z]/, 'Include at least one uppercase letter.')
        .regex(/[0-9]/, 'Include at least one number.'),

    confirmPassword: z.string().min(1, 'Please confirm your password.'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});


type FormValues = z.infer<typeof changePasswordSchema>;


export default function ChangePasswordScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
        mode: 'onChange',
    });

    const handleBack = useCallback(() => router.back(), [router]);

    const onSubmit = handleSubmit(async (values) => {
        setIsLoading(true);
        try {
            // TODO: call API to change password
            router.back();
            Toast.show({
                type: "success",
                text1: "Password changed successfully",
            });
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to change password",
            });
        } finally {
            setIsLoading(false);
        }
    });

    return (
        <ThemedBackground>
            <NavigationHeader title="Change Password" onLeftAction={handleBack} />

            <UIKeyboardAvoidingScrollView contentContainerStyle={styles.scrollContent}>
                <InfoBanner
                    text="Choose a strong password you haven't used before. We'll log you out after saving."
                    icon="shield-checkmark-outline"
                    style={styles.infoBanner}
                />

                <View style={styles.form}>

                    <PasswordField
                        control={control}
                        name="currentPassword"
                        label="CURRENT PASSWORD"
                        placeholder="Enter current password"
                        errorMessage={errors.currentPassword?.message}
                    />

                    <UIDivider style={styles.sectionDivider} />

                    <PasswordField
                        control={control}
                        name="newPassword"
                        label="NEW PASSWORD"
                        placeholder="Enter new password"
                        errorMessage={errors.newPassword?.message}
                    />

                    <PasswordStrengthMeter control={control} />

                    <PasswordField
                        control={control}
                        name="confirmPassword"
                        label="CONFIRM NEW PASSWORD"
                        placeholder="Repeat new password"
                        errorMessage={errors.confirmPassword?.message}
                    />

                </View>

            </UIKeyboardAvoidingScrollView>

            <FooterButton label="Save Password" onPress={onSubmit} isLoading={isLoading} />

        </ThemedBackground>
    );
}




type PasswordFieldProps = {
    control: Control<FormValues>;
    name: keyof FormValues;
    label: string;
    placeholder: string;
    errorMessage?: string;
};

const PasswordField = memo(({ control, name, label, placeholder, errorMessage }: PasswordFieldProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = useCallback(() => {
        setIsVisible((prev) => !prev);
    }, []);

    return (
        <View style={styles.fieldGroup}>
            <UIText size="xs" style={styles.fieldLabel}>{label}</UIText>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <UIInput
                        placeholder={placeholder}
                        secureTextEntry={!isVisible}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        dividerColor="accent"
                        inputStyle={styles.inputText}
                        error={errorMessage}
                        rightElement={
                            <EyeToggle visible={isVisible} onToggle={toggleVisibility} />
                        }
                    />
                )}
            />
        </View>
    );
});

const EyeToggle = memo(({ visible, onToggle }: { visible: boolean; onToggle: () => void }) => (
    <UIButton onPress={onToggle} style={styles.eyeButton}>
        <Ionicons
            name={visible ? 'eye-outline' : 'eye-off-outline'}
            size={styles.eyeIcon.height}
            color={styles.eyeIconColor.color}
        />
    </UIButton>
));




const PasswordStrengthMeter = memo(({ control }: { control: Control<FormValues> }) => {
    const newPasswordValue = useWatch({ control, name: 'newPassword' });
    const strength = getStrength(newPasswordValue);

    if (newPasswordValue.length === 0) return null;

    return (
        <>
            <View style={styles.strengthContainer}>
                <View style={styles.strengthBars}>
                    {([1, 2, 3, 4] as StrengthLevel[]).map((level) => (
                        <View
                            key={level}
                            style={[
                                styles.strengthBar,
                                { backgroundColor: strength >= level ? STRENGTH_COLORS[strength] : styles.strengthBarEmpty.backgroundColor },
                            ]}
                        />
                    ))}
                </View>
                <UIText size="xxs" style={[styles.strengthLabel, { color: STRENGTH_COLORS[strength] }]}>
                    {STRENGTH_LABELS[strength]}
                </UIText>
            </View>

            <View style={styles.requirements}>
                <Requirement isFulfilled={newPasswordValue.length >= 8} label="At least 8 characters" />
                <Requirement isFulfilled={/[A-Z]/.test(newPasswordValue)} label="One uppercase letter" />
                <Requirement isFulfilled={/[0-9]/.test(newPasswordValue)} label="One number" />
                <Requirement isFulfilled={/[^A-Za-z0-9]/.test(newPasswordValue)} label="One special character" />
            </View>

        </>
    )
})

const Requirement = memo(({ isFulfilled, label }: { isFulfilled: boolean; label: string }) => (
    <View style={styles.requirementContainer}>
        <Ionicons
            name={isFulfilled ? 'checkmark-circle' : 'ellipse-outline'}
            size={styles.requirementIcon.height}
            color={isFulfilled ? styles.requirementLabelFulfilled.color : styles.requirementLabelUnfulfilled.color}
        />
        <UIText size="xxs" style={[styles.requirementText, isFulfilled && styles.requirementLabelFulfilled]}>
            {label}
        </UIText>
    </View>
));




const styles = StyleSheet.create((theme) => ({
    scrollContent: {
        paddingHorizontal: theme.utils.s(20),
        paddingTop: theme.utils.vs(12),
        paddingBottom: theme.utils.vs(40),
    },

    infoBanner: {
        marginBottom: theme.utils.vs(28),
    },

    form: {
        gap: theme.utils.vs(28),
    },

    fieldGroup: {
        gap: theme.utils.vs(12),
    },
    fieldLabel: {
        color: theme.colors.muted,
        letterSpacing: 1.1,
        textTransform: 'uppercase',
    },
    inputText: {
        paddingVertical: theme.utils.vs(8),
    },

    eyeButton: {
        padding: theme.utils.s(4),
    },
    eyeIcon: {
        height: theme.utils.s(20),
    },
    eyeIconColor: {
        color: theme.colors.muted,
    },

    sectionDivider: {
        marginVertical: theme.utils.vs(8),
    },

    strengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.utils.s(10),
    },
    strengthBars: {
        flex: 1,
        flexDirection: 'row',
        gap: theme.utils.s(4),
    },
    strengthBar: {
        flex: 1,
        height: 3,
        borderRadius: 99,
        backgroundColor: theme.colors.borderSubtle,
    },
    strengthBarEmpty: {
        backgroundColor: theme.colors.borderSubtle,
    },
    strengthLabel: {
        minWidth: theme.utils.s(40),
        textAlign: 'right',
    },

    requirements: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.utils.vs(6),
        columnGap: theme.utils.s(16),
    },
    requirementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.utils.s(6),
    },
    requirementIcon: {
        height: theme.utils.s(14),
    },
    requirementText: {
        color: theme.colors.muted,
    },
    requirementLabelFulfilled: {
        color: theme.colors.success,
    },
    requirementLabelUnfulfilled: {
        color: theme.colors.lightMuted,
    },
}));
