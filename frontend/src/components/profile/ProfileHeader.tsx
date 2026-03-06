import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { UIButton, UIText } from "../../ui";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo } from "react";
import { View } from "react-native";
import { Icon } from "../Icon";

export const ProfileHeader = memo(() => {
  const { theme } = useUnistyles();
  const router = useRouter();
  const onPress = () => {
    router.navigate("/(tabs)/profile/edit-profile");
  };
  return (
    <View style={styles.headerContainer}>
      <Icon
        size="medium"
        profileImageUrl="https://i.pinimg.com/originals/2c/e2/cd/2ce2cd3165d4c83cafca929027a89be3.jpg"
      />

      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <UIText size="lg" style={styles.biographyText}>
            Kyrylo
          </UIText>

          <UIButton onPress={onPress} isLoading={false}>
            <Ionicons
              color={theme.colors.iconColor}
              size={26}
              name="color-wand"
            />
          </UIButton>
        </View>

        <View style={styles.row}>
          <UIText size="sm" style={styles.jobStatusText}>
            Boss
          </UIText>

          <Ionicons
            color={theme.colors.iconColor}
            size={24}
            name="checkmark-circle"
          />
        </View>

        <UIText size="sm" style={styles.biographyText}>
          Hey! I'm Kyrylo 👋 A boss passionate about telling stories that
          matter.
        </UIText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  headerContainer: {
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 30,
  },
  infoContainer: {
    flex: 1,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  biographyText: {
    color: theme.colors.profileTextColor,
  },
  jobStatusText: {
    color: theme.colors.lightGray,
  },
}));
