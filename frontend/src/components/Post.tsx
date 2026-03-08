import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { UIButton, UIImage, UIText } from "../ui";
import { IconInfo } from "./IconInfo";

export type PostItem = {
  id: string;
  username: string;
  accidentTime: string;
  imagesUrl: string[];
  description?: string;
  profileImageUrl?: string;
  isBroadcasting?: boolean;
  location: string;
};

export const POSTS: PostItem[] = [
  {
    id: "1",
    username: "kyrylo",
    accidentTime: "13 dec. 2024 15:00",
    imagesUrl: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYnQuzFNBCJZNp9-J1KoMQFDjsSVhxp5JxJQ&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1vyTJ-5AwLNQQKGBmcZn0kIDiXuduEKG5fg&s",
    ],
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    isBroadcasting: false,
    description:
      "Aura Airways Flight 762, route from Singapore to Zurich, was forced to make an emergency landing in Dubai (DXB) after the crew reported a fire in the number two engine (Rolls-Royce Trent XWB). Captain Eva Rostova immediately declared a 'Mayday' and initiated emergency procedures. The Airbus A350-900, carrying 287 passengers, landed safely on runway 30L. No injuries were reported. UAE authorities have launched a full investigation into the incident, and the airline praised the crew's exceptional professionalism.",
    location: "Lublin, Poland",
  },
  {
    id: "2",
    username: "kyrylo",
    accidentTime: "13 dec. 2024 15:00",
    imagesUrl: [
      "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
    ],
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    isBroadcasting: false,
    description:
      "Aura Airways Flight 762, route from Singapore to Zurich, was forced to make an emergency landing in Dubai (DXB) after the crew reported a fire in the number two engine (Rolls-Royce Trent XWB). Captain Eva Rostova immediately declared a 'Mayday' and initiated emergency procedures. The Airbus A350-900, carrying 287 passengers, landed safely on runway 30L. No injuries were reported. UAE authorities have launched a full investigation into the incident, and the airline praised the crew's exceptional professionalism.",
    location: "Kyiv, Ukraine",
  },
  {
    id: "3",
    username: "kyrylo",
    accidentTime: "13 dec. 2024 15:00",
    description:
      "Aura Airways Flight 762, route from Singapore to Zurich, was forced to make an emergency landing in Dubai (DXB) after the crew reported a fire in the number two engine (Rolls-Royce Trent XWB). Captain Eva Rostova immediately declared a 'Mayday' and initiated emergency procedures. The Airbus A350-900, carrying 287 passengers, landed safely on runway 30L. No injuries were reported. UAE authorities have launched a full investigation into the incident, and the airline praised the crew's exceptional professionalism.",
    imagesUrl: [
      "https://i0.wp.com/picjumbo.com/wp-content/uploads/silhouettes-of-hawaiian-palms-at-a-gorgeous-sunset-free-image.jpeg?h=800&quality=80",
    ],
    isBroadcasting: false,
    location: "Lublin, Poland",
  },
  {
    id: "4",
    username: "kyrylo",
    accidentTime: "13 dec. 2024 15:00",
    imagesUrl: [
      "https://th.bing.com/th/id/OIP.eh5RRJ5l1pqHQDN1ubb1VAHaEx?w=272&h=180&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
    ],
    profileImageUrl:
      "https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg",
    isBroadcasting: true,
    location: "Lublin, Poland",
  },
];

type PostProps = {
  data: PostItem;
  isLoading?: boolean;
  onPress: (id: string) => void;
};

export const Post = memo(({ data, isLoading = false, onPress }: PostProps) => {
  const handlePress = useCallback(() => {
    onPress(data.id);
  }, [data.id, onPress]);

  return (
    <View style={styles.itemWrapper}>
      <UIButton onPress={handlePress} style={styles.card}>
        <UIImage
          isLoading={isLoading}
          isAspectRatio={true}
          size="masonry"
          borderRound="medium"
          imageUrl={data.imagesUrl[0]}
          style={styles.image}
        />

        <View style={styles.overlayWrapper}>
          <View style={styles.topFlexWrapper}>
            {data.description && (
              <LinearGradient
                colors={["rgba(0,0,0,0.85)", "rgba(0,0,0,0)"]}
                style={styles.topOverlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <UIText
                  size="sm"
                  numberOfLines={3}
                  ellipsizeMode="tail"
                  style={styles.overlayText}
                >
                  {data.description}
                </UIText>
              </LinearGradient>
            )}
          </View>

          <BlurView intensity={100} tint="dark" style={styles.blurContainer}>
            <IconInfo
              profileImageUrl={data.profileImageUrl}
              isBroadCasting={false}
              username={data.username}
              statusText={data.accidentTime}
              iconSize="small"
              iconBorderColor="faint"
              usernameSize="sm"
            />
          </BlurView>
        </View>
      </UIButton>
    </View>
  )
});

const styles = StyleSheet.create((theme) => ({
  itemWrapper: {
    flex: 1,
    padding: theme.utils.s(12) / 2,
    minWidth: 0
  },
  card: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: theme.utils.s(22),
    borderWidth: 1,
    borderColor: theme.colors.postBorderColor,
  },
  image: {
    minHeight: theme.utils.vs(240),
  },

  overlayWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topFlexWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  topOverlay: {
    paddingHorizontal: theme.utils.s(14),
    paddingTop: theme.utils.s(16),
    paddingBottom: theme.utils.s(32),
  },
  overlayText: {
    color: theme.colors.textColor,
    textShadowColor: theme.colors.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    lineHeight: theme.utils.s(18),
  },

  blurContainer: {
    paddingHorizontal: theme.utils.s(12),
    paddingTop: theme.utils.s(8),
    paddingBottom: theme.utils.s(10),
  },
}));
