import { StyleSheet } from "react-native-unistyles";

import {
  NewPostButton,
  Post,
  PostItem,
  PostOptionItem,
  ProfileHeader,
  StatsPanel,
  ThemedBackground,
} from "@/src/components";
import { UIDivider } from "@/src/ui";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import { View } from "react-native";

const POSTS: PostItem[] = [
  {
    id: "1",
    username: "kyrylo",
    accidentTime: "13 dec. 2024 15:00",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYnQuzFNBCJZNp9-J1KoMQFDjsSVhxp5JxJQ&s",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    isBroadcasting: false,
    description:
      "Aura Airways Flight 762, route from Singapore to Zurich, was forced to make an emergency landing in Dubai (DXB) after the crew reported a fire in the number two engine (Rolls-Royce Trent XWB). Captain Eva Rostova immediately declared a 'Mayday' and initiated emergency procedures. The Airbus A350-900, carrying 287 passengers, landed safely on runway 30L. No injuries were reported. UAE authorities have launched a full investigation into the incident, and the airline praised the crew's exceptional professionalism.",
  },
  {
    id: "2",
    username: "kyrylo",
    accidentTime: "13 dec. 2024 15:00",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1vyTJ-5AwLNQQKGBmcZn0kIDiXuduEKG5fg&s",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    isBroadcasting: true,
  },
];

const ListHeader = memo(() => (
  <>
    <ProfileHeader />
    <UIDivider />
    <StatsPanel />
    <NewPostButton />
    <UIDivider />
  </>
));

type ProfileFeedItem =
  | { type: "header"; id: "header" }
  | ({ type: "post" } & PostItem);

export default function ProfileScreen() {
  const router = useRouter();

  const ELLIPSIS_OPTIONS_DATA: PostOptionItem[] = useMemo(
    () => [
      {
        id: "1",
        title: "Edit",
        iconName: "pencil-outline",
        onClick: () => {
          router.navigate("/(tabs)/profile/edit-post");
        },
      },
      {
        id: "2",
        title: "Delete",
        iconName: "trash-outline",
        color: "red",
        onClick: () => {
          throw new Error("Function not implemented.");
        },
      },
    ],
    [router],
  );

  const renderPost = useCallback(
    ({ item }: { item: ProfileFeedItem }) => {
      if (item.type === "header") {
        return (
          <View style={styles.headerItem}>
            <ListHeader />
          </View>
        );
      }

      return (
        <Post
          username={item.username}
          imageUrl={item.imageUrl}
          description={item.description}
          profileImageUrl={item.profileImageUrl}
          accidentTime={item.accidentTime}
          onPress={() => {
            router.push({
              pathname: `/post/[id]`,
              params: {
                id: item.id,
                imageUrl: item.imageUrl,
                description: item.description ?? "",
                username: item.username,
                profileImageUrl: item.profileImageUrl ?? "",
                accidentTime: item.accidentTime,
                isBroadcasting: String(item.isBroadcasting ?? false),
              },
            });
          }}
        />
      );
    },
    [router],
  );

  const data: ProfileFeedItem[] = useMemo(
    () => [
      { type: "header", id: "header" },
      ...POSTS.map((p) => ({ ...p, type: "post" as const })),
    ],
    [],
  );

  const keyExtractor = useCallback((item: ProfileFeedItem) => item.id, []);

  return (
    <ThemedBackground style={styles.page}>
      <FlashList
        showsVerticalScrollIndicator={false}
        masonry
        numColumns={2}
        data={data}
        style={styles.list}
        keyExtractor={keyExtractor}
        renderItem={renderPost}
        getItemType={(item) => item.type}
        // @ts-ignore: Valid property for FlashList
        estimatedItemSize={250}
        overrideItemLayout={(layout, item) => {
          // Make header span both columns in masonry
          if (item.type === "header") layout.span = 2;
        }}
        contentContainerStyle={styles.postsContainer}
      />
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: {
    flex: 1,
    gap: 10,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  list: { flex: 1, width: "100%" },
  postsContainer: {
    paddingBottom: 100,
  },
  headerItem: { width: "100%" },
}));
