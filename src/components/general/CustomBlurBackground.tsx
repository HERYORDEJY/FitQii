import React from "react";
import { StyleSheet } from "react-native";
import { BlurView, BlurViewProps } from "expo-blur";

interface Props extends BlurViewProps {
  blurAmount?: number;
  blurType?: "light" | "dark" | "default" | "extraLight";
  position?: "overlay" | string;
}

function CustomBlurBackground({
  children,
  blurAmount,
  blurType,
  style,
  ...props
}: Props) {
  const isOverlay = props.position === "overlay";

  return (
    <BlurView
      testID="blur-view"
      {...props}
      intensity={blurAmount}
      tint={blurType}
      style={[styles.blurContainer, isOverlay && styles.overlay]}
    >
      {children}
    </BlurView>
  );
}

export default CustomBlurBackground;

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  androidBlur: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)", // Light semi-transparent for light mode
  },
  overlay: {
    position: "absolute",
    zIndex: 9999,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
