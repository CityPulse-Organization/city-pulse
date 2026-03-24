import { StyleSheet } from "react-native-unistyles";
import {
  Icon,
  IconInfo,
  Post,
  PostItem,
  POSTS,
  ThemedBackground,
} from "@/src/components";
import { UIButton, UIInput, UIText } from "@/src/ui";
import { useRouter } from "expo-router";
import { ComponentProps, memo, useCallback, useState } from "react";
import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLogout } from "@/src/hooks";
import { TabBarProps, Tabs } from "react-native-collapsible-tab-view";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { DiscoverUser } from "@/src/types";

export const SEARCH_USERS: DiscoverUser[] = [
  {
    id: "1",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "no",
  },
  {
    id: "2",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Journalist",
  },
  {
    id: "3",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Habd worker",
  },
  {
    id: "4",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "no",
  },
  {
    id: "5",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "no",
  },
  {
    id: "6",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Software Engineer",
  },
  {
    id: "7",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Software Engineer",
  },
  {
    id: "8",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Software Engineer",
  },
  {
    id: "9",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "no",
  },
  {
    id: "10",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Software Engineer",
  },
  {
    id: "11",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Software Engineer",
  },
  {
    id: "12",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Software Engineer",
  },
];

type IconName = ComponentProps<typeof Ionicons>["name"];

const PROFILE_STATS_CONFIG: {
  id: string;
  name: string;
  title: string;
  iconName: IconName;
  quantity: number;
}[] = [
  {
    id: "1",
    name: "posts",
    title: "Posts",
    iconName: "document-text-outline",
    quantity: 398,
  },
  {
    id: "2",
    name: "followers",
    title: "Followers",
    iconName: "people-outline",
    quantity: 398,
  },
  {
    id: "3",
    name: "followings",
    title: "Followings",
    iconName: "grid-outline",
    quantity: 34,
  },
  {
    id: "4",
    name: "saves",
    title: "Saves",
    iconName: "bookmark-outline",
    quantity: 34,
  },
];

const ItemSeparator = memo(() => <View style={styles.listSeparator} />);

const SearchUserItem = memo(({ item }: { item: DiscoverUser }) => (
  <View style={styles.itemContainer}>
    <IconInfo
      username={item.username}
      profileImageUrl={item.profileImageUrl}
      statusText={item.job}
    />
  </View>
));

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
          renderHeader={ProfileHeader}
          renderTabBar={ProfileTabBar}
        >
          <Tabs.Tab name="posts" label="Posts">
            <Tabs.FlatList
              data={POSTS}
              renderItem={renderPostItem}
              keyExtractor={keyExtractor}
              numColumns={2}
              bounces={false}
              style={styles.list}
              contentContainerStyle={styles.listContainerStyle}
              showsVerticalScrollIndicator={false}
            />
          </Tabs.Tab>
          <Tabs.Tab name="followers" label="Followers">
            <Tabs.FlatList
              data={SEARCH_USERS}
              renderItem={renderUserItem}
              keyExtractor={keyExtractor}
              ItemSeparatorComponent={ItemSeparator}
              ListHeaderComponent={SearchInput}
              numColumns={2}
              bounces={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              style={styles.list}
              contentContainerStyle={styles.listContainerStyle}
              showsVerticalScrollIndicator={false}
            />
          </Tabs.Tab>
          <Tabs.Tab name="followings" label="Followings">
            <Tabs.FlatList
              data={SEARCH_USERS}
              renderItem={renderUserItem}
              keyExtractor={keyExtractor}
              ItemSeparatorComponent={ItemSeparator}
              ListHeaderComponent={SearchInput}
              numColumns={2}
              bounces={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              style={styles.list}
              contentContainerStyle={styles.listContainerStyle}
              showsVerticalScrollIndicator={false}
            />
          </Tabs.Tab>
          <Tabs.Tab name="saves" label="Saves">
            <Tabs.FlatList
              data={POSTS}
              renderItem={renderPostItem}
              keyExtractor={keyExtractor}
              numColumns={2}
              bounces={false}
              style={styles.list}
              contentContainerStyle={styles.listContainerStyle}
              showsVerticalScrollIndicator={false}
            />
          </Tabs.Tab>
        </Tabs.Container>
      </View>
    </ThemedBackground>
  );
}

const ProfileHeader = () => {
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

          <UIButton onPress={onLogoutPress} isLoading={false}>
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
};

const ProfileTabBar = (props: TabBarProps<string>) => {
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

  const onPress = useCallback(
    (name: string) => {
      props.onTabPress(name);
    },
    [props],
  );

  return (
    <View style={styles.statsTabBar}>
      <View style={styles.statsCard}>
        {PROFILE_STATS_CONFIG.map((statConfig, index) => (
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
}));
