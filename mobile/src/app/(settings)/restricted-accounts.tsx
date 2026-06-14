import { UIButton, UIDivider, UIEmptyState, UIText } from "../../ui";
import { IconInfo, ThemedBackground } from "@/src/components";
import { StyleSheet } from "react-native-unistyles";
import { memo, useCallback, useState } from "react";
import { NavigationHeader } from "@/src/components/NavigationHeader";
import { useRouter } from "expo-router";
import { DiscoverUser } from "@/src/types";
import { SearchInput } from "@/src/components/SearchInput";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { InfoBanner } from "@/src/components/settings/InfoBanner";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useTranslation } from 'react-i18next';



export const SEARCH_USERS: DiscoverUser[] = [
    {
        id: "1",
        username: "alex_reed",
        profileImageUrl:
            "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
        job: "Photographer",
    },
    {
        id: "2",
        username: "kyrylo.dev",
        profileImageUrl:
            "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
        job: "Journalist",
    },
    {
        id: "3",
        username: "marina_g",
        profileImageUrl:
            "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
        job: "Hard Worker",
    },
    {
        id: "4",
        username: "tomas.h",
        profileImageUrl:
            "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
        job: "Designer",
    },
    {
        id: "5",
        username: "lena_88",
        profileImageUrl:
            "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
        job: "Content Creator",
    },
    {
        id: "6",
        username: "viktor_k",
        profileImageUrl:
            "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
        job: "Software Engineer",
    },
    {
        id: "7",
        username: "oksana.m",
        profileImageUrl:
            "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
        job: "Software Engineer",
    },
    {
        id: "8",
        username: "dmytro_y",
        profileImageUrl:
            "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
        job: "Software Engineer",
    },
    {
        id: "9",
        username: "iryna_v",
        profileImageUrl:
            "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
        job: "Marketer",
    },
    {
        id: "10",
        username: "serhiy.code",
        profileImageUrl:
            "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
        job: "Software Engineer",
    },
    {
        id: "11",
        username: "anastasia_",
        profileImageUrl:
            "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
        job: "Architect",
    },
    {
        id: "12",
        username: "nazar.builds",
        profileImageUrl:
            "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
        job: "Software Engineer",
    },
];


export default function RestrictedAccountsScreen() {
    const router = useRouter();
    const [users, setUsers] = useState(SEARCH_USERS);
    const { t } = useTranslation();

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const handleUnrestrict = useCallback((id: string) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
    }, []);

    const keyExtractor = useCallback((item: { id: string }) => item.id, []);

    const renderUserItem = useCallback(
        ({ item }: { item: DiscoverUser }) => (
            <SearchUserItem item={item} onUnrestrict={handleUnrestrict} />
        ),
        [handleUnrestrict],
    );

    const ListHeader = useCallback(() => (
        <View style={styles.listHeader}>
            <SearchInput />
            <InfoBanner
                icon="eye-off-outline"
                text={t('restrictedAccountsScreen.banner')}
                style={styles.infoBanner}
            />
            {users.length > 0 && (
                <View style={styles.sectionHeader}>
                    <UIText size="xs" style={styles.sectionTitle}>{t('restrictedAccountsScreen.restricted')}</UIText>
                    <View style={styles.countBadge}>
                        <UIText size="xxs" weight="bold" style={styles.countText}>{users.length}</UIText>
                    </View>
                </View>
            )}
        </View>
    ), [users.length]);

    return (
        <ThemedBackground>
            <NavigationHeader title={t('restrictedAccountsScreen.title')} onLeftAction={handleBack} />

            <FlashList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={ListHeader}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                style={styles.list}
                contentContainerStyle={styles.listContainerStyle}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <UIEmptyState
                        icon="person-add-outline"
                        title={t('restrictedAccountsScreen.noRestrictedTitle')}
                        description={t('restrictedAccountsScreen.noRestrictedDesc')}
                    />
                }
            />
        </ThemedBackground>
    );
}


type SearchUserItemProps = {
    item: DiscoverUser;
    onUnrestrict: (id: string) => void;
};

const SearchUserItem = memo(({ item, onUnrestrict }: SearchUserItemProps) => {
    const { t } = useTranslation();
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

    return (
        <Animated.View style={[styles.itemContainer, animatedCardStyle]}>
            <View style={styles.itemInner}>
                <IconInfo
                    username={item.username}
                    profileImageUrl={item.profileImageUrl}
                    statusText={item.job}
                    usernameWeight="bold"
                />

                <UIButton
                    onPress={() => onUnrestrict(item.id)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={styles.unrestrictButton}
                >
                    <Ionicons
                        name="eye-outline"
                        size={styles.unrestrictIcon.height}
                        color={styles.unrestrictIcon.color}
                    />
                    <UIText size="xs" weight="normal" style={styles.unrestrictLabel}>{t('restrictedAccountsScreen.unrestrict')}</UIText>
                </UIButton>
            </View>
            <UIDivider />
        </Animated.View>
    );
});

const styles = StyleSheet.create((theme) => ({
    list: {
        flex: 1,
        width: "100%",
    },

    listContainerStyle: {
        paddingBottom: theme.utils.vs(100),
    },

    listHeader: {
        paddingVertical: theme.utils.vs(8),
    },

    infoBanner: {
        marginHorizontal: theme.utils.s(16),
        marginBottom: theme.utils.vs(20),
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.utils.s(8),
        paddingHorizontal: theme.utils.s(16),
        marginBottom: theme.utils.vs(4),
    },

    sectionTitle: {
        color: theme.colors.muted,
        letterSpacing: 1.2,
        textTransform: "uppercase",
    },

    countBadge: {
        backgroundColor: theme.colors.accent,
        borderRadius: 99,
        minWidth: theme.utils.s(18),
        height: theme.utils.s(18),
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: theme.utils.s(5),
    },

    countText: {
        color: theme.colors.white,
    },

    itemContainer: {
        paddingHorizontal: theme.utils.s(16),
    },

    itemInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: theme.utils.vs(12),
    },

    unrestrictButton: {
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

    unrestrictIcon: {
        height: theme.utils.s(14),
        color: theme.colors.lightAccent,
    },

    unrestrictLabel: {
        color: theme.colors.lightAccent,
    },
}));