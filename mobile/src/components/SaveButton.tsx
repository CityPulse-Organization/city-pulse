import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { Pressable, StyleSheet as RNStyleSheet, View, ActivityIndicator } from 'react-native';
import { UIText } from "../ui";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native-unistyles";

type SaveButtonProps = {
    label: string;
    onPress: () => void;
    isLoading: boolean;
};

export const SaveButton = memo(({ label, onPress, isLoading }: SaveButtonProps) => (
    <View style={styles.wrapper} pointerEvents="box-none" >
        <Pressable
            onPress={onPress}
            disabled={isLoading}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
            <LinearGradient
                colors={[styles.gradientStart.backgroundColor, styles.gradientEnd.backgroundColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            />
            <UIText size="lg" weight="bold" style={styles.text}>{label}</UIText>
            {isLoading
                ? <ActivityIndicator color={styles.loading.color} size="small" />
                : <Ionicons name="checkmark" color={styles.icon.color} size={styles.icon.height} />
            }
        </Pressable>
    </View>
));



const styles = StyleSheet.create((theme, rt) => ({
    wrapper: {
        ...RNStyleSheet.absoluteFillObject,
        zIndex: 999,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        paddingHorizontal: theme.utils.s(20),
        paddingBottom: rt.insets.bottom + theme.utils.vs(16),
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.utils.s(10),
        paddingVertical: theme.utils.vs(16),
        borderRadius: 99,
        overflow: 'hidden',
    },

    gradient: {
        ...RNStyleSheet.absoluteFillObject,
    },
    gradientStart: {
        backgroundColor: theme.colors.lightAccent,
    },
    gradientEnd: {
        backgroundColor: theme.colors.mutedAccent,
    },

    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },

    text: {
        color: theme.colors.white,
    },

    icon: {
        height: theme.utils.vs(22),
        color: theme.colors.white,
    },
    loading: {
        color: theme.colors.white,
    },
}));