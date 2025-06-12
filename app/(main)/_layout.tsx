import React from "react";
import { Stack } from "expo-router";

export default function MainLayout(): React.JSX.Element {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={"(tabs)"} />
      <Stack.Screen name={"add-session"} />
    </Stack>
  );
}
