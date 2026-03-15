import { IconInfo, Post, POSTS, ThemedBackground } from "@/src/components";
import { UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { BlurView } from "expo-blur";
import { memo, useCallback, useMemo, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import {
  TabBarProps,
  Tabs,
  useFocusedTab,
} from "react-native-collapsible-tab-view";
import { PostItem } from "@/src/components/Post";
import { router } from "expo-router";

const SEARCH_USERS = [
  {
    id: "1",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "no",
    isBroadcasting: true,
  },
  {
    id: "2",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Journalist",
    isBroadcasting: true,
  },
  {
    id: "3",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Habd worker",
    isBroadcasting: true,
  },
  {
    id: "4",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "no",
    isBroadcasting: false,
  },
  {
    id: "5",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "no",
    isBroadcasting: false,
  },
  {
    id: "6",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Software Engineer",
    isBroadcasting: false,
  },
  {
    id: "7",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Software Engineer",
    isBroadcasting: false,
  },
  {
    id: "8",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Software Engineer",
    isBroadcasting: false,
  },
  {
    id: "9",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "no",
    isBroadcasting: false,
  },
  {
    id: "10",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Software Engineer",
    isBroadcasting: false,
  },
  {
    id: "11",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Software Engineer",
    isBroadcasting: false,
  },
  {
    id: "12",
    username: "kyrylo1",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    job: "Software Engineer",
    isBroadcasting: false,
  },
];

const PLACES = [
  {
    id: "1",
    name: "Union Square",
    location: "San Francisco, CA",
    type: "Park",
  },
  {
    id: "2",
    name: "Golden Gate Bridge",
    location: "San Francisco, CA",
    type: "Landmark",
  },
  {
    id: "3",
    name: "Fisherman's Wharf",
    location: "San Francisco, CA",
    type: "Tourist Attraction",
  },
  { id: "4", name: "Pier 39", location: "San Francisco, CA", type: "Shopping" },
  {
    id: "5",
    name: "Alcatraz Island",
    location: "San Francisco, CA",
    type: "Historical Site",
  },
  {
    id: "6",
    name: "Chinatown",
    location: "San Francisco, CA",
    type: "Neighborhood",
  },
];

type SearchUser = (typeof SEARCH_USERS)[0];
type Place = (typeof PLACES)[0];

const SearchItem = memo(({ item }: { item: SearchUser }) => (
  <View style={styles.itemContainer}>
    <IconInfo
      isBroadCasting={item.isBroadcasting}
      username={item.username}
      profileImageUrl={item.profileImageUrl}
      statusText={item.job}
    />
  </View>
));

const PlaceItem = memo(({ item }: { item: Place }) => (
  <View style={styles.placeItemContainer}>
    <View style={styles.placeIconContainer}>
      <Ionicons
        name="location"
        size={20}
        color={UnistylesRuntime.getTheme().colors.primaryText}
      />
    </View>
    <View style={styles.placeTextContainer}>
      <UIText weight="bold">{item.name}</UIText>
      <UIText size="sm" style={styles.placeLocationText}>
        {item.type} • {item.location}
      </UIText>
    </View>
  </View>
));

const ItemSeparator = memo(() => <View style={styles.separator} />);

const SearchTab = ({
  name,
  label,
  onPress,
  focusedTab,
  icon,
}: {
  name: string;
  label: string;
  onPress: () => void;
  focusedTab: any;
  icon?: React.ReactNode;
}) => {
  const theme = UnistylesRuntime.getTheme();
  const activeColor = theme.colors.primaryText;
  const inactiveColor = theme.colors.background;
  const activeTextColor = theme.colors.white;
  const inactiveTextColor = theme.colors.gray;

  const animatedStyle = useAnimatedStyle(() => {
    const isSelected = focusedTab.value === name;
    return {
      borderColor: isSelected ? activeColor : inactiveColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const isSelected = focusedTab.value === name;
    return {
      color: isSelected ? activeTextColor : inactiveTextColor,
    };
  });

  return (
    <Pressable onPress={onPress} style={styles.tab}>
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        {icon}
        <Animated.Text style={[styles.tabTextBase, animatedTextStyle]}>
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

const SearchTabBar = (props: TabBarProps<string>) => {
  const onPeoplePress = useCallback(() => {
    props.onTabPress("people");
  }, [props]);
  const onPostsPress = useCallback(() => {
    props.onTabPress("posts");
  }, [props]);
  const onPlacesPress = useCallback(() => {
    props.onTabPress("places");
  }, [props]);
  return (
    <View style={styles.tabBar}>
      <SearchTab
        name="people"
        label="People"
        onPress={onPeoplePress}
        focusedTab={props.focusedTab}
        icon={<Ionicons name="people" size={20} style={styles.tabIcon} />}
      />
      <SearchTab
        name="posts"
        label="Posts"
        onPress={onPostsPress}
        focusedTab={props.focusedTab}
        icon={<Ionicons name="list" size={20} style={styles.tabIcon} />}
      />
      <SearchTab
        name="places"
        label="Places"
        onPress={onPlacesPress}
        focusedTab={props.focusedTab}
        icon={<Ionicons name="location" size={20} style={styles.tabIcon} />}
      />
    </View>
  );
};

export default function SearchScreen() {
  const [input, setInput] = useState("");

  const filteredUsers = useMemo(() => {
    if (!input.trim()) return SEARCH_USERS;
    const query = input.toLowerCase().trim();
    return SEARCH_USERS.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.job.toLowerCase().includes(query),
    );
  }, [input]);

  const renderItem = useCallback(
    ({ item }: { item: SearchUser }) => <SearchItem item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: { id: string }) => item.id, []);

  const openPost = useCallback(
    ({ id }: { id: string }) => {
      router.push({
        pathname: `/post/[id]`,
        params: {
          id,
        },
      });
    },
    [router],
  );
  const filteredPosts = useMemo(() => {
    if (!input.trim()) return POSTS;
    const query = input.toLowerCase().trim();
    return POSTS.filter(
      (post) =>
        post.username.toLowerCase().includes(query) ||
        post.description?.toLowerCase().includes(query) ||
        post.location.toLowerCase().includes(query),
    );
  }, [input]);

  const filteredPlaces = useMemo(() => {
    if (!input.trim()) return PLACES;
    const query = input.toLowerCase().trim();
    return PLACES.filter(
      (place) =>
        place.name.toLowerCase().includes(query) ||
        place.location.toLowerCase().includes(query) ||
        place.type.toLowerCase().includes(query),
    );
  }, [input]);

  const renderPost = useCallback(
    ({ item }: { item: PostItem }) => (
      <Post data={item} onPress={() => openPost({ id: item.id })} />
    ),
    [openPost],
  );

  const renderPlace = useCallback(
    ({ item }: { item: Place }) => <PlaceItem item={item} />,
    [],
  );

  return (
    <ThemedBackground withoutSafeArea={true}>
      <View style={styles.searchHeader}>
        <BlurView
          tint={UnistylesRuntime.themeName}
          intensity={60}
          style={styles.searchContainer}
        >
          <Ionicons name="search" size={20} style={styles.searchIcon} />
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Search..."
            placeholderTextColor={styles.placeHolderTextColor.color}
            style={styles.search}
            selectionColor={styles.icon.color}
          />
          {input.length > 0 && (
            <Pressable onPress={() => setInput("")}>
              <Ionicons
                name="close-circle"
                size={20}
                style={styles.clearIcon}
              />
            </Pressable>
          )}
        </BlurView>
      </View>
      <Tabs.Container renderTabBar={SearchTabBar}>
        <Tabs.Tab name="people" label="People">
          <Tabs.FlashList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ItemSeparator}
            getItemType={() => "SearchUser"}
            style={styles.list}
            numColumns={2}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.containerStyle}
            showsVerticalScrollIndicator={false}
          />
        </Tabs.Tab>
        <Tabs.Tab name="posts" label="Posts">
          <Tabs.FlashList
            data={filteredPosts}
            renderItem={renderPost}
            keyExtractor={keyExtractor}
            getItemType={() => "PostItem"}
            numColumns={2}
            style={styles.list}
            bounces={false}
            contentContainerStyle={styles.containerStyle}
            showsVerticalScrollIndicator={false}
          />
        </Tabs.Tab>

        <Tabs.Tab name="places" label="Places">
          <Tabs.FlashList
            data={filteredPlaces}
            renderItem={renderPlace}
            keyExtractor={keyExtractor}
            bounces={false}
            ItemSeparatorComponent={ItemSeparator}
            contentContainerStyle={styles.containerStyle}
            showsVerticalScrollIndicator={false}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  tab: {
    flex: 1,
  },
  tabTextBase: {
    fontSize: theme.utils.s(16),
  },
  title: {
    color: theme.colors.primaryText,
    fontSize: 20,
    fontWeight: "bold",
  },
  searchHeader: {
    paddingHorizontal: theme.utils.s(16),
    paddingTop: rt.insets.top + theme.utils.vs(10),
    paddingBottom: theme.utils.vs(15),
    backgroundColor: theme.colors.background,
  },
  tabIcon: {
    color: theme.colors.accent,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.utils.s(22),
    paddingHorizontal: theme.utils.s(15),
    height: theme.utils.vs(44),
    borderWidth: 1,
    borderColor: theme.colors.accent,
    overflow: "hidden",
  },
  itemContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  separator: { height: 20 },
  list: { flex: 1, width: "100%", paddingVertical: theme.utils.vs(10) },
  containerStyle: {
    padding: theme.utils.s(20),
    paddingTop: theme.utils.vs(30),
    paddingBottom: theme.utils.vs(100),
  },
  placeItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.utils.vs(12),
  },
  placeIconContainer: {
    width: theme.utils.s(40),
    height: theme.utils.s(40),
    borderRadius: theme.utils.s(20),
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.utils.s(12),
  },
  placeTextContainer: {
    flex: 1,
  },
  placeLocationText: {
    color: theme.colors.gray,
    marginTop: theme.utils.vs(2),
  },
  glass: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",

    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderWidth: 0,
    overflow: "hidden",
    alignItems: "center",
  },
  search: {
    flex: 1,
    fontSize: theme.utils.s(16),
    color: theme.colors.primaryText,
    paddingVertical: theme.utils.vs(8),
    height: "100%",
  },
  searchIcon: {
    color: theme.colors.icon,
    marginRight: theme.utils.s(10),
  },
  clearIcon: {
    color: theme.colors.icon,
    opacity: 0.7,
  },
  iconButton: {
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  icon: {
    color: theme.colors.icon,
  },
  placeHolderTextColor: {
    color: theme.colors.accent,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  tabContent: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: theme.utils.vs(2),
    alignItems: "center",
    paddingVertical: theme.utils.vs(12),
    flex: 1,
    gap: theme.utils.s(6),
  },
}));
