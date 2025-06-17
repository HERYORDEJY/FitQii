import React from "react";
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleSheet,
  View,
} from "react-native";
import { COLORS } from "~/constants/Colors";
import CustomText from "~/components/general/CustomText";
import CustomBlurBackground from "~/components/general/CustomBlurBackground";

interface Props extends ActivityIndicatorProps {
  isLoading?: boolean;
  title?: string;
  description?: string;
  position?: "overlay" | string;
  overlayBackgroundType?: "normal" | "blurred";
}
export default function CustomActivityIndicator({
  isLoading = true,
  size = "large",
  overlayBackgroundType = "normal",
  ...props
}: Props) {
  const isBlurredBackgroundType = overlayBackgroundType === "blurred";
  const isOverlay = props.position === "overlay";

  const renderIndicatorContent = (
    <View
      style={[styles.container, props.style, isOverlay && styles.overlay]}
      testID={"activity-container"}
    >
      <ActivityIndicator
        testID={"activity-indicator"}
        size={size}
        color={props.color ?? COLORS.primary}
      />
      {props.title || props.description ? (
        <View style={styles.bodyWrapper}>
          {props.title ? (
            <CustomText style={[styles.title]}>{props.title}</CustomText>
          ) : null}
          {props.description ? (
            <CustomText style={[styles.description]} color={COLORS.secondary}>
              {props.description}
            </CustomText>
          ) : null}
        </View>
      ) : null}
    </View>
  );

  if (isBlurredBackgroundType) {
    return (
      <View
        testID={"blur-background"}
        style={styles.overlayContainer}
        pointerEvents="box-none"
      >
        <CustomBlurBackground testID={"blur-view"} position={props.position}>
          {renderIndicatorContent}
        </CustomBlurBackground>
      </View>
    );
  }

  return renderIndicatorContent;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    padding: 10,
  },
  bodyWrapper: {
    rowGap: 8,
    alignItems: "center",
  },
  title: {
    fontFamily: "montserratSemibold",
    fontSize: 16,
    textTransform: "capitalize",
  },
  description: {
    lineHeight: 25.69,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    zIndex: 9999,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    // justifyContent: "center",
    // alignItems: "center",
    zIndex: 9999,
  },
});
