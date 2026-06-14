import { StyleSheet } from "react-native-unistyles";
import { IconInfo, Post, ThemedBackground } from "@/src/components";
import { UIButton, UIEmptyState, UIText } from "@/src/ui";
import { router, useRouter } from "expo-router";
import { ComponentProps, memo, useCallback, useState } from "react";
import React from "react";
import { RefreshControl, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { TabBarProps, Tabs } from "react-native-collapsible-tab-view";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { DiscoverUser, PostItem } from "@/src/types";
import { useProfile } from "@/src/hooks/profile/useProfile";
import { useFollow } from "@/src/hooks/useFollow";
import { ProfileHeader } from "./profile/ProfileHeader";
import { SearchInput } from "./SearchInput";
import { useTranslation } from 'react-i18next';

type IconName = ComponentProps<typeof Ionicons>["name"];

type ProfileStat = {
  id: string;
  name: string;
  title: string;
  iconName: IconName;
  quantity: number;
};

const FollowListItem = memo(({ item }: { item: DiscoverUser }) => {
  const { t } = useTranslation();
  const { isFollowing, toggleFollow, isPending, isSelf } = useFollow(item.id);
  const navigateToProfile = useCallback(() => {
    router.push({
      pathname: "/user/[id]",
      params: { id: item.id, username: item.username },
    });
  }, [item.id, item.username]);

  return (
    <View style={styles.itemContainer}>
      <IconInfo
        username={item.username}
        profileImageUrl={item.profileImageUrl}
        statusText={item.job}
        onPress={navigateToProfile}
      />
      {!isSelf && (
        <UIButton
          style={[
            styles.followButton,
            isFollowing && styles.followButtonActive,
          ]}
          onPress={toggleFollow}
          isLoading={isPending}
        >
          <UIText
            size="xs"
            weight="bold"
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[
              styles.followButtonText,
              isFollowing && styles.followButtonTextActive,
            ]}
          >
            {isFollowing ? t('profile.unfollow') : t('profile.follow')}
          </UIText>
        </UIButton>
      )}
    </View>
  );
});

type UniversalProfileScreenProps = {
  id?: string;
};

export function UniversalProfileScreen({ id }: UniversalProfileScreenProps) {
  const isSelf = !id;
  const { t } = useTranslation();

  const router = useRouter();

  const {
    userId,
    username,
    profile,
    posts,
    postsCount,
    fetchNextPosts,
    hasNextPostsPage,
    isFetchingNextPosts,
    savedPosts,
    savedPostsCount,
    fetchNextSavedPosts,
    hasNextSavedPostsPage,
    isFetchingNextSavedPosts,
    followers,
    followersCount,
    fetchNextFollowers,
    hasNextFollowersPage,
    isFetchingNextFollowers,
    following,
    followingCount,
    fetchNextFollowing,
    hasNextFollowingPage,
    isFetchingNextFollowing,
    refetchAll,
    isRefetching,
  } = useProfile(id);

  const refreshControl = (
    <RefreshControl
      refreshing={isRefetching}
      onRefresh={refetchAll}
      tintColor={styles.refreshControl.color}
    />
  );

  const navigateToPostDetails = useCallback(
    (postId: string) => {
      router.push({
        pathname: `/post/[id]`,
        params: {
          id: postId,
          ...(isSelf ? { isOwnPost: "true" } : {}),
        },
      });
    },
    [router, isSelf],
  );

  const renderPostItem = useCallback(
    ({ item: postData }: { item: PostItem }) => (
      <Post data={postData} onPress={navigateToPostDetails} />
    ),
    [navigateToPostDetails],
  );

  const keyExtractor = useCallback((item: { id: string }) => item.id, []);

  const renderUserItem = useCallback(
    ({ item }: { item: DiscoverUser }) => <FollowListItem item={item} />,
    [],
  );

  return (
    <ThemedBackground>
      {!isSelf && <ProfileBackButton />}

      <View style={styles.container}>
        <Tabs.Container
          revealHeaderOnScroll={false}
          renderHeader={() => (
            <ProfileHeader
              userId={userId}
              username={username}
              bio={profile?.bio}
              jobTitle={profile?.jobTitle}
              avatarUrl={profile?.avatarUrl!}
              isSelf={isSelf}
            />
          )}
          renderTabBar={(props) => (
            <ProfileTabBar
              {...props}
              postsCount={postsCount}
              followersCount={followersCount}
              followingCount={followingCount}
              savedPostsCount={savedPostsCount}
              isSelf={isSelf}
            />
          )}
        >
          <Tabs.Tab name="posts" label={t('profile.posts')}>
            <Tabs.FlashList
              data={posts}
              renderItem={renderPostItem}
              keyExtractor={keyExtractor}
              numColumns={2}
              bounces={true}
              style={styles.list}
              contentContainerStyle={styles.listContainerStyle}
              showsVerticalScrollIndicator={false}
              refreshControl={refreshControl}
              onEndReached={() => {
                if (hasNextPostsPage && !isFetchingNextPosts) fetchNextPosts();
              }}
              onEndReachedThreshold={0.3}
              ListEmptyComponent={
                <UIEmptyState
                  icon="image-outline"
                  title={isSelf ? t('profile.noPostsSelfTitle') : t('profile.noPostsOtherTitle')}
                  description={
                    isSelf
                      ? t('profile.noPostsSelfDesc')
                      : t('profile.noPostsOtherDesc')
                  }
                />
              }
            />
          </Tabs.Tab>

          <Tabs.Tab name="followers" label={t('profile.followers')}>
            <Tabs.FlatList
              data={followers}
              renderItem={renderUserItem}
              keyExtractor={keyExtractor}
              ListHeaderComponent={SearchInput}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              style={styles.list}
              contentContainerStyle={styles.listContainerStyle}
              showsVerticalScrollIndicator={false}
              refreshControl={refreshControl}
              onEndReached={() => {
                if (hasNextFollowersPage && !isFetchingNextFollowers)
                  fetchNextFollowers();
              }}
              onEndReachedThreshold={0.3}
              ListEmptyComponent={
                <UIEmptyState
                  icon="people-outline"
                  title={t('profile.noFollowersTitle')}
                  description={
                    isSelf
                      ? t('profile.noFollowersSelfDesc')
                      : t('profile.noFollowersOtherDesc')
                  }
                />
              }
            />
          </Tabs.Tab>

          <Tabs.Tab name="followings" label={t('profile.followings')}>
            <Tabs.FlatList
              data={following}
              renderItem={renderUserItem}
              keyExtractor={keyExtractor}
              ListHeaderComponent={SearchInput}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              style={styles.list}
              contentContainerStyle={styles.listContainerStyle}
              showsVerticalScrollIndicator={false}
              refreshControl={refreshControl}
              onEndReached={() => {
                if (hasNextFollowingPage && !isFetchingNextFollowing)
                  fetchNextFollowing();
              }}
              onEndReachedThreshold={0.3}
              ListEmptyComponent={
                <UIEmptyState
                  icon="person-add-outline"
                  title={t('profile.noFollowingTitle')}
                  description={
                    isSelf
                      ? t('profile.noFollowingSelfDesc')
                      : t('profile.noFollowingOtherDesc')
                  }
                />
              }
            />
          </Tabs.Tab>

          {isSelf ? (
            <Tabs.Tab name="saves" label={t('profile.saves')}>
              <Tabs.FlashList
                data={savedPosts}
                renderItem={renderPostItem}
                keyExtractor={keyExtractor}
                numColumns={2}
                bounces={true}
                style={styles.list}
                contentContainerStyle={styles.listContainerStyle}
                showsVerticalScrollIndicator={false}
                refreshControl={refreshControl}
                onEndReached={() => {
                  if (hasNextSavedPostsPage && !isFetchingNextSavedPosts)
                    fetchNextSavedPosts();
                }}
                onEndReachedThreshold={0.3}
                ListEmptyComponent={
                  <UIEmptyState
                    icon="bookmark-outline"
                    title={t('profile.noSavedTitle')}
                    description={t('profile.noSavedDesc')}
                  />
                }
              />
            </Tabs.Tab>
          ) : null}
        </Tabs.Container>
      </View>
    </ThemedBackground>
  );
}

const ProfileBackButton = () => {
  return (
    <UIButton style={styles.backButton} onPress={router.back}>
      <Ionicons
        name="chevron-back"
        size={24}
        color={styles.backButtonIcon.color}
      />
    </UIButton>
  );
};

type ProfileTabBarProps = TabBarProps<string> & {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  savedPostsCount: number;
  isSelf: boolean;
};

const ProfileTabBar = (props: ProfileTabBarProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("posts");

  useAnimatedReaction(
    () => props.focusedTab.value,
    (value, prev) => {
      if (value !== prev) {
        runOnJS(setActiveTab)(value);
      }
    },
    [props.focusedTab],
  );

  const isPostsTabFocused = activeTab === "posts";

  const stats: ProfileStat[] = [
    {
      id: "1",
      name: "posts",
      title: t('profile.posts'),
      iconName: "document-text-outline",
      quantity: props.postsCount,
    },
    {
      id: "2",
      name: "followers",
      title: t('profile.followers'),
      iconName: "people-outline",
      quantity: props.followersCount,
    },
    {
      id: "3",
      name: "followings",
      title: t('profile.followings'),
      iconName: "grid-outline",
      quantity: props.followingCount,
    },
  ];

  if (props.isSelf) {
    stats.push({
      id: "4",
      name: "saves",
      title: t('profile.saves'),
      iconName: "bookmark-outline",
      quantity: props.savedPostsCount,
    });
  }

  const onPress = useCallback(
    (name: string) => {
      props.onTabPress(name);
    },
    [props],
  );

  return (
    <View style={styles.statsTabBar}>
      <View style={styles.statsCard}>
        {stats.map((statConfig, index) => (
          <React.Fragment key={statConfig.id}>
            <View style={styles.statItemContainer}>
              <StatsButton
                name={statConfig.name}
                title={statConfig.title}
                iconName={statConfig.iconName}
                quantity={statConfig.quantity}
                onPress={onPress}
                activeTab={activeTab}
              />
            </View>
            {index < stats.length - 1 && (
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

      {isPostsTabFocused && (
        <View style={styles.postsHeader}>
          <UIText size="lg" weight="bold" style={styles.text}>
            {t('profile.posts')}
          </UIText>
          {props.isSelf && <NewPostButton />}
        </View>
      )}
    </View>
  );
};

type StatsButtonProps = {
  name: string;
  title: string;
  iconName: IconName;
  quantity: number;
  onPress: (name: string) => void;
  activeTab: string;
};

const StatsButton = memo(
  ({
    name,
    title,
    iconName,
    quantity,
    onPress,
    activeTab,
  }: StatsButtonProps) => {
    const isSelected = activeTab === name;

    const handlePress = useCallback(() => {
      onPress(name);
    }, [name, onPress]);

    return (
      <UIButton
        style={[styles.statButton, isSelected && styles.statButtonActive]}
        onPress={handlePress}
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
        <UIText
          style={styles.statTitle}
          size="xxs"
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.7}
          ellipsizeMode="tail"
        >
          {title}
        </UIText>
      </UIButton>
    );
  },
);

const NewPostButton = memo(() => {
  const router = useRouter();

  const navigateToNewPost = () => {
    router.push("/new-post-image");
  };

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

const styles = StyleSheet.create((theme, rt) => ({
  refreshControl: {
    color: theme.colors.accent,
  },
  container: {
    flex: 1,
    overflow: "hidden",
  },
  list: {
    flex: 1,
    width: "100%",
  },

  backButton: {
    zIndex: 1,
    width: theme.utils.s(40),
    height: theme.utils.s(40),
    justifyContent: "center",
    alignItems: "center",
  },

  listContainerStyle: {
    paddingBottom: theme.utils.vs(100),
  },
  listSeparator: { height: 20 },

  statsTabBar: {
    backgroundColor: theme.colors.background,
  },

  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.utils.s(16),
    paddingBottom: theme.utils.vs(10),
    gap: theme.utils.s(10),
  },

  text: {
    color: theme.colors.primaryText,
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
    borderBottomWidth: theme.utils.vs(2),
    borderBottomColor: theme.colors.background,
  },
  statButtonActive: {
    borderBottomColor: theme.colors.accent,
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
    color: theme.colors.primaryText,
    height: theme.utils.s(20),
  },

  followButton: {
    paddingHorizontal: theme.utils.s(20),
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

  backButtonIcon: {
    color: theme.colors.primaryText,
  },
}));
