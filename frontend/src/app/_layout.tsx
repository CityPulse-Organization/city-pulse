import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { router, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "../hoc";
import { useEffect } from "react";

export const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <InnerLayout />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SessionProvider>
    </QueryClientProvider>
  );
}

const InnerLayout = () => {
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (isLoading) return;

    if (session.user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)");
    }
  }, [isLoading, session.user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="post/[id]" />
    </Stack>
  );
};
