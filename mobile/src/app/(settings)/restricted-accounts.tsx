import { UIEmptyState, UIText } from "../../ui";
import { ThemedBackground } from "@/src/components";
import { StyleSheet } from "react-native-unistyles";
import { memo, useCallback, useState } from "react";
import { NavigationHeader } from "@/src/components/NavigationHeader";
import { useRouter } from "expo-router";
import { DiscoverUser } from "@/src/types";
import { SearchInput } from "@/src/components/SearchInput";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { InfoBanner } from "@/src/components/settings/InfoBanner";
import { SearchUserItem } from "@/src/components/SearchUserItem";



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

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    const handleUnrestrict = useCallback(() => {
        // TODO:  API call implement unrestrict logic delete from list and update count
    }, []);

    const keyExtractor = useCallback((item: { id: string }) => item.id, []);

    const renderUserItem = useCallback(
        ({ item }: { item: DiscoverUser }) => (
            <SearchUserItem
                item={item}
                buttonLabel="Unrestrict"
                onAction={handleUnrestrict}
            />
        ),
        [handleUnrestrict],
    );

    return (
        <ThemedBackground>
            <NavigationHeader title="Restricted Accounts" onLeftAction={handleBack} />

            <FlashList
                data={SEARCH_USERS}
                renderItem={renderUserItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={<HeaderComponent count={SEARCH_USERS.length} />}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                style={styles.list}
                contentContainerStyle={styles.listContainerStyle}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <UIEmptyState
                        icon="person-add-outline"
                        title="No Restricted Accounts"
                        description="Start restricting people to hide their posts from your feed."
                    />
                }
            />
        </ThemedBackground>
    );
}

const HeaderComponent = memo(({ count }: { count: number }) => (
    <View style={styles.listHeader}>
        <SearchInput />
        <InfoBanner
            icon="eye-off-outline"
            text="Restricted accounts can't see your activity or send you direct messages. They won't know they've been restricted."
            style={styles.infoBanner}
        />
        {count > 0 && (
            <View style={styles.sectionHeader}>
                <UIText size="xs" style={styles.sectionTitle}>RESTRICTED</UIText>
                <View style={styles.countBadge}>
                    <UIText size="xxs" weight="bold" style={styles.countText}>{count}</UIText>
                </View>
            </View>
        )}
    </View>
));




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
}));