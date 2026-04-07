
import { UIButton, UIDivider, UIText } from "@/src/ui";
import { IconInfo } from "@/src/components";
import { StyleSheet } from "react-native-unistyles";
import { memo, useCallback } from "react";
import { DiscoverUser } from "@/src/types";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { router } from "expo-router";


type SearchUserItemProps = {
    item: DiscoverUser;
    buttonLabel: string;
    onAction: () => void;
    isActive?: boolean;
    isPending?: boolean;
    isSelf?: boolean;
};

export const SearchUserItem = memo(({
    item,
    buttonLabel,
    onAction,
    isActive,
    isPending,
    isSelf = false,
}: SearchUserItemProps) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.96, {
            stiffness: 400,
            damping: 20,
            mass: 1
        });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, {
            stiffness: 400,
            damping: 15,
            mass: 1
        });
    };

    const animatedCardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const navigateToProfile = useCallback(() => {
        router.push({
            pathname: "/user/[id]",
            params: { id: item.id, username: item.username }
        });
    }, [item.id, item.username]);

    return (
        <Animated.View style={[styles.itemContainer, animatedCardStyle]}>
            <View style={styles.itemInner}>
                <IconInfo
                    username={item.username}
                    profileImageUrl={item.profileImageUrl}
                    statusText={item.job}
                    usernameWeight="bold"
                    onPress={navigateToProfile}
                />

                {!isSelf && (
                    <UIButton
                        onPress={onAction}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        style={[
                            styles.button,
                            isActive && styles.activeButton,
                        ]}
                        isLoading={isPending}
                    >
                        <Ionicons
                            name={isActive ? "eye-off-outline" : "eye-outline"}
                            size={styles.icon.height}
                            color={isActive ? styles.activeIcon.color : styles.icon.color}
                        />
                        <UIText
                            size="xs"
                            weight="bold"
                            style={[
                                styles.buttonLabel,
                                isActive && styles.activeButtonLabel,
                            ]}
                        >
                            {buttonLabel}
                        </UIText>
                    </UIButton>
                )}
            </View>
            <UIDivider />
        </Animated.View>
    );
});


const styles = StyleSheet.create((theme) => ({
    itemContainer: {
        paddingHorizontal: theme.utils.s(16),
    },

    itemInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: theme.utils.vs(12),
    },

    button: {
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
        gap: theme.utils.s(5),
        paddingVertical: theme.utils.vs(7),
        paddingHorizontal: theme.utils.s(12),
        borderWidth: 1,
        borderRadius: theme.utils.ms(10),
        borderColor: theme.colors.accent,
    },

    activeButton: {
        borderWidth: 1,
        borderColor: theme.colors.darkAccent,
    },

    icon: {
        height: theme.utils.s(14),
        color: theme.colors.lightAccent,
    },
    activeIcon: {
        color: theme.colors.darkAccent,
    },

    buttonLabel: {
        color: theme.colors.lightAccent,
    },

    activeButtonLabel: {
        color: theme.colors.darkAccent,
    },
}));