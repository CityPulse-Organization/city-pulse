import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, memo } from "react";
import { ScrollView, View } from "react-native";
import { UIButton, UIText } from "../../ui";

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

  const onPress = () => { };

  return (
    <UIButton style={styles.statButton} onPress={onPress} isLoading={false}>
      <UIText style={styles.text} size="sm">
        {title}
      </UIText>

      <Ionicons
        color={theme.colors.profileIconColor}
        size={theme.utils.s(20)}
        name={iconName}
      />

      <UIText style={styles.text} size="md" weight="bold">
        {quantity}
      </UIText>
    </UIButton>
  );
});

const styles = StyleSheet.create((theme) => ({
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
    width: theme.utils.s(100),
    height: theme.utils.vs(120),
    backgroundColor: theme.colors.profileBottonBackgroundColor,
    borderColor: theme.colors.profileButtonBorderColor,
    borderWidth: 2,
    borderRadius: theme.utils.ms(16),
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(8),
  },
  text: {
    color: theme.colors.profileTextColor,
  },
}));
