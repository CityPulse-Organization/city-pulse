import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { Icon, IconInfo, Post, ThemedBackground } from "@/src/components";
import {
  UIBackButton,
  UIButton,
  UIEmptyState,
  UIInput,
  UIText,
} from "@/src/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ComponentProps, memo, useCallback, useState } from "react";
import React from "react";
import { Pressable, RefreshControl, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { TabBarProps, Tabs } from "react-native-collapsible-tab-view";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { DiscoverUser, PostItem } from "@/src/types";
import { useProfile } from "@/src/hooks/profile/useProfile";
import { useFollow } from "@/src/hooks/useFollow";

type IconName = ComponentProps<typeof Ionicons>["name"];

type ProfileStat = {
  id: string;
  name: string;
  title: string;
  iconName: IconName;
  quantity: number;
};

const ItemSeparator = memo(() => <View style={styles.listSeparator} />);

const UserItem = memo(({ item }: { item: DiscoverUser }) => {
  const { isFollowing, toggleFollow, isPending, isSelf } = useFollow(item.id);

  return (
    <View style={styles.itemContainer}>
      <IconInfo
        username={item.username}
        profileImageUrl={item.profileImageUrl}
        statusText={item.job}
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
            size="xxs"
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
  );
});

const SearchInput = memo(() => {
  const [input, setInput] = useState("");

  return (
    <UIInput
      leftElement={
        <Ionicons
          name="search"
          size={styles.iconInput.height}
          color={styles.iconInput.color}
        />
      }
      containerStyle={styles.searchContainer}
      inputStyle={styles.searchInput}
      placeholder={"Search..."}
      placeholderTextColor={styles.placeholderInput.color}
      value={input}
      onChangeText={setInput}
    />
  );
});

export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = UnistylesRuntime.getTheme();

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
      tintColor={theme.colors.accent}
    />
  );

  const navigateToPostDetails = useCallback(
    (postId: string) => {
      router.push({
        pathname: `/post/[id]`,
        params: {
          id: postId,
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

  const keyExtractor = useCallback((item: { id: string }) => item.id, []);

  const renderUserItem = useCallback(
    ({ item }: { item: DiscoverUser }) => <UserItem item={item} />,
    [],
  );

  return (
    <ThemedBackground>
      <UIBackButton />

      <View style={styles.container}>
        <Tabs.Container
          revealHeaderOnScroll={false}
          renderHeader={() => (
            <UserHeader
              userId={userId}
              username={username}
              bio={profile?.bio}
              jobTitle={profile?.jobTitle}
              avatarUrl={profile?.avatarUrl}
            />
          )}
          renderTabBar={(props) => (
            <UserTabBar
              {...props}
              postsCount={postsCount}
              followersCount={followersCount}
              followingCount={followingCount}
            />
          )}
        >
          <Tabs.Tab name="posts" label="Posts">
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
                  title="No Posts"
                  description="This user hasn't shared any photos yet."
                />
              }
            />
          </Tabs.Tab>
          <Tabs.Tab name="followers" label="Followers">
            <Tabs.FlashList
              data={followers}
              renderItem={renderUserItem}
              keyExtractor={keyExtractor}
              ItemSeparatorComponent={ItemSeparator}
              ListHeaderComponent={SearchInput}
              numColumns={2}
              bounces={true}
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
                  description="When people follow this user, they'll appear here."
                />
              }
            />
          </Tabs.Tab>
          <Tabs.Tab name="followings" label="Followings">
            <Tabs.FlashList
              data={following}
              renderItem={renderUserItem}
              keyExtractor={keyExtractor}
              ItemSeparatorComponent={ItemSeparator}
              ListHeaderComponent={SearchInput}
              numColumns={2}
              bounces={true}
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
                  description="This user isn't following anyone yet."
                />
              }
            />
          </Tabs.Tab>
        </Tabs.Container>
      </View>
    </ThemedBackground>
  );
}

type UserHeaderProps = {
  userId?: string;
  username?: string;
  bio?: string;
  jobTitle?: string;
  avatarUrl?: string;
};

const UserHeader = ({
  userId,
  username,
  bio,
  jobTitle,
  avatarUrl,
}: UserHeaderProps) => {
  const { isFollowing, toggleFollow, isPending, isSelf } = useFollow(userId!);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatarWrapper}>
        <Icon size="medium" profileImageUrl={avatarUrl} />
      </View>

      <View style={styles.infoContainer}>
        <View style={[styles.row, styles.usernameRow]}>
          <UIText size="lg" weight="bold" style={styles.text}>
            {username ??
              (userId ? `${userId.substring(0, 8)}...` : "Loading...")}
          </UIText>

          {!isSelf && (
            <UIButton
              style={[
                styles.actionFollowButton,
                isFollowing && styles.followButtonActive,
              ]}
              onPress={toggleFollow}
              isLoading={isPending}
            >
              <UIText
                size="xxs"
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

type UserTabBarProps = TabBarProps<string> & {
  postsCount: number;
  followersCount: number;
  followingCount: number;
};

const UserTabBar = (props: UserTabBarProps) => {
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

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  list: {
    flex: 1,
    width: "100%",
  },

  listContainerStyle: {
    paddingBottom: theme.utils.vs(100),
    minHeight: rt.screen.height,
  },
  listSeparator: { height: 20 },

  statsTabBar: {
    backgroundColor: theme.colors.background,
  },
  itemContainer: {
    width: "50%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: theme.utils.s(6),
  },

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
  infoContainer: {
    flexGrow: 1,
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

  iconInput: {
    color: theme.colors.accent,
    height: theme.utils.s(20),
  },
  searchContainer: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: theme.utils.ms(22),
    paddingHorizontal: theme.utils.s(16),
    marginHorizontal: theme.utils.s(20),
    marginBottom: theme.utils.vs(14),
  },
  placeholderInput: {
    color: theme.colors.muted,
  },
  searchInput: {
    paddingVertical: theme.utils.vs(10),
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

  followButton: {
    marginTop: theme.utils.vs(6),
    paddingHorizontal: theme.utils.s(14),
    paddingVertical: theme.utils.vs(5),
    borderRadius: theme.utils.ms(16),
    backgroundColor: theme.colors.accent,
    alignSelf: "flex-start",
  },
  actionFollowButton: {
    paddingHorizontal: theme.utils.s(14),
    paddingVertical: theme.utils.vs(5),
    borderRadius: theme.utils.ms(16),
    backgroundColor: theme.colors.accent,
  },
  followButtonActive: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.muted,
  },
  followButtonText: {
    color: theme.colors.white,
  },
  followButtonTextActive: {
    color: theme.colors.muted,
  },
}));
