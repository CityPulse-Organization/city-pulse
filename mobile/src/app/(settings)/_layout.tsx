import { Stack } from "expo-router";

export default function SettingsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="map-style" />
            <Stack.Screen name="restricted-accounts" />
            <Stack.Screen name="change-password" />
            <Stack.Screen name="report-problem" />
            <Stack.Screen name="language" />
        </Stack>
    );
}
