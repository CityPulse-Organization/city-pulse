import { UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { useFollow } from "@/src/hooks";
import { Icon } from "../Icon";
import { StyleSheet } from "react-native-unistyles";

type ProfileHeaderProps = {
    userId?: string;
    username?: string;
    bio?: string;
    jobTitle?: string;
    avatarUrl?: string;
    isSelf: boolean;
};

export const ProfileHeader = ({
    userId,
    username,
    bio,
    jobTitle,
    avatarUrl,
    isSelf,
}: ProfileHeaderProps) => {
    const router = useRouter();

    const navigateToEditProfile = useCallback(() => {
        router.navigate("/(tabs)/profile/edit-profile");
    }, [router]);

    const navigateToSettings = useCallback(() => {
        router.navigate("/(settings)");
    }, [router]);

    const { isFollowing, toggleFollow, isPending } = useFollow(userId || "");

    return (
        <View style={styles.headerContainer}>

            <View style={styles.avatarWrapper}>
                <Icon size="medium" profileImageUrl={avatarUrl} />

                {isSelf && (
                    <UIButton
                        style={styles.editProfileButton}
                        onPress={navigateToEditProfile}
                        isLoading={false}
                    >
                        <Ionicons
                            color={styles.editProfileIcon.color}
                            size={styles.editProfileIcon.height}
                            name="pencil"
                        />
                    </UIButton>
                )}
            </View>

            <View style={styles.infoContainer}>
                <View style={[styles.row, styles.usernameRow]}>
                    <View style={styles.nameWrapper}>
                        <UIText
                            size="lg"
                            weight="bold"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.text}
                        >
                            {username ?? (userId ? `${userId.substring(0, 8)}...` : "Loading...")}
                        </UIText>
                    </View>

                    {isSelf ? (
                        <UIButton onPress={navigateToSettings} isLoading={false}>
                            <Ionicons
                                color={styles.settingsIconButton.color}
                                size={styles.settingsIconButton.height}
                                name="menu-outline"
                            />
                        </UIButton>
                    ) : (
                        <UIButton
                            style={[
                                styles.actionFollowButton,
                                isFollowing && styles.followButtonActive,
                            ]}
                            onPress={toggleFollow}
                            isLoading={isPending}
                        >
                            <UIText
                                size="xs"
                                weight="bold"
                                style={[
                                    styles.followButtonText,
                                    isFollowing && styles.followButtonTextActive,
                                ]}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </UIText>
                        </UIButton>
                    )}
                </View>

                <View style={[styles.row, styles.jobRow]}>
                    <UIText size="sm" style={styles.roleText}>
                        {jobTitle ?? "User"}
                    </UIText>

                    <Ionicons
                        color={styles.jobIcon.color}
                        size={styles.jobIcon.height}
                        name="checkmark-circle"
                    />
                </View>

                <UIText size="sm" style={styles.bioText}>
                    {bio ?? "Welcome to my City Pulse profile!"}
                </UIText>
            </View>
        </View>
    );
};


const styles = StyleSheet.create((theme, rt) => ({
    headerContainer: {
        paddingBottom: theme.utils.vs(6),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: theme.utils.s(16),
        gap: theme.utils.s(16),
        backgroundColor: theme.colors.background,
    },
    avatarWrapper: {
        marginBottom: theme.utils.vs(12),
        position: "relative",
    },
    editProfileButton: {
        position: "absolute",
        bottom: -theme.utils.vs(4),
        right: -theme.utils.s(4),
        backgroundColor: theme.colors.lightMuted,
        borderRadius: 999,
        padding: theme.utils.s(6),
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    editProfileIcon: {
        color: theme.colors.primaryText,
        height: theme.utils.s(12),
    },
    infoContainer: {
        flex: 1,
        gap: theme.utils.s(4),
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    usernameRow: {
        justifyContent: "space-between",
        gap: theme.utils.s(16),
    },
    nameWrapper: {
        flex: 1,
    },


    settingsIconButton: {
        color: theme.colors.primary,
        height: theme.utils.s(24),
    },

    jobRow: {
        gap: theme.utils.s(6),
    },
    jobIcon: {
        color: theme.colors.accent,
        height: theme.utils.s(16),
    },
    text: {
        color: theme.colors.primaryText,
    },
    roleText: {
        color: theme.colors.accent,
    },
    bioText: {
        color: theme.colors.muted,
        lineHeight: 20,
    },

    actionFollowButton: {
        paddingHorizontal: theme.utils.s(16),
        paddingVertical: theme.utils.vs(6),
        borderRadius: theme.utils.ms(16),
        backgroundColor: theme.colors.accent,
        borderWidth: 1,
        borderColor: theme.colors.muted,
    },
    followButtonActive: {
        borderWidth: 1,
        borderColor: theme.colors.muted,
        backgroundColor: theme.colors.mutedAccent,
    },
    followButtonText: {
        color: theme.colors.white,
    },
    followButtonTextActive: {
        color: theme.colors.muted,
    },
}));