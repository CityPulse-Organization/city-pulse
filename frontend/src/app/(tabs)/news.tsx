import {
  CommentProps,
  Post,
  PostItem,
  ThemedBackground,
} from "@/src/components";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet } from "react-native-unistyles";

const MOCK_COMMENTS: CommentProps[] = [
  {
    username: "kyrylo",
    commentText: "Looks serious. Hope everyone is ok.",
  },
  {
    username: "alex",
    commentText: "Any updates? Which street is blocked?",
  },
  {
    username: "maria",
    commentText: "Thanks for sharing. Stay safe!",
  },
];

const POSTS: PostItem[] = [
  {
    id: "1",
    username: "kyrylo",
    accidentTime: "13 dec. 2024 15:00",
    imageUrl:
      "https://i0.wp.com/picjumbo.com/wp-content/uploads/silhouettes-of-hawaiian-palms-at-a-gorgeous-sunset-free-image.jpeg?h=800&quality=80",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    isBroadcasting: true,
    description:
      "Aura Airways Flight 762, route from Singapore to Zurich, was forced to make an emergency landing in Dubai (DXB) after the crew reported a fire in the number two engine (Rolls-Royce Trent XWB). Captain Eva Rostova immediately declared a 'Mayday' and initiated emergency procedures. The Airbus A350-900, carrying 287 passengers, landed safely on runway 30L. No injuries were reported. UAE authorities have launched a full investigation into the incident, and the airline praised the crew's exceptional professionalism.",
  },
  {
    id: "2",
    username: "kyrylo",
    accidentTime: "13 dec. 2024 15:00",
    imageUrl:
      "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    isBroadcasting: false,
    description:
      "Aura Airways Flight 762, route from Singapore to Zurich, was forced to make an emergency landing in Dubai (DXB) after the crew reported a fire in the number two engine (Rolls-Royce Trent XWB). Captain Eva Rostova immediately declared a 'Mayday' and initiated emergency procedures. The Airbus A350-900, carrying 287 passengers, landed safely on runway 30L. No injuries were reported. UAE authorities have launched a full investigation into the incident, and the airline praised the crew's exceptional professionalism.",
  },
  {
    id: "3",
    username: "kyrylo",
    accidentTime: "13 dec. 2024 15:00",
    description:
      "Aura Airways Flight 762, route from Singapore to Zurich, was forced to make an emergency landing in Dubai (DXB) after the crew reported a fire in the number two engine (Rolls-Royce Trent XWB). Captain Eva Rostova immediately declared a 'Mayday' and initiated emergency procedures. The Airbus A350-900, carrying 287 passengers, landed safely on runway 30L. No injuries were reported. UAE authorities have launched a full investigation into the incident, and the airline praised the crew's exceptional professionalism.",
    imageUrl:
      "https://i0.wp.com/picjumbo.com/wp-content/uploads/silhouettes-of-hawaiian-palms-at-a-gorgeous-sunset-free-image.jpeg?h=800&quality=80",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    isBroadcasting: false,
  },
  {
    id: "4",
    username: "kyrylo",
    accidentTime: "13 dec. 2024 15:00",
    imageUrl:
      "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    isBroadcasting: true,
  },
];

export default function NewsScreen() {
  const router = useRouter();

  const renderPost = useCallback(
    ({ item }: { item: PostItem }) => (
      <Post
        description={item.description}
        username={item.username}
        imageUrl={item.imageUrl}
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
      />
    </ThemedBackground>
  );
}

const styles = StyleSheet.create((theme) => ({
  page: { flex: 1, gap: 10, paddingHorizontal: 20, paddingTop: 20 },
  list: { flex: 1, width: "100%" },
}));
