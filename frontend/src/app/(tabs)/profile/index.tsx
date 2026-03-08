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

  const handlePostPress = useCallback(
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

  const renderPost = useCallback(
    ({ item }: { item: PostItem }) => (
      <Post
        data={item}
        onPress={handlePostPress}
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
    gap: theme.utils.s(10),
    paddingTop: theme.utils.vs(20),
  },
  list: { flex: 1, width: "100%" },
  postsContainer: {
    paddingBottom: theme.utils.vs(80),
  },
  headerItem: { width: "100%" },
}));
