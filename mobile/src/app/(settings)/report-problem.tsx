import React, { memo, useCallback, useState } from 'react';
import {
    StyleSheet as RNStyleSheet,
    View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm, Controller, Control } from 'react-hook-form';

import { ThemedBackground } from '../../components';
import { NavigationHeader } from '../../components/NavigationHeader';
import { UIButton, UIInput, UIKeyboardAvoidingScrollView, UIText } from '../../ui';
import { InfoBanner } from '@/src/components/settings/InfoBanner';
import { FooterButton } from '@/src/components/SaveButton';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CATEGORIES } from '@/src/utils/settings';




const reportFormSchema = z.object({
    category: z.string().min(1, 'Please select a category.'),
    title: z.string().min(1, 'Please give a short summary.'),
    description: z.string()
        .min(1, 'Please provide a detailed description.')
        .min(20, 'Please write at least 20 characters.'),
});

type FormValues = z.infer<typeof reportFormSchema>;


export default function ReportProblemScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
        resolver: zodResolver(reportFormSchema),
        defaultValues: { category: '', title: '', description: '' },
        mode: 'onChange',
    });

    const handleBack = useCallback(() => router.back(), [router]);

    const onSubmit = handleSubmit(async () => {
        setIsLoading(true);
        try {
            // TODO: call API to submit report
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    });

    const resetForm = useCallback(() => {
        reset();
        setIsSubmitted(false);
    }, [reset]);



    if (isSubmitted) return <SuccessView onReset={resetForm} onBack={handleBack} />

    return (
        <ThemedBackground>
            <NavigationHeader title="Report a Problem" onLeftAction={handleBack} />

            <UIKeyboardAvoidingScrollView
                contentContainerStyle={styles.scrollContent}
            >
                <InfoBanner
                    text="We appreciate you taking the time to report this. Describe what happened and we'll do our best to fix it."
                />

                <CategoryPicker
                    control={control}
                    errorMessage={errors.category?.message}
                />

                <InputField
                    control={control}
                    name="title"
                    label="SUMMARY"
                    placeholder="e.g. App crashes on map zoom"
                    errorMessage={errors.title?.message}
                />

                <TextAreaField
                    control={control}
                    name="description"
                    label="DETAILS"
                    placeholder="Describe the steps to reproduce the issue, what you expected to happen, and what actually happened…"
                    errorMessage={errors.description?.message}
                />
            </UIKeyboardAvoidingScrollView>

            <FooterButton
                label="Send Report"
                onPress={onSubmit}
                isLoading={isLoading}
            />
        </ThemedBackground>
    );
}

const SuccessView = memo(({ onReset, onBack }: { onReset: () => void, onBack: () => void }) => (
    <ThemedBackground>
        <NavigationHeader title="Report a Problem" onLeftAction={onBack} />

        <View style={styles.successContainer}>
            <View style={styles.successIconWrap}>
                <LinearGradient
                    colors={[styles.successGradientStart.color, styles.successGradientEnd.color]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={styles.successGradient}
                />
                <Ionicons name="checkmark" size={styles.successIcon.height} color={styles.successIcon.color} />
            </View>

            <UIText size="xl" weight="bold" style={styles.successTitle}>Report Sent!</UIText>

            <UIText size="sm" style={styles.successSubtitle}>
                Thank you for helping us improve City Pulse. Our team will look into this shortly.
            </UIText>

            <UIButton onPress={onReset} style={({ pressed }) => [styles.anotherButton, pressed && styles.anotherButtonPressed]}>
                <UIText size="sm" style={styles.anotherButtonText}>Send another report</UIText>
            </UIButton>
        </View>
    </ThemedBackground>
));




const CategoryPicker = memo(({ control, errorMessage }: { control: Control<FormValues>; errorMessage?: string }) => {

    return (
        <View style={styles.fieldGroup}>
            <UIText size="xs" style={styles.fieldLabel}>CATEGORY</UIText>
            <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.categoryGrid}>
                        {CATEGORIES.map((category) => {

                            const isActive = value === category.id;
                            const onPress = useCallback(() => onChange(category.id), [onChange, category.id]);

                            return (
                                <UIButton
                                    key={category.id}
                                    onPress={onPress}
                                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                                >
                                    <Ionicons
                                        name={category.icon}
                                        size={styles.categoryChipIcon.height}
                                        color={isActive ? styles.categoryChipActiveIcon.color : styles.categoryChipIconColor.color}
                                    />
                                    <UIText size="xs" weight="normal" style={[styles.categoryChipLabel, isActive && styles.categoryChipLabelActive]}>
                                        {category.label}
                                    </UIText>
                                </UIButton>
                            );
                        })}
                    </View>
                )}
            />
            {errorMessage && <UIText size="xxs" style={styles.errorText}>{errorMessage}</UIText>}
        </View>
    );
});




const InputField = memo(({ control, name, label, placeholder, errorMessage }: any) => (
    <View style={styles.fieldGroup}>
        <UIText size="xs" style={styles.fieldLabel}>{label}</UIText>
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
                <UIInput
                    placeholder={placeholder}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    dividerColor="accent"
                    inputStyle={styles.inputText}
                    error={errorMessage}
                    returnKeyType="next"
                />
            )}
        />
    </View>
));



const TextAreaField = memo(({ control, name, label, placeholder, errorMessage }: any) => (
    <View style={styles.fieldGroup}>
        <UIText size="xs" style={styles.fieldLabel}>{label}</UIText>
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.textAreaWrapper}>
                    <UIInput
                        placeholder={placeholder}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        multiline
                        numberOfLines={8}
                        textAlignVertical="top"
                        containerStyle={styles.descriptionContainer}
                        inputStyle={styles.descriptionInput}
                        error={errorMessage}
                    />
                </View>
            )}
        />
    </View>
));





const styles = StyleSheet.create((theme) => ({
    scrollContent: {
        paddingHorizontal: theme.utils.s(20),
        paddingTop: theme.utils.vs(12),
        paddingBottom: theme.utils.vs(80),
        flexGrow: 1,
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
    placeholderColor: {
        color: theme.colors.muted,
    },
    errorText: {
        color: theme.colors.alert,
    },


    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.utils.s(8),
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.utils.s(6),
        paddingVertical: theme.utils.vs(8),
        paddingHorizontal: theme.utils.s(12),
        borderRadius: 99,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        backgroundColor: theme.colors.backgroundSubtle,
        overflow: 'hidden',
    },

    categoryChipActive: {
        borderColor: theme.colors.lightAccent,
    },


    categoryChipIcon: {
        height: theme.utils.s(16),
    },
    categoryChipIconColor: {
        color: theme.colors.muted,
    },
    categoryChipActiveIcon: {
        color: theme.colors.lightAccent,
    },

    categoryChipLabel: {
        color: theme.colors.muted,
    },
    categoryChipLabelActive: {
        color: theme.colors.lightAccent,
    },


    textAreaWrapper: {
        gap: theme.utils.vs(6),
    },
    descriptionContainer: {
        backgroundColor: theme.colors.backgroundSubtle,
        borderBottomWidth: 0,
        borderRadius: theme.utils.ms(12),
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        paddingHorizontal: theme.utils.s(14),
    },
    descriptionInput: {
        fontSize: theme.utils.ms(14),
        minHeight: theme.utils.vs(160),
        lineHeight: 22,
    },

    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.utils.s(32),
        gap: theme.utils.vs(16),
    },
    successIconWrap: {
        width: theme.utils.s(80),
        height: theme.utils.s(80),
        borderRadius: 99,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.utils.vs(8),
    },
    successGradient: {
        ...RNStyleSheet.absoluteFillObject,
    },
    successGradientStart: {
        color: theme.colors.lightAccent,
    },
    successGradientEnd: {
        color: theme.colors.accent,
    },

    successIcon: {
        height: theme.utils.vs(40),
        color: theme.colors.white,
    },
    successTitle: {
        color: theme.colors.primaryText,
        textAlign: 'center',
    },
    successSubtitle: {
        color: theme.colors.muted,
        textAlign: 'center',
        lineHeight: 22,
    },

    anotherButton: {
        marginTop: theme.utils.vs(8),
        paddingVertical: theme.utils.vs(10),
        paddingHorizontal: theme.utils.s(24),
        borderRadius: 99,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    anotherButtonPressed: {
        opacity: 0.7,
    },
    anotherButtonText: {
        color: theme.colors.muted,
    },
}));
