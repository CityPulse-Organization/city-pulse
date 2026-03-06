import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { UIButton, UIText } from "../../ui/atoms";

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
          color={theme.colors.profileIconColor}
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
    paddingTop: 22,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  newPostButton: {
    paddingVertical: 14,
    backgroundColor: theme.colors.profileBottonBackgroundColor,
    borderColor: theme.colors.profileButtonBorderColor,
    borderWidth: 1,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  text: {
    color: theme.colors.profileTextColor,
  },
}));
