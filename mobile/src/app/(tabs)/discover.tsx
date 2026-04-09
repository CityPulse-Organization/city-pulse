import { IconInfo, Post, ThemedBackground } from "@/src/components";
import { UIText, UIEmptyState } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { memo, useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  TextInput,
  View,
} from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { TabBarProps, Tabs } from "react-native-collapsible-tab-view";
import { router } from "expo-router";
import { useSearchUsers } from "@/src/hooks/useSearchUsers";
import { usePulse } from "@/src/hooks/usePulse";
import { useSearchPosts } from "@/src/hooks/useSearchPosts";
import { DiscoverUser, PostItem } from "@/src/types";

const DiscoverItem = memo(({ item }: { item: DiscoverUser }) => {
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
    </View>
  );
});

const ItemSeparator = memo(() => <View style={styles.separator} />);

const DiscoverTab = ({
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
  const activeColor = theme.colors.accent;
  const inactiveColor = theme.colors.background;

  const animatedStyle = useAnimatedStyle(() => {
    const isSelected = focusedTab.value === name;
    return {
      borderColor: isSelected ? activeColor : inactiveColor,
    };
  });

  return (
    <Pressable onPress={onPress} style={styles.tab}>
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        {icon}
        <Animated.Text style={styles.tabTextBase}>{label}</Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

const DiscoverTabBar = (props: TabBarProps<string>) => {
  const onPulsePress = useCallback(() => {
    props.onTabPress("pulse");
  }, [props]);
  const onPeoplePress = useCallback(() => {
    props.onTabPress("people");
  }, [props]);
  const onPostsPress = useCallback(() => {
    props.onTabPress("posts");
  }, [props]);

  return (
    <View style={styles.tabBar}>
      <DiscoverTab
        name="pulse"
        label="Pulse"
        onPress={onPulsePress}
        focusedTab={props.focusedTab}
        icon={<Ionicons name="pulse" size={20} style={styles.pulseIcon} />}
      />
      <DiscoverTab
        name="people"
        label="People"
        onPress={onPeoplePress}
        focusedTab={props.focusedTab}
        icon={<Ionicons name="people" size={20} style={styles.tabIcon} />}
      />
      <DiscoverTab
        name="posts"
        label="Posts"
        onPress={onPostsPress}
        focusedTab={props.focusedTab}
        icon={<Ionicons name="list" size={20} style={styles.tabIcon} />}
      />
    </View>
  );
};

export default function DiscoverScreen() {
  const [input, setInput] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchUsers,
    isRefetching: isRefetchingUsers,
  } = useSearchUsers(input, ["username,asc"]);

  const {
    data: pulseData,
    fetchNextPage: fetchNextPulse,
    hasNextPage: hasNextPulsePage,
    isFetchingNextPage: isFetchingNextPulse,
    refetch: refetchPulse,
    isRefetching: isRefetchingPulse,
  } = usePulse(input);

  const {
    data: postsData,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPostsPage,
    isFetchingNextPage: isFetchingNextPosts,
    refetch: refetchPosts,
    isRefetching: isRefetchingPosts,
  } = useSearchPosts(input);

  const paginatedUsers = useMemo(() => {
    if (data?.pages && data.pages.length > 0) {
      return data.pages.flatMap((page) =>
        page.content.map((u) => ({
          id: u.id,
          username: u.username,
          profileImageUrl: u.avatarUrl ?? "",
          job: u.jobTitle ?? "",
        })),
      );
    }
    return [];
  }, [data]);

  const pulsePosts = useMemo(() => {
    if (pulseData?.pages) {
      return pulseData.pages.flatMap((page) =>
        page.content.map((p) => {
          const date = new Date(p.createdAt);
          const timeLabel = !isNaN(date.getTime())
            ? `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
            : "Live";

          return {
            id: String(p.id),
            username: p.username ?? "User",
            profileImageUrl: p.avatarUrl ?? "",
            accidentTime: timeLabel,
            imagesUrl: [p.imageUrl],
            description: p.caption ?? "",
            location: "",
          };
        }),
      );
    }
    return [];
  }, [pulseData]);

  const paginatedPosts = useMemo(() => {
    if (postsData?.pages) {
      return postsData.pages.flatMap((page) =>
        page.content.map((p) => {
          const date = new Date(p.createdAt);
          const dateLabel = !isNaN(date.getTime())
            ? `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`
            : "";

          return {
            id: String(p.id),
            username: p.username ?? "User",
            profileImageUrl: p.avatarUrl ?? "",
            accidentTime: dateLabel,
            imagesUrl: [p.imageUrl],
            description: p.caption ?? "",
            location: "",
          };
        }),
      );
    }
    return [];
  }, [postsData]);

  const renderItem = useCallback(
    ({ item }: { item: DiscoverUser }) => <DiscoverItem item={item} />,
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

  const renderPost = useCallback(
    ({ item }: { item: PostItem }) => (
      <Post data={item} onPress={() => openPost({ id: item.id })} />
    ),
    [openPost],
  );

  const clearSearch = useCallback(() => {
    setInput("");
  }, []);

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
            <Pressable onPress={clearSearch}>
              <Ionicons
                name="close-circle"
                size={20}
                style={styles.clearIcon}
              />
            </Pressable>
          )}
        </BlurView>
      </View>
      <Tabs.Container renderTabBar={DiscoverTabBar}>
        <Tabs.Tab name="pulse" label="Pulse">
          <Tabs.FlashList
            data={pulsePosts}
            renderItem={renderPost}
            keyExtractor={keyExtractor}
            numColumns={2}
            style={styles.list}
            bounces={true}
            contentContainerStyle={styles.containerStyle}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingPulse}
                onRefresh={refetchPulse}
                tintColor={styles.refreshTint.color}
              />
            }
            onEndReached={() => {
              if (hasNextPulsePage && !isFetchingNextPulse) fetchNextPulse();
            }}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={
              <UIEmptyState
                icon="pulse"
                title="No Pulse Found"
                description="We couldn't find any recent activities in your area right now."
              />
            }
          />
        </Tabs.Tab>
        <Tabs.Tab name="people" label="People">
          <Tabs.FlashList
            data={paginatedUsers}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ItemSeparator}
            style={styles.list}
            numColumns={2}
            bounces={true}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.containerStyle}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingUsers}
                onRefresh={refetchUsers}
                tintColor={styles.refreshTint.color}
              />
            }
            onEndReached={() => {
              if (
                paginatedUsers.length >= 24 &&
                hasNextPage &&
                !isFetchingNextPage
              )
                fetchNextPage();
            }}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={
              <UIEmptyState
                icon="people-outline"
                title="No results found"
                description={`We couldn't find any users matching "${input}"`}
              />
            }
          />
        </Tabs.Tab>
        <Tabs.Tab name="posts" label="Posts">
          <Tabs.FlashList
            data={paginatedPosts}
            renderItem={renderPost}
            keyExtractor={keyExtractor}
            numColumns={2}
            style={styles.list}
            bounces={true}
            contentContainerStyle={styles.containerStyle}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingPosts}
                onRefresh={refetchPosts}
                tintColor={styles.refreshTint.color}
              />
            }
            onEndReached={() => {
              if (hasNextPostsPage && !isFetchingNextPosts) fetchNextPosts();
            }}
            onEndReachedThreshold={0.3}
            ListEmptyComponent={
              <UIEmptyState
                icon="list-outline"
                title="No Posts"
                description="Be the first one to share something in this area!"
              />
            }
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
  refreshTint: {
    color: theme.colors.accent,
  },
  tabTextBase: {
    fontSize: theme.utils.s(16),
    color: theme.colors.white,
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
  pulseIcon: {
    color: theme.colors.lightRed,
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
    paddingLeft: theme.utils.s(6),
  },
  separator: { height: 20 },
  list: { flex: 1, width: "100%", paddingVertical: theme.utils.vs(10) },
  containerStyle: {
    paddingTop: Platform.OS === "ios" ? theme.utils.vs(20) : theme.utils.vs(70),
    paddingBottom: theme.utils.vs(100),
    minHeight: rt.screen.height,
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
    color: theme.colors.accent,
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
