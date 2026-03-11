import { IconInfo, ThemedBackground } from "@/src/components";
import { UIButton } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { BlurView } from "expo-blur";
import { memo, useCallback, useMemo, useState } from "react";
import { TextInput, View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

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

type SearchUser = (typeof SEARCH_USERS)[0];

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

const ItemSeparator = memo(() => <View style={styles.separator} />);

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

  const keyExtractor = useCallback((item: SearchUser) => item.id, []);

  return (
    <ThemedBackground>
      <View style={styles.searchHeader}>
        <BlurView tint={UnistylesRuntime.themeName} style={styles.glass}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Search..."
            placeholderTextColor={styles.placeHolderTextColor.color}
            style={styles.search}
          />
          <UIButton style={styles.iconButton} onPress={() => {}} hitSlop={15}>
            <Ionicons name="search" size={24} style={styles.icon} />
          </UIButton>
        </BlurView>
      </View>

      <FlashList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        getItemType={() => "SearchUser"}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.containerStyle}
        showsVerticalScrollIndicator={false}
      />
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme) => ({
  title: {
    color: theme.colors.primaryTextColor,
    fontSize: 20,
    fontWeight: "bold",
  },
  searchHeader: { paddingVertical: 20 },
  itemContainer: { justifyContent: "flex-start", alignItems: "flex-start" },
  separator: { height: 20 },
  list: { flex: 1, width: "100%" },
  containerStyle: { padding: 20, paddingBottom: 100 },
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: theme.colors.primaryTextColor,
  },
  iconButton: {
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  icon: {
    color: theme.colors.iconFocused,
  },
  placeHolderTextColor: {
    color: theme.colors.iconInfoStatusTextColor,
  },
}));
