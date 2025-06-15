import React from "react";
import { StyleSheet } from "react-native";
import { BlurView, BlurViewProps } from "expo-blur";

interface Props extends BlurViewProps {
  blurAmount?: number;
  blurType?: "light" | "dark" | "default" | "extraLight";
  position?: "overlay" | string;
}

function CustomBlurBackground(props: Props) {
  const isOverlay = props.position === "overlay";

  /*
  if (Platform.OS === "android") {
    return (
      <View style={[styles.androidBlur, isOverlay && styles.overlay]}>
        {props.children}
      </View>
    );
  }
*/
  return (
    <BlurView
      intensity={props.blurAmount}
      tint={props.blurType}
      style={[styles.blurContainer, isOverlay && styles.overlay]}
    >
      {props.children}
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
