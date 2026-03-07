import { AuthButton } from "@/src/components";
import { router } from "expo-router";
import { Image, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function IntroPage() {
  return (
    <View style={styles.mainContainer}>
      <Image
        resizeMode="cover"
        style={styles.image}
        source={require("@assets/images/intro.jpg")}
      />
      <AuthButton
        label="Start"
        variant="default"
        onPress={() => router.push("/sign-up")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, position: "relative" },
  image: { width: "100%", height: "100%", position: "absolute" },
});
