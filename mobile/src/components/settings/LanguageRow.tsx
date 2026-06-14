import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { LanguageId } from '@/src/types/settings';
import { LanguageOption } from '@/src/types/settings';
import { UIDivider, UIText } from '@/src/ui';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';




type LanguageRowProps = {
    option: LanguageOption;
    isSelected: boolean;
    onSelect: (id: LanguageId) => void;
    isLast: boolean;
};

export const LanguageRow = ({ option, isSelected, onSelect, isLast }: LanguageRowProps) => {
    const { t } = useTranslation();
    const scale = useSharedValue(1);
    const pressed = useSharedValue(0);

    const animatedRow = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: withTiming(1, { duration: 150 }),
    }));


    const animatedCheck = useAnimatedStyle(() => ({
        opacity: withTiming(isSelected ? 1 : 0, { duration: 180 }),
        transform: [
            {
                scale: withSpring(isSelected ? 1 : 0.4, {
                    stiffness: 320,
                    damping: 18,
                }),
            },
        ],
    }));

    const animatedIndicator = useAnimatedStyle(() => ({
        opacity: withTiming(isSelected ? 1 : 0, { duration: 180 }),
        transform: [{ scaleY: withTiming(isSelected ? 1 : 0, { duration: 200 }) }],
    }));


    const handlePressIn = () => {
        scale.value = withSpring(0.975, { stiffness: 400, damping: 22 });
        pressed.value = withTiming(1, { duration: 100 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { stiffness: 400, damping: 18 });
        pressed.value = withTiming(0, { duration: 120 });
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => onSelect(option.id as LanguageId)}
        >
            <Animated.View style={[styles.row(isSelected), animatedRow]}>
                <Animated.View style={[styles.accentBar, animatedIndicator]} />

                <View style={styles.flagPill}>
                    <UIText size="lg">{option.flag}</UIText>
                </View>

                <View style={styles.rowInfo}>
                    <UIText
                        size="sm"
                        weight="normal"
                        style={isSelected ? styles.labelSelected : styles.label}
                    >
                        {t(`languages.${option.id}`)}
                    </UIText>
                    <UIText size="xs" style={styles.subLabel}>
                        {option.nativeLabel} · {t(`languages.regions.${option.id}`)}
                    </UIText>
                </View>

                <Animated.View style={[styles.checkWrap, animatedCheck]}>
                    <Ionicons
                        name="checkmark"
                        size={styles.checkIcon.height}
                        color={styles.checkIcon.color}
                    />
                </Animated.View>
            </Animated.View>

            {!isLast && <UIDivider style={styles.divider} />}
        </Pressable>
    );
};



const styles = StyleSheet.create((theme) => ({
    row: (isSelected: boolean) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.utils.vs(12),
        paddingHorizontal: theme.utils.s(14),
        gap: theme.utils.s(12),
        overflow: 'hidden',
        backgroundColor: isSelected ? theme.colors.mutedAccent : 'transparent',
    }),
    accentBar: {
        position: 'absolute',
        left: 0,
        top: theme.utils.vs(10),
        bottom: theme.utils.vs(10),
        width: 3,
        borderRadius: 99,
        backgroundColor: theme.colors.lightAccent,
    },

    flagPill: {
        width: theme.utils.s(38),
        height: theme.utils.s(38),
        borderRadius: theme.utils.ms(10),
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        alignItems: 'center',
        justifyContent: 'center',
    },

    rowInfo: {
        flex: 1,
        gap: theme.utils.vs(2),
    },

    label: {
        color: theme.colors.primaryText,
    },
    labelSelected: {
        color: theme.colors.lightAccent,
    },
    subLabel: {
        color: theme.colors.muted,
    },

    checkWrap: {
        width: theme.utils.s(24),
        height: theme.utils.s(24),
        borderRadius: 99,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkIcon: {
        height: theme.utils.vs(14),
        color: theme.colors.white,
    },

    divider: {
        marginHorizontal: theme.utils.s(14),
    },
}));