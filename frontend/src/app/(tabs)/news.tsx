import { Post, PostItem, POSTS, ThemedBackground } from "@/src/components";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet } from "react-native-unistyles";

export default function NewsScreen() {
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
        getItemType={() => "PostItem"}
        contentContainerStyle={styles.postsContainer}
      />
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { flex: 1, gap: 10, paddingHorizontal: 20 },
  list: { flex: 1, width: "100%" },
  postsContainer: { paddingBottom: 100 },
}));
