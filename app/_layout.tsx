import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import "~/db";
import { SheetProvider } from "react-native-actions-sheet";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 2 * 60 * 1000,
      // @ts-ignore
      gcTime: 10 * 60 * 1000,
    },
  },
});

function RootLayout() {
  const [loaded, error] = useFonts({
    light: require("~/assets/fonts/SpaceGrotesk-Light.ttf"),
    regular: require("~/assets/fonts/SpaceGrotesk-Regular.ttf"),
    medium: require("~/assets/fonts/SpaceGrotesk-Medium.ttf"),
    semiBold: require("~/assets/fonts/SpaceGrotesk-SemiBold.ttf"),
    bold: require("~/assets/fonts/SpaceGrotesk-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function AppLayout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SheetProvider>
            <RootLayout />
          </SheetProvider>
          <Toaster />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
