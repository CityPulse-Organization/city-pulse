import { Stack } from "expo-router";

export default function ChatLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{ headerShown: false, animation: "simple_push" }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
