import { ComponentProps, memo } from "react";
import { ViewStyle } from "react-native";
import { View } from "react-native";
import { UIButton } from "../ui";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native-unistyles";

type BlurButtonProps = {
    onPress: () => void;
    iconName: ComponentProps<typeof Ionicons>["name"];
    style?: ViewStyle;
}

export const BlurButton = memo(({ onPress, iconName, style }: BlurButtonProps) => (
    <View style={[styles.container, style]}>
        <UIButton onPress={onPress}>
            <BlurView intensity={80} tint="dark" style={styles.overlayButton}>
                <Ionicons
                    name={iconName}
                    size={styles.contentIcon.height}
                    color={styles.contentIcon.color}
                />
            </BlurView>
        </UIButton>
    </View>
));


const styles = StyleSheet.create((theme, rt) => ({
    container: {
        position: "absolute",
        left: theme.utils.s(16),
        zIndex: 10,
        top: Math.max(rt.insets.top, theme.utils.vs(50)),
    },
    overlayButton: {
        paddingHorizontal: theme.utils.s(8),
        paddingVertical: theme.utils.vs(8),
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 0.5,
        borderColor: theme.colors.white,
    },
    contentIcon: {
        height: theme.utils.s(20),
        color: theme.colors.white,
    },
}))