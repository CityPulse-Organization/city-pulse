import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, memo } from "react";
import { ScrollView, View } from "react-native";

type IconName = ComponentProps<typeof Ionicons>["name"];
const statsData: {
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

export const StatsPanel = memo(() => {
  return (
    <View style={styles.statsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {statsData.map((stat) => (
          <StatsButton
            key={stat.id}
            title={stat.title}
            iconName={stat.iconName}
            quantity={stat.quantity}
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
  const onPress = () => {};
  return (
    <UIButton style={styles.statButton} onPress={onPress} isLoading={false}>
      <UIText style={styles.text} size="xs">
        {title}
      </UIText>

      <Ionicons
        color={theme.colors.profileIconColor}
        size={24}
        name={iconName}
      />

      <UIText style={styles.text} size="md">
        {quantity}
      </UIText>
    </UIButton>
  );
});

const styles = StyleSheet.create((theme) => ({
  statsContainer: {
    height: 160,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  scrollViewContent: {
    alignItems: "center",
    gap: 20,
  },
  statButton: {
    width: 94,
    height: 110,
    backgroundColor: theme.colors.profileBottonBackgroundColor,
    borderColor: theme.colors.profileButtonBorderColor,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  text: {
    color: theme.colors.profileTextColor,
  },
}));
