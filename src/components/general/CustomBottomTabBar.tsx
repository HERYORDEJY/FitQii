import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { COLORS } from "~/constants/Colors";
import SessionsTabIcon from "~/components/svgs/bottom-tabs/SessionsTabIcon";
import HistoryTabIcon from "~/components/svgs/bottom-tabs/HistoryTabIcon";
import { useSharedValue } from "react-native-reanimated";
import HomeTabIcon from "~/components/svgs/bottom-tabs/HomeTabIcon";

type Props = BottomTabBarProps;

export default function CustomBottomTabBar({
  state,
  descriptors,
  navigation,
  ...props
}: Props): React.JSX.Element {
  const opacity = useRef(new Animated.Value(1)).current;
  const safeAreaInsets = useSafeAreaInsets();
  const BAR_HEIGHT = 69 + safeAreaInsets.bottom / 2;
  const scrollY = useSharedValue(0);

  const getTabIcon = (label: string, isFocused: boolean) => {
    switch (label) {
      case "index":
        return <HomeTabIcon active={isFocused} />;
      case "sessions":
        return <SessionsTabIcon active={isFocused} />;
      case "history":
        return <HistoryTabIcon active={isFocused} />;
      default:
        null;
    }
  };

  const handleTabItemOnPress = (
    label: string,
    isFocused: boolean,
    route: any,
  ) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (isFocused) {
      navigation.emit({
        type: "tabPressAgain" as any,
        target: route.key,
      });
    } else if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const handleTabItemOnLongPress = (route: any) => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  useEffect(() => {
    // Use the scrollOffset to update opacity and handle fading
    const fadeOut = scrollY.value ?? 0 > 0;
    Animated.timing(opacity, {
      toValue: fadeOut ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [opacity, scrollY.value]);

  return (
    <>
      <Animated.View style={{ opacity }}>
        <BlurView
          tint={"dark"}
          intensity={60}
          style={{
            position: "absolute",
            height: BAR_HEIGHT,
            bottom: Platform.OS === "ios" ? 0 : -10,
          }}
        >
          <Animated.View style={[styles.container]}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label = route.name;
              // @ts-ignore
              const key = route.key;
              const isFocused = state.index === index;

              return (
                <TouchableOpacity
                  key={key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  onPress={() => handleTabItemOnPress(label, isFocused, route)}
                  // onLongPress={onLongPress}
                  style={styles.tabButton}
                >
                  {getTabIcon(label, isFocused)}
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </BlurView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 69,
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 2,
    borderColor: COLORS.background.card,
    width: "100%",
    zIndex: 10,
    // flex: 1,
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
    rowGap: 3,
    flex: 1,
  },
});
