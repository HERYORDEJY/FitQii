import Home from "~/screens/home/Home";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { SplashScreen } from "expo-router";

export default function Index() {
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

  return <Home />;
}
