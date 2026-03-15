import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, UIAlertProvider } from "../hoc";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { toastConfig } from "../config/toast";

import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: "502689896183-3vi8o5c45301g1c00chjko4m729e764a.apps.googleusercontent.com",
  iosClientId: "502689896183-adk1466cgc1uma36ijlh7a6ia1ergqpp.apps.googleusercontent.com",
  offlineAccess: true,
});

export const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <UIAlertProvider>
                <Stack
                  initialRouteName="index"
                  screenOptions={{ headerShown: false, animation: "fade" }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="post/[id]" />
                </Stack>
                <Toast config={toastConfig} />
              </UIAlertProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SessionProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
