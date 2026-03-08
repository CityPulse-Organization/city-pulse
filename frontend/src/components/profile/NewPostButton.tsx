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
          size={theme.utils.s(22)}
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
    paddingTop: theme.utils.vs(10),
    paddingBottom: theme.utils.vs(30),
    paddingHorizontal: theme.utils.s(20),
  },
  newPostButton: {
    paddingVertical: theme.utils.vs(14),
    backgroundColor: theme.colors.profileBottonBackgroundColor,
    borderColor: theme.colors.profileButtonBorderColor,
    borderWidth: 2,
    borderRadius: theme.utils.ms(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.utils.s(10),
  },
  text: {
    color: theme.colors.profileTextColor,
  },
}));
