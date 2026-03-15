import { Post, PostItem, POSTS, ThemedBackground } from "@/src/components";
import { useLogout } from "@/src/hooks";
import { UIButton, UIText } from "@/src/ui";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet } from "react-native-unistyles";

export default function NewsScreen() {
  const router = useRouter();
  // const { mutate: logout } = useLogout();
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
      <Post
        data={item}
        onPress={() => {
          openPost({ id: item.id });
        }}
      />
    ),
    [openPost],
  );

  const keyExtractor = useCallback((item: PostItem) => item.id, []);

  return (
    <ThemedBackground style={styles.page}>
      {/* <UIButton onPress={() => logout()} isLoading={false}>
        <UIText style={styles.logoutText}>Logout</UIText>
      </UIButton> */}
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
  page: {
    flex: 1,
    gap: theme.utils.s(10),
    paddingHorizontal: theme.utils.vs(20),
  },
  list: { flex: 1, width: "100%" },
  postsContainer: { paddingBottom: theme.utils.vs(100) },
  // logoutText: {
  //   color: theme.colors.violet,
  // },
}));
