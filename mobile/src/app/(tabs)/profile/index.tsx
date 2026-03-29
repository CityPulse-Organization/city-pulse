import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { Icon, IconInfo, Post, ThemedBackground } from "@/src/components";
import { UIButton, UIEmptyState, UIInput, UIText } from "@/src/ui";
import { useRouter } from "expo-router";
import { ComponentProps, memo, useCallback, useState } from "react";
import React from "react";
import { RefreshControl, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLogout } from "@/src/hooks";
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

const SearchUserItem = memo(({ item }: { item: DiscoverUser }) => {
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

export default function ProfileScreen() {
  const router = useRouter();
  const theme = UnistylesRuntime.getTheme();
  const {
    userId,
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
  } = useProfile();

  const refreshControl = (
    <RefreshControl
      refreshing={isRefetching}
      onRefresh={refetchAll}
      tintColor={theme.colors.accent}
    />
  );

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

  const keyExtractor = useCallback((item: { id: string }) => item.id, []);

  const renderUserItem = useCallback(
    ({ item }: { item: DiscoverUser }) => <SearchUserItem item={item} />,
    [],
  );

  return (
    <ThemedBackground>
      <View style={styles.container}>
        <Tabs.Container
          revealHeaderOnScroll={true}
          renderHeader={() => (
            <ProfileHeader
              followersCount={followersCount}
              followingCount={followingCount}
              userId={userId}
            />
          )}
          renderTabBar={(props) => (
            <ProfileTabBar
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
                if (hasNextPostsPage && !isFetchingNextPosts)
                  fetchNextPosts();
              }}
              onEndReachedThreshold={0.3}
              ListEmptyComponent={
                <UIEmptyState
                  icon="image-outline"
                  title="No Posts Yet"
                  description="Share your first photo to see it here!"
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
                  description="When people follow you, they'll appear here."
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
                  description="Start following people to see their activities."
                />
              }
            />
          </Tabs.Tab>
          <Tabs.Tab name="saves" label="Saves">
            <Tabs.FlashList
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
        </Tabs.Container>
      </View>
    </ThemedBackground>
  );
}

type ProfileHeaderProps = {
  followersCount: number;
  followingCount: number;
  userId?: string;
};

const ProfileHeader = ({
  followersCount,
  followingCount,
  userId,
}: ProfileHeaderProps) => {
  const router = useRouter();

  const navigateToEditProfile = useCallback(() => {
    router.navigate("/(tabs)/profile/edit-profile");
  }, [router]);

  const { mutate: logout } = useLogout();

  const onLogoutPress = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatarWrapper}>
        <Icon
          size="medium"
          profileImageUrl={undefined} // No avatar URL from backend yet
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
            {userId ? `${userId.substring(0, 8)}...` : "Loading..."}
          </UIText>

          <UIButton onPress={onLogoutPress} isLoading={false}>
            <Ionicons
              color={styles.settingsIconButton.color}
              size={styles.settingsIconButton.height}
              name="menu-outline"
            />
          </UIButton>
        </View>

        {/* Temporary placeholders for job/bio until backend adds them */}
        <View style={[styles.row, styles.jobRow]}>
          <UIText size="sm" style={styles.roleText}>
            User
          </UIText>

          <Ionicons
            color={styles.jobIcon.color}
            size={styles.jobIcon.height}
            name="checkmark-circle"
          />
        </View>

        <UIText size="sm" style={styles.bioText}>
          Welcome to my City Pulse profile!
        </UIText>
      </View>
    </View>
  );
};

type ProfileTabBarProps = TabBarProps<string> & {
  postsCount: number;
  followersCount: number;
  followingCount: number;
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
    {
      id: "4",
      name: "saves",
      title: "Saves",
      iconName: "bookmark-outline",
      quantity: 0,
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
          <NewPostButton />
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

  followButton: {
    marginTop: theme.utils.vs(6),
    paddingHorizontal: theme.utils.s(14),
    paddingVertical: theme.utils.vs(5),
    borderRadius: theme.utils.ms(16),
    backgroundColor: theme.colors.accent,
    alignSelf: "flex-start",
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
