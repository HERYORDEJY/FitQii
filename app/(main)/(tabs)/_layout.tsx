import React from "react";
import { Tabs } from "expo-router";
import HomeTabIcon from "~/components/svgs/bottom-tabs/HomeTabIcon";
import SessionsTabIcon from "~/components/svgs/bottom-tabs/SessionsTabIcon";
import HistoryTabIcon from "~/components/svgs/bottom-tabs/HistoryTabIcon";
import CustomBottomTabBar from "~/components/general/CustomBottomTabBar";

export default function TabsLayout(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomBottomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <HomeTabIcon active={focused} />,
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          tabBarIcon: ({ focused }) => <SessionsTabIcon active={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => <HistoryTabIcon active={focused} />,
        }}
      />
    </Tabs>
  );
}
