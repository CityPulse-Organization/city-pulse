import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { UIButton, UIText } from "@/src/ui";
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
      <View style={styles.iconContainer}>
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
            style={{ color: theme.colors.profileTextColor }}
          >
            Kyrylo
          </UIText>

          <UIButton onPress={onPress} isLoading={false}>
            <Ionicons
              color={theme.colors.profileIconColor}
              size={18}
              name="color-wand"
            />
          </UIButton>
        </View>

        <View style={styles.row}>
          <UIText size="sm" style={{ color: theme.colors.lightViolet }}>
            Boss
          </UIText>

          <Ionicons
            color={theme.colors.lightViolet}
            size={16}
            name="checkmark-circle"
          />
        </View>

        <UIText size="sm" style={{ color: theme.colors.faintColor }}>
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
    gap: 20,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flex: 1,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
}));
