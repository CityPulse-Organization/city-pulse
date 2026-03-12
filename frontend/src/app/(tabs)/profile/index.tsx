import { StyleSheet } from "react-native-unistyles";
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
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// TODO: Create new post button to look better and see 4 posts
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

      <ProfileHeader />
      <UIDivider style={styles.divider} />
      <StatsPanel />
      <NewPostButton />

      <FlashList
        showsVerticalScrollIndicator={false}
        masonry
        numColumns={2}
        data={POSTS}
        style={styles.list}
        keyExtractor={keyExtractor}
        renderItem={renderPostItem}
        contentContainerStyle={styles.postsContainer}
      />
    </ThemedBackground>
  );
}




const ProfileHeader = memo(() => {
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
              color={styles.editProfileIcon.color}
              size={styles.editProfileIcon.height}
              name="color-wand"
            />
          </UIButton>
        </View>

        <View style={styles.row}>
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
});



type IconName = ComponentProps<typeof Ionicons>["name"];

const PROFILE_STATS_CONFIG: {
  id: string;
  title: string;
  iconName: IconName;
  quantity: number;
}[] = [
    { id: "1", title: "Followers", iconName: "people-outline", quantity: 398 },
    { id: "2", title: "Posts", iconName: "newspaper-outline", quantity: 398 },
    { id: "3", title: "Followings", iconName: "keypad-outline", quantity: 34 },
    { id: "4", title: "Favourites", iconName: "heart-outline", quantity: 34 },
  ];


const StatsPanel = memo(() => {
  return (
    <View style={styles.statsContainer}>
      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        / contentContainerStyle={styles.scrollViewContent}
      > */}
      {PROFILE_STATS_CONFIG.map((statConfig) => (
        <StatsButton
          key={statConfig.id}
          title={statConfig.title}
          iconName={statConfig.iconName}
          quantity={statConfig.quantity}
        />
      ))}
      {/* </ScrollView> */}
    </View>
  );
});

type StatsButtonProps = {
  title: string;
  iconName: IconName;
  quantity: number;
};

const StatsButton = memo(({ title, iconName, quantity }: StatsButtonProps) => {
  const handleStatPress = useCallback(() => { }, []);

  return (
    <UIButton style={styles.statButton} onPress={handleStatPress} isLoading={false}>
      <View style={styles.statIconContainer}>
        <Ionicons
          color={styles.statsIcon.color}
          size={styles.statsIcon.height}
          name={iconName}
        />
      </View>
      <View style={styles.statTextContainer}>
        <UIText style={styles.text} size="sm" weight="bold">
          {quantity}
        </UIText>
        <UIText style={styles.statTitle} size="sm">
          {title}
        </UIText>
      </View>
    </UIButton>
  );
});

const NewPostButton = memo(() => {
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
          color={styles.newPostIcon.color}
          size={styles.newPostIcon.height}
          name="add-outline"
        />
        <UIText style={styles.newPostText} size="md" weight="bold">
          Create new post
        </UIText>
      </UIButton>
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  page: {
    flex: 1,
    paddingTop: theme.utils.vs(24),
  },
  list: { flex: 1, width: "100%" },
  postsContainer: {
    paddingBottom: theme.utils.vs(80),
  },

  headerContainer: {
    paddingBottom: theme.utils.vs(20),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.utils.s(16),
    gap: theme.utils.s(16),
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flex: 1,
    gap: theme.utils.s(8),
  },
  editProfileIcon: {
    color: theme.colors.accent,
    height: theme.utils.s(20),
  },
  jobIcon: {
    color: theme.colors.accent,
    height: theme.utils.s(16),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(8),
  },

  statsIcon: {
    color: theme.colors.accent,
    height: theme.utils.s(18),
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
  statTitle: {
    color: theme.colors.muted,
  },

  divider: {
    marginHorizontal: theme.utils.s(16),
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.utils.s(10),
    paddingVertical: theme.utils.vs(16),
    paddingHorizontal: theme.utils.s(16),
  },
  statButton: {
    flexGrow: 1,
    minWidth: "45%",
    paddingVertical: theme.utils.vs(12),
    paddingHorizontal: theme.utils.s(14),
    backgroundColor: theme.colors.backgroundSubtle,
    borderRadius: theme.utils.ms(16),
    flexDirection: "row",
    alignItems: "center",
    gap: theme.utils.s(12),
  },
  statIconContainer: {
    width: theme.utils.s(38),
    height: theme.utils.s(38),
    borderRadius: theme.utils.ms(19),
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  statTextContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  buttonContainer: {
    paddingBottom: theme.utils.vs(20),
    paddingHorizontal: theme.utils.s(16),
  },
  newPostIcon: {
    color: theme.colors.white,
    height: theme.utils.s(22),
  },
  newPostButton: {
    paddingVertical: theme.utils.vs(14),
    backgroundColor: theme.colors.accent,
    borderRadius: theme.utils.ms(100),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(10),
  },
  newPostText: {
    color: theme.colors.white,
  },
}));