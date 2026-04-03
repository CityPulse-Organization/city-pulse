import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { IconInfo, Post, ThemedBackground } from "@/src/components";
import {
  UIButton,
  UIEmptyState,
  UIText,
} from "@/src/ui";
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



type IconName = ComponentProps<typeof Ionicons>["name"];

type ProfileStat = {
  id: string;
  name: string;
  title: string;
  iconName: IconName;
  quantity: number;
};


const FollowListItem = memo(({ item }: { item: DiscoverUser }) => {
  const { isFollowing, toggleFollow, isPending, isSelf } = useFollow(item.id);
  const navigateToProfile = useCallback(() => {
    router.push(`/user/${item.id}`);
  }, [item.id]);

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
            {isFollowing ? "Unfollow" : "Follow"}
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
              avatarUrl={profile?.avatarUrl}
              isSelf={isSelf}
            />
          )}
          renderTabBar={(props) => (
            <ProfileTabBar
              {...props}
              postsCount={postsCount}
              followersCount={followersCount}
              followingCount={followingCount}
              isSelf={isSelf}
            />
          )}
        >
          <Tabs.Tab name="posts" label="Posts">
            <Tabs.FlatList
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
                  title={isSelf ? "No Posts Yet" : "No Posts"}
                  description={
                    isSelf
                      ? "Share your first photo to see it here!"
                      : "This user hasn't shared any photos yet."
                  }
                />
              }
            />
          </Tabs.Tab>

          <Tabs.Tab name="followers" label="Followers">
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
                  title="No Followers"
                  description={
                    isSelf
                      ? "When people follow you, they'll appear here."
                      : "When people follow this user, they'll appear here."
                  }
                />
              }
            />
          </Tabs.Tab>

          <Tabs.Tab name="followings" label="Followings">
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
                  title="No Following"
                  description={
                    isSelf
                      ? "Start following people to see their activities."
                      : "This user isn't following anyone yet."
                  }
                />
              }
            />
          </Tabs.Tab>

          {isSelf ? (
            <Tabs.Tab name="saves" label="Saves">
              <Tabs.FlatList
                data={[]}
                renderItem={renderPostItem}
                keyExtractor={keyExtractor}
                numColumns={2}
                bounces={true}
                style={styles.list}
                contentContainerStyle={styles.listContainerStyle}
                showsVerticalScrollIndicator={false}
                refreshControl={refreshControl}
                ListEmptyComponent={
                  <UIEmptyState
                    icon="bookmark-outline"
                    title="No Saved Posts"
                    description="Keep track of what you love by saving posts."
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
  const theme = UnistylesRuntime.getTheme();
  return (
    <UIButton style={styles.backButton} onPress={router.back}>
      <Ionicons
        name="chevron-back"
        size={24}
        color={theme.colors.primaryText}
      />
    </UIButton>
  );
};


type ProfileTabBarProps = TabBarProps<string> & {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isSelf: boolean;
};

const ProfileTabBar = (props: ProfileTabBarProps) => {
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
      title: "Posts",
      iconName: "document-text-outline",
      quantity: props.postsCount,
    },
    {
      id: "2",
      name: "followers",
      title: "Followers",
      iconName: "people-outline",
      quantity: props.followersCount,
    },
    {
      id: "3",
      name: "followings",
      title: "Followings",
      iconName: "grid-outline",
      quantity: props.followingCount,
    },
  ];

  if (props.isSelf) {
    stats.push({
      id: "4",
      name: "saves",
      title: "Saves",
      iconName: "bookmark-outline",
      quantity: 0,
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
            Posts
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
        <UIText style={styles.statTitle} size="xxs">
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
    alignItems: "flex-start",
    paddingHorizontal: theme.utils.s(16),
    paddingBottom: theme.utils.vs(10),
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
    backgroundColor: theme.colors.mutedAccent,
    alignSelf: "center",
    justifyContent: "center",
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
