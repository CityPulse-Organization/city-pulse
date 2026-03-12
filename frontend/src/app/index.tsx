import { useSession } from "@/src/hoc";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  useSharedValue,
  withTiming,
  withDelay,
  useAnimatedReaction,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";
import { UILoader } from "@/src/ui";
import { scheduleOnRN } from "react-native-worklets";

export default function IndexRoute() {
  const { session, isLoading } = useSession();
  const [animReady, setAnimReady] = useState(false);
  const animDone = useSharedValue(0);

  useEffect(() => {
    animDone.value = withDelay(1400, withTiming(1, { duration: 10 }));
  }, []);

  useAnimatedReaction(
    () => animDone.value,
    (value) => {
      if (value >= 1) {
        scheduleOnRN(setAnimReady, true);
      }
    },
  );

  useEffect(() => {
    if (!animReady || isLoading) return;
    if (session.user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)");
    }
  }, [animReady, isLoading, session.user]);

  return (
    <View style={styles.container}>
      <UILoader />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
}));
