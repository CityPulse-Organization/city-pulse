import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, UIAlertProvider } from "../hoc";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <UIAlertProvider />
              <Stack
                initialRouteName="index"
                screenOptions={{ headerShown: false, animation: "fade" }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="post/[id]" />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SessionProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
