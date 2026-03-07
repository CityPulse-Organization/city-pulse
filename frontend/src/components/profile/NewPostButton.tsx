import { UIButton, UIText } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export const NewPostButton = memo(() => {
  const { theme } = useUnistyles();
  const router = useRouter();
  const onPress = () => {
    router.navigate("/(tabs)/profile/new-post-image");
  };
  return (
    <View style={styles.buttonContainer}>
      <UIButton
        style={styles.newPostButton}
        onPress={onPress}
        isLoading={false}
      >
        <Ionicons
          color={theme.colors.profileTextColor}
          size={22}
          name={"add-outline"}
        />
        <UIText style={styles.text} size="md">
          {"Create new post"}
        </UIText>
      </UIButton>
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  buttonContainer: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  newPostButton: {
    paddingVertical: 14,
    backgroundColor: theme.colors.profileBottonBackgroundColor,
    borderColor: theme.colors.profileButtonBorderColor,
    borderWidth: 2,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  text: {
    color: theme.colors.profileTextColor,
  },
}));
