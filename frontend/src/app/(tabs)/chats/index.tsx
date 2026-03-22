import { ThemedBackground } from "@/src/components";
import { UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { memo, useCallback } from "react";
import { Dimensions, Platform, Pressable, View } from "react-native";
import { ListRenderItem } from "@shopify/flash-list";
import { Tabs, TabBarProps } from "react-native-collapsible-tab-view";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const USER_CHATS = [
  {
    id: "1",
    name: "@anna_kowalska",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    lastMessage: "See you at the Zamek event tonight! 🎉",
    time: "2m",
    unread: 3,
    online: true,
  },
  {
    id: "2",
    name: "@michal_nowak",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    lastMessage: "Great photos from Plac Litewski!",
    time: "15m",
    unread: 1,
    online: true,
  },
  {
    id: "3",
    name: "@julia_wisniewska",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    lastMessage: "Have you tried that new café near CSK?",
    time: "1h",
    unread: 0,
    online: false,
  },
  {
    id: "4",
    name: "@tomek_zielinski",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    lastMessage: "The concert was absolutely mind-blowing!",
    time: "2h",
    unread: 0,
    online: true,
  },
  {
    id: "6",
    name: "@kasia_lewandowska",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    lastMessage: "Sent a location pin 📍",
    time: "5h",
    unread: 0,
    online: false,
  },
  {
    id: "8",
    name: "@piotr_kaminski",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    lastMessage: "Thanks for the recommendations!",
    time: "1d",
    unread: 0,
    online: false,
  },
];

const ORGANIZER_CHATS = [
  {
    id: "5",
    name: "@lublin_runners",
    avatar: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=200",
    lastMessage: "Paweł: Sunday 7AM run confirmed, who's in?",
    time: "3h",
    unread: 12,
    online: false,
  },
  {
    id: "7",
    name: "@oldtown_foodies",
    avatar:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200",
    lastMessage: "Marta: This pierogi place is 10/10, must go!",
    time: "6h",
    unread: 5,
    online: false,
  },
  {
    id: "9",
    name: "@tech_lublin",
    avatar:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200",
    lastMessage: "Next meetup is at CSK, March 25th",
    time: "1d",
    unread: 0,
    online: false,
  },
];



type ChatItem = (typeof USER_CHATS)[0];

// ─── Chat Item ────────────────────────────────────────────────────────────────

const ChatRow = memo(({ item }: { item: ChatItem }) => (
  <Pressable 
    style={styles.chatRow}
    onPress={() => router.push({ pathname: "/chat/[id]", params: { id: item.id } })}
  >
    <View style={styles.avatarWrapper}>
      <Image
        source={{ uri: item.avatar }}
        style={styles.avatar}
        cachePolicy="memory-disk"
      />
      {item.online && <View style={styles.onlineDot} />}
    </View>
    <View style={styles.chatContent}>
      <View style={styles.chatTop}>
        <UIText weight="bold" style={styles.chatName} numberOfLines={1}>
          {item.name}
        </UIText>
        <UIText size="xs" style={styles.chatTime}>
          {item.time}
        </UIText>
      </View>
      <View style={styles.chatBottom}>
        <UIText
          size="sm"
          numberOfLines={1}
          style={[
            styles.chatMessage,
            item.unread > 0 && styles.chatMessageUnread,
          ]}
        >
          {item.lastMessage}
        </UIText>
        {item.unread > 0 && (
          <LinearGradient
            colors={["#a824e0", "#7C4DFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.unreadBadge}
          >
            <UIText size="xs" weight="bold" style={styles.unreadText}>
              {item.unread}
            </UIText>
          </LinearGradient>
        )}
      </View>
    </View>
  </Pressable>
));



// ─── Tab Bar ──────────────────────────────────────────────────────────────────

const ChatTab = ({
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
  icon: React.ReactNode;
}) => {
  const theme = UnistylesRuntime.getTheme();
  const activeColor = theme.colors.accent;
  const inactiveColor = "transparent";

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
        <Animated.Text style={styles.tabLabel}>{label}</Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

const ChatTabBar = (props: TabBarProps<string>) => {
  const onChatsPress = useCallback(() => props.onTabPress("chats"), [props]);
  const onEventsPress = useCallback(() => props.onTabPress("events"), [props]);

  return (
    <View style={styles.tabBar}>
      <ChatTab
        name="chats"
        label="Chats"
        onPress={onChatsPress}
        focusedTab={props.focusedTab}
        icon={
          <Ionicons
            name="chatbubble-ellipses"
            size={18}
            style={styles.tabIcon}
          />
        }
      />
      <ChatTab
        name="events"
        label="Events"
        onPress={onEventsPress}
        focusedTab={props.focusedTab}
        icon={
          <Ionicons name="business" size={18} style={styles.tabIcon} />
        }
      />
    </View>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────

const HEADER_HEIGHT = 0;

const Header = () => <View style={{ height: HEADER_HEIGHT }} />;

// ─── Separators ───────────────────────────────────────────────────────────────

const ChatSeparator = memo(() => <View style={styles.chatSeparator} />);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ChatsScreen() {
  const renderChat: ListRenderItem<ChatItem> = useCallback(
    ({ item }) => <ChatRow item={item} />,
    [],
  );

  const chatKeyExtractor = useCallback((item: ChatItem) => item.id, []);

  return (
    <ThemedBackground>
      <Tabs.Container
        renderHeader={Header}
        headerHeight={HEADER_HEIGHT}
        renderTabBar={ChatTabBar}
      >
        <Tabs.Tab name="chats" label="Chats">
          <Tabs.FlashList
            data={USER_CHATS}
            renderItem={renderChat}
            keyExtractor={chatKeyExtractor}
            ItemSeparatorComponent={ChatSeparator}
            contentContainerStyle={styles.chatListContent}
            showsVerticalScrollIndicator={false}
          />
        </Tabs.Tab>
        <Tabs.Tab name="events" label="Events">
          <Tabs.FlashList
            data={ORGANIZER_CHATS}
            renderItem={renderChat}
            keyExtractor={chatKeyExtractor}
            ItemSeparatorComponent={ChatSeparator}
            contentContainerStyle={styles.chatListContent}
            showsVerticalScrollIndicator={false}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </ThemedBackground>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create((theme, rt) => ({
  // ── Tab Bar ──
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  tab: {
    flex: 1,
  },
  tabContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: theme.utils.vs(2),
    paddingVertical: theme.utils.vs(12),
    gap: theme.utils.s(4),
  },
  tabLabel: {
    fontSize: theme.utils.s(12),
    color: theme.colors.primaryText,
    fontWeight: "600",
  },
  tabIcon: {
    color: theme.colors.accent,
  },

  // ── Chat List ──
  chatListContent: {
    paddingTop: Platform.OS === "ios" ? theme.utils.vs(12) : theme.utils.vs(60),
    paddingBottom: theme.utils.vs(120),
    paddingHorizontal: theme.utils.s(16),
    minHeight: Dimensions.get("window").height,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.utils.vs(12),
    gap: theme.utils.s(14),
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: theme.utils.s(54),
    height: theme.utils.s(54),
    borderRadius: theme.utils.s(27),
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  onlineDot: {
    position: "absolute",
    bottom: theme.utils.vs(2),
    right: theme.utils.s(2),
    width: theme.utils.s(13),
    height: theme.utils.s(13),
    borderRadius: theme.utils.s(7),
    backgroundColor: "#4CAF50",
    borderWidth: 2.5,
    borderColor: theme.colors.background,
  },
  chatContent: {
    flex: 1,
  },
  chatTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.utils.vs(4),
  },
  chatName: {
    color: theme.colors.primaryText,
    flex: 1,
    marginRight: theme.utils.s(8),
  },
  chatTime: {
    color: theme.colors.muted,
  },
  chatBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.utils.s(10),
  },
  chatMessage: {
    color: theme.colors.muted,
    flex: 1,
  },
  chatMessageUnread: {
    color: theme.colors.primaryText,
    fontWeight: "500",
  },
  unreadBadge: {
    minWidth: theme.utils.s(22),
    height: theme.utils.s(22),
    borderRadius: theme.utils.s(11),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.utils.s(6),
  },
  unreadText: {
    color: "#fff",
    fontSize: theme.utils.s(11),
  },
  chatSeparator: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginLeft: theme.utils.s(68),
  },


}));
