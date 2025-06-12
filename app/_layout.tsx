import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";

export default function RootLayout() {
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
