// jest.setup.js
import { jest } from "@jest/globals";
import "@testing-library/jest-native/extend-expect";
import "react-native-gesture-handler/jestSetup";
import { Text, View } from "react-native";
import React from "react";

// Silence warnings related to useNativeDriver
jest.mock("react-native/Libraries/Animated/NativeAnimatedModule", () => {
  return {
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  };
});

// Optional: Mock navigation if you're using React Navigation
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest
      .fn()
      .mockImplementation(({ children }) => children(inset)),
    SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  };
});

jest.mock("sonner-native", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("~/components/general/CustomText", () => {
  const { Text } = require("react-native");
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

jest.mock("react-native-gesture-handler", () => {
  const { View } = require("react-native");
  return {
    GestureHandlerRootView: ({ children }) => <View>{children}</View>,
    Swipeable: (props) => <View {...props}>{props.children}</View>,
    ReanimatedSwipeable: (props) => <View {...props}>{props.children}</View>,
  };
});
