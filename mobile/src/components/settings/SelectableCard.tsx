import React, { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native-unistyles';
import { UIText } from '@/src/ui';



type SelectableCardProps = {
    isSelected: boolean;
    onSelect: (id: any) => void;
    previewContent: ReactNode;
    id: any;
    title: string;
    description: string;
    iconName: React.ComponentProps<typeof Ionicons>['name'];
};

export const SelectableCard = ({
    isSelected,
    onSelect,
    previewContent,
    id,
    title,
    description,
    iconName,
}: SelectableCardProps) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { stiffness: 400, damping: 20, mass: 1 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { stiffness: 400, damping: 15, mass: 1 });
    };

    const handlePress = () => {
        onSelect(id);
    };

    const animatedCardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const animatedRingStyle = useAnimatedStyle(() => ({
        opacity: withTiming(isSelected ? 1 : 0, { duration: 200 }),
    }));

    const animatedBadgeStyle = useAnimatedStyle(() => ({
        opacity: withTiming(isSelected ? 1 : 0, { duration: 200 }),
        transform: [
            {
                scale: withSpring(isSelected ? 1 : 0, {
                    stiffness: 300,
                    damping: 20,
                    mass: 1,
                }),
            },
        ],
    }));

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={styles.pressable}
        >
            <Animated.View style={[styles.card, animatedCardStyle]}>
                <Animated.View
                    style={[styles.accentRing, animatedRingStyle]}
                    pointerEvents="none"
                />

                <View style={styles.previewContainer}>
                    {previewContent}

                    <Animated.View style={[styles.checkBadge, animatedBadgeStyle]}>
                        <Ionicons
                            name="checkmark"
                            size={styles.iconCheckBadge.height}
                            color={styles.iconCheckBadge.color}
                        />
                    </Animated.View>
                </View>

                <View style={styles.info}>
                    <View style={styles.labelRow}>
                        <Ionicons
                            name={iconName}
                            size={styles.iconLabel.height}
                            color={isSelected ? styles.selectedIconLabel.color : styles.iconLabel.color}
                        />
                        <UIText
                            size="sm"
                            weight="bold"
                            style={[styles.label, isSelected && styles.labelSelected]}
                        >
                            {title}
                        </UIText>
                    </View>
                    <UIText size="xxs" style={styles.description} numberOfLines={2}>
                        {description}
                    </UIText>
                </View>
            </Animated.View>
        </Pressable>
    );
};


const styles = StyleSheet.create((theme) => ({
    pressable: {
        width: '48%',
    },
    card: {
        borderRadius: theme.utils.ms(16),
        backgroundColor: theme.colors.backgroundSubtle,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        overflow: 'hidden',
    },

    accentRing: {
        position: 'absolute',
        inset: 0,
        borderRadius: theme.utils.ms(16),
        borderWidth: 2,
        borderColor: theme.colors.lightAccent,
        zIndex: 10,
    },

    previewContainer: {
        height: theme.utils.vs(110),
        margin: theme.utils.s(8),
        borderRadius: theme.utils.ms(10),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },

    checkBadge: {
        position: 'absolute',
        top: theme.utils.s(7),
        right: theme.utils.s(7),
        width: theme.utils.s(22),
        height: theme.utils.s(22),
        borderRadius: 99,
        backgroundColor: theme.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCheckBadge: {
        height: theme.utils.vs(16),
        color: theme.colors.white,
    },


    info: {
        paddingHorizontal: theme.utils.s(10),
        paddingBottom: theme.utils.vs(12),
        gap: theme.utils.vs(4),
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.utils.s(5),
    },

    iconLabel: {
        height: theme.utils.vs(16),
        color: theme.colors.muted,
    },
    selectedIconLabel: {
        color: theme.colors.lightAccent,
    },

    label: {
        color: theme.colors.muted,
    },
    labelSelected: {
        color: theme.colors.lightAccent,
    },

    description: {
        color: theme.colors.muted,
        lineHeight: 16,
    },
}));