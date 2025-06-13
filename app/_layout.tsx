import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import "~/db";
import { ToastNotificationProvider } from "~/contextAPI/toast-notification";
import ToastNotification from "~/components/general/ToastNotification";

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
    <ToastNotificationProvider>
      <RootLayout />
      <ToastNotification />
    </ToastNotificationProvider>
  );
}
