import { StyleSheet } from "react-native-unistyles";

import {
  NewPostButton,
  Post,
  PostItem,
  POSTS,
  ProfileHeader,
  StatsPanel,
  ThemedBackground,
} from "@/src/components";
import { UIDivider } from "@/src/ui";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { memo, useCallback } from "react";

const ListHeader = memo(() => (
  <>
    <ProfileHeader />
    <UIDivider />
    <StatsPanel />
    <NewPostButton />
  </>
));

export default function ProfileScreen() {
  const router = useRouter();

  const renderPost = useCallback(
    ({ item }: { item: PostItem }) => (
      <Post
        data={item}
        onPress={() => {
          router.push({
            pathname: `/post/[id]`,
            params: {
              id: item.id,
              isOwnPost: "true",
            },
          });
        }}
      />
    ),
    [router],
  );

  const keyExtractor = useCallback((item: PostItem) => item.id, []);

  return (
    <ThemedBackground style={styles.page}>
      <FlashList
        showsVerticalScrollIndicator={false}
        masonry
        numColumns={2}
        data={POSTS}
        style={styles.list}
        keyExtractor={keyExtractor}
        renderItem={renderPost}
        contentContainerStyle={styles.postsContainer}
        ListHeaderComponent={<ListHeader />}
      />
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: {
    flex: 1,
    gap: 10,
    paddingHorizontal: 10,
  },
  list: { flex: 1, width: "100%" },
  postsContainer: {
    paddingBottom: 100,
  },
  headerItem: { width: "100%" },
}));
