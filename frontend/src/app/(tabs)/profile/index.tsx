import { StyleSheet } from "react-native-unistyles";
import {
  Icon,
  Post,
  PostItem,
  POSTS,
  ThemedBackground,
} from "@/src/components";
import { UIButton, UIText } from "@/src/ui";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { ComponentProps, memo, useCallback } from "react";
import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
  const router = useRouter();

  const navigateToPostDetails = useCallback(
    (id: string) => {
      router.push({
        pathname: `/post/[id]`,
        params: {
          id: id,
          isOwnPost: "true",
        },
      });
    },
    [router],
  );

  const renderPostItem = useCallback(
    ({ item: postData }: { item: PostItem }) => (
      <Post data={postData} onPress={navigateToPostDetails} />
    ),
    [navigateToPostDetails],
  );

  const keyExtractor = useCallback((postData: PostItem) => postData.id, []);

  return (
    <ThemedBackground>
      <ProfileHeader />
      <StatsPanel />

      <View style={styles.postsHeader}>
        <UIText size="lg" weight="bold" style={styles.text}>
          Posts
        </UIText>
        <NewPostButton />
      </View>

      <FlashList
        showsVerticalScrollIndicator={false}
        masonry
        numColumns={2}
        data={POSTS}
        style={styles.list}
        keyExtractor={keyExtractor}
        renderItem={renderPostItem}
        contentContainerStyle={styles.postsContainer}
      />
    </ThemedBackground>
  );
}

const ProfileHeader = memo(() => {
  const router = useRouter();

  const navigateToEditProfile = useCallback(() => {
    router.navigate("/(tabs)/profile/edit-profile");
  }, [router]);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatarWrapper}>
        <Icon
          size="medium"
          profileImageUrl="https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg"
        />
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
      </View>

      <View style={styles.infoContainer}>
        <View style={[styles.row, styles.usernameRow]}>
          <UIText size="lg" weight="bold" style={styles.text}>
            Kyrylo
          </UIText>

          <UIButton onPress={navigateToEditProfile} isLoading={false}>
            <Ionicons
              color={styles.settingsIconButton.color}
              size={styles.settingsIconButton.height}
              name="menu-outline"
            />
          </UIButton>
        </View>

        <View style={[styles.row, styles.jobRow]}>
          <UIText size="sm" style={styles.roleText}>
            Boss
          </UIText>

          <Ionicons
            color={styles.jobIcon.color}
            size={styles.jobIcon.height}
            name="checkmark-circle"
          />
        </View>

        <UIText size="sm" style={styles.bioText}>
          Hey! I'm Kyrylo 👋 A boss passionate about telling stories that
          matter.
        </UIText>
      </View>
    </View>
  );
});

type IconName = ComponentProps<typeof Ionicons>["name"];

const PROFILE_STATS_CONFIG: {
  id: string;
  title: string;
  iconName: IconName;
  quantity: number;
}[] = [
  { id: "1", title: "Followers", iconName: "people-outline", quantity: 398 },
  { id: "2", title: "Posts", iconName: "document-text-outline", quantity: 398 },
  { id: "3", title: "Followings", iconName: "grid-outline", quantity: 34 },
  { id: "4", title: "Saves", iconName: "bookmark-outline", quantity: 34 },
];

const StatsPanel = memo(() => {
  return (
    <View style={styles.statsCard}>
      {PROFILE_STATS_CONFIG.map((statConfig, index) => (
        <React.Fragment key={statConfig.id}>
          <View style={styles.statItemContainer}>
            <StatsButton
              title={statConfig.title}
              iconName={statConfig.iconName}
              quantity={statConfig.quantity}
            />
          </View>
          {index < PROFILE_STATS_CONFIG.length - 1 && (
            <LinearGradient
              colors={[
                "rgba(176, 38, 255, 0)",
                "rgba(176, 38, 255, 0.4)",
                "rgba(176, 38, 255, 0)",
              ]}
              style={styles.statGradientDivider}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
});

type StatsButtonProps = {
  title: string;
  iconName: IconName;
  quantity: number;
};

const StatsButton = memo(({ title, iconName, quantity }: StatsButtonProps) => {
  const handleStatPress = useCallback(() => {}, []);

  return (
    <UIButton
      style={styles.statButton}
      onPress={handleStatPress}
      isLoading={false}
    >
      <View style={styles.statIconContainer}>
        <Ionicons
          color={styles.statIcon.color}
          size={styles.statIcon.height}
          name={iconName}
        />
      </View>

      <UIText style={styles.statQuantity} size="md" weight="bold">
        {quantity}
      </UIText>
      <UIText style={styles.statTitle} size="xxs">
        {title}
      </UIText>
    </UIButton>
  );
});

const NewPostButton = memo(() => {
  const router = useRouter();

  const navigateToNewPost = useCallback(() => {
    router.navigate("/(tabs)/profile/new-post-image");
  }, [router]);

  return (
    <UIButton
      style={styles.newPostButton}
      onPress={navigateToNewPost}
      isLoading={false}
    >
      <Ionicons
        color={styles.newPostIcon.color}
        size={styles.newPostIcon.height}
        name="add"
      />
    </UIButton>
  );
});

const styles = StyleSheet.create((theme) => ({
  list: {
    flex: 1,
    width: "100%",
  },
  postsContainer: {
    paddingBottom: theme.utils.vs(80),
  },

  headerContainer: {
    paddingBottom: theme.utils.vs(6),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.utils.s(16),
    gap: theme.utils.s(16),
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
    flexShrink: 1,
    gap: theme.utils.s(4),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  usernameRow: {
    justifyContent: "space-between",
  },
  jobRow: {
    gap: theme.utils.s(6),
  },

  settingsIconButton: {
    color: theme.colors.primary,
    height: theme.utils.s(24),
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

  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.utils.s(14),
    paddingTop: theme.utils.vs(6),
    paddingBottom: theme.utils.vs(14),
  },
  statItemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statButton: {
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(2),
  },
  statIconContainer: {
    marginBottom: theme.utils.vs(4),
  },
  statIcon: {
    color: theme.colors.accent,
    height: theme.utils.s(18),
  },
  statQuantity: {
    color: theme.colors.primaryText,
    marginBottom: theme.utils.vs(2),
  },
  statTitle: {
    color: theme.colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  statGradientDivider: {
    width: 1,
    height: "100%",
  },

  postsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.utils.s(16),
    paddingBottom: theme.utils.vs(10),
  },
  newPostButton: {
    width: theme.utils.s(30),
    height: theme.utils.s(30),
    backgroundColor: theme.colors.accent,
    borderRadius: theme.utils.ms(20),
    justifyContent: "center",
    alignItems: "center",
  },
  newPostIcon: {
    color: theme.colors.white,
    height: theme.utils.s(20),
  },
}));
