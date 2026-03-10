import { StyleSheet, useUnistyles } from "react-native-unistyles";
import {
  Icon,
  Post,
  PostItem,
  POSTS,
  ThemedBackground,
} from "@/src/components";
import { UIButton, UIDivider, UIText } from "@/src/ui";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { ComponentProps, memo, useCallback } from "react";
import { ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
      <Post
        data={postData}
        onPress={navigateToPostDetails}
      />
    ),
    [navigateToPostDetails],
  );

  const keyExtractor = useCallback((postData: PostItem) => postData.id, []);

  return (
    <ThemedBackground style={styles.page}>
      <FlashList
        showsVerticalScrollIndicator={false}
        masonry
        numColumns={2}
        data={POSTS}
        style={styles.list}
        keyExtractor={keyExtractor}
        renderItem={renderPostItem}
        contentContainerStyle={styles.postsContainer}
        ListHeaderComponent={<ListHeader />}
      />
    </ThemedBackground>
  );
}

const ListHeader = memo(() => (
  <>
    <ProfileHeader />
    <UIDivider style={styles.divider} />
    <StatsPanel />
    <NewPostButton />
  </>
));

const ProfileHeader = memo(() => {
  const { theme } = useUnistyles();
  const router = useRouter();

  const navigateToEditProfile = useCallback(() => {
    router.navigate("/(tabs)/profile/edit-profile");
  }, [router]);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatarContainer}>
        <Icon
          size="medium"
          profileImageUrl="https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg"
          borderColor="violet"
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <UIText
            size="xl"
            weight="bold"
            style={styles.text}
          >
            Kyrylo
          </UIText>

          <UIButton onPress={navigateToEditProfile} isLoading={false}>
            <Ionicons
              color={theme.colors.icon}
              size={theme.utils.s(18)}
              name="color-wand"
            />
          </UIButton>
        </View>

        <View style={styles.row}>
          <UIText size="sm" style={styles.roleText}>
            Boss
          </UIText>

          <Ionicons
            color={theme.colors.accent}
            size={theme.utils.s(16)}
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
});



type IconName = ComponentProps<typeof Ionicons>["name"];

const PROFILE_STATS_CONFIG: {
  id: string;
  title: string;
  iconName: IconName;
  quantity: number;
}[] = [
    { id: "1", title: "Followers", iconName: "people-outline", quantity: 398 },
    { id: "2", title: "Likes", iconName: "thumbs-up-outline", quantity: 398 },
    { id: "3", title: "Posts", iconName: "newspaper-outline", quantity: 398 },
    { id: "4", title: "Subscriptions", iconName: "keypad-outline", quantity: 34 },
    { id: "5", title: "Favourites", iconName: "heart-outline", quantity: 34 },
  ];


const StatsPanel = memo(() => {
  return (
    <View style={styles.statsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {PROFILE_STATS_CONFIG.map((statConfig) => (
          <StatsButton
            key={statConfig.id}
            title={statConfig.title}
            iconName={statConfig.iconName}
            quantity={statConfig.quantity}
          />
        ))}
      </ScrollView>
    </View>
  );
});

type StatsButtonProps = {
  title: string;
  iconName: IconName;
  quantity: number;
};

const StatsButton = memo(({ title, iconName, quantity }: StatsButtonProps) => {
  const { theme } = useUnistyles();

  const handleStatPress = useCallback(() => { }, []);

  return (
    <UIButton style={styles.statButton} onPress={handleStatPress} isLoading={false}>
      <UIText style={styles.text} size="sm">
        {title}
      </UIText>

      <Ionicons
        color={theme.colors.icon}
        size={theme.utils.s(20)}
        name={iconName}
      />

      <UIText style={styles.text} size="md" weight="bold">
        {quantity}
      </UIText>
    </UIButton>
  );
});

const NewPostButton = memo(() => {
  const { theme } = useUnistyles();
  const router = useRouter();

  const navigateToNewPost = useCallback(() => {
    router.navigate("/(tabs)/profile/new-post-image");
  }, [router]);

  return (
    <View style={styles.buttonContainer}>
      <UIButton
        style={styles.newPostButton}
        onPress={navigateToNewPost}
        isLoading={false}
      >
        <Ionicons
          color={theme.colors.primaryText}
          size={theme.utils.s(22)}
          name="add-outline"
        />
        <UIText style={styles.text} size="md">
          Create new post
        </UIText>
      </UIButton>
    </View>
  );
});

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

  headerContainer: {
    paddingBottom: theme.utils.vs(20),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.utils.s(10),
    gap: theme.utils.s(20),
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flex: 1,
    gap: theme.utils.s(10),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(8),
  },

  text: {
    color: theme.colors.primaryText,
  },
  roleText: {
    color: theme.colors.accent,
  },
  bioText: {
    color: theme.colors.muted,
  },

  divider: {
    marginHorizontal: theme.utils.s(10),
  },

  statsContainer: {
    height: theme.utils.vs(160),
    paddingVertical: theme.utils.vs(16),
    paddingHorizontal: theme.utils.s(10),
  },
  scrollViewContent: {
    alignItems: "center",
    gap: theme.utils.s(14),
  },
  statButton: {
    width: theme.utils.s(96),
    height: theme.utils.vs(116),
    backgroundColor: theme.colors.backgroundSubtle,
    borderColor: theme.colors.borderSubtle,
    borderWidth: 2,
    borderRadius: theme.utils.ms(16),
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(8),
  },

  buttonContainer: {
    paddingTop: theme.utils.vs(10),
    paddingBottom: theme.utils.vs(20),
    paddingHorizontal: theme.utils.s(26),
  },
  newPostButton: {
    paddingVertical: theme.utils.vs(14),
    backgroundColor: theme.colors.backgroundSubtle,
    borderColor: theme.colors.borderSubtle,
    borderWidth: 2,
    borderRadius: theme.utils.ms(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(10),
  },
}));