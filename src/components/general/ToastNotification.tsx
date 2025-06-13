import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  ToastNotificationDataType,
  ToastNotificationIndicationType,
} from "~/contextAPI/toast-notification/types";
import { useToastNotification } from "~/hooks/useToastNotification";

interface Props {
  toast: ToastNotificationDataType;
  onHide: (id: string) => void;
}

const { width: screenWidth } = Dimensions.get("window");

const getDefaultIcon = (type: ToastNotificationIndicationType): string => {
  const icons: Record<ToastNotificationIndicationType, string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };
  return icons[type] || icons.info;
};

function ToastContent({
  toast,
  onHide,
  ...props
}: Props): React.JSX.Element | null {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar animation
    if (toast.duration > 0) {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: toast.duration,
        useNativeDriver: false,
      }).start();
    }
  }, [slideAnim, fadeAnim, progressAnim, toast.duration]);

  const handleHide = (): void => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide(toast.id);
    });
  };

  const getSlideTransform = (): Animated.WithAnimatedObject<ViewStyle> => {
    const translateY = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: toast.position === "top" ? [-100, 0] : [100, 0],
    });

    return {
      transform: [{ translateY }],
      opacity: fadeAnim,
    };
  };

  const getToastStyle = (): Array<ViewStyle | any> => {
    const baseStyle = [styles.toast, styles[toast.type]];

    if (toast.position === "bottom") {
      // @ts-ignore
      baseStyle.push(styles.bottomToast);
    } else {
      // @ts-ignore
      baseStyle.push(styles.topToast);
    }

    return baseStyle;
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "0%"],
  });

  return (
    <Animated.View
      style={[styles.container, getSlideTransform()]}
      key={toast.id}
    >
      <View style={getToastStyle()}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleHide}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {(toast.icon || !toast.title) && (
            <View style={styles.iconContainer}>
              <Text
                style={[
                  styles.icon,
                  styles[`${toast.type}Icon` as keyof typeof styles],
                ]}
              >
                {toast.icon || getDefaultIcon(toast.type)}
              </Text>
            </View>
          )}

          <View style={styles.textContainer}>
            {toast.title && (
              <Text
                style={[
                  styles.title,
                  styles[`${toast.type}Title` as keyof typeof styles],
                ]}
                numberOfLines={2}
              >
                {toast.title}
              </Text>
            )}
            {toast.message && (
              <Text
                style={[
                  styles.message,
                  styles[`${toast.type}Message` as keyof typeof styles],
                ]}
                numberOfLines={3}
              >
                {toast.message}
              </Text>
            )}
          </View>
        </View>

        {toast.duration > 0 && (
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                // @ts-ignore
                styles[`${toast.type}Progress` as keyof typeof styles],
                { width: progressWidth },
              ]}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
}

export default function ToastNotification() {
  const { toasts, hide } = useToastNotification();

  if (toasts.length === 0) return null;

  const topToasts = toasts.filter((toast) => toast.position !== "bottom");
  const bottomToasts = toasts.filter((toast) => toast.position === "bottom");

  return (
    <>
      {topToasts.length > 0 && (
        <View style={styles.topContainer}>
          {topToasts.map((toast) => (
            <ToastContent key={toast.id} toast={toast} onHide={hide} />
          ))}
        </View>
      )}

      {bottomToasts.length > 0 && (
        <View style={styles.bottomContainer}>
          {bottomToasts.map((toast) => (
            <ToastContent key={toast.id} toast={toast} onHide={hide} />
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 10,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  bottomContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  container: {
    marginBottom: 8,
  },
  toast: {
    minHeight: 60,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  topToast: {
    marginTop: 4,
  },
  bottomToast: {
    marginBottom: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    paddingRight: 40,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  icon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 12,
    zIndex: 1,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
  },
  progressContainer: {
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  progressBar: {
    height: "100%",
  },

  // Success styles
  success: {
    backgroundColor: "#10B981",
  },
  successIcon: {
    color: "#ffffff",
  },
  successTitle: {
    color: "#ffffff",
  },
  successMessage: {
    color: "#f0fff4",
  },
  successProgress: {
    backgroundColor: "#ffffff",
  },

  // Error styles
  error: {
    backgroundColor: "#EF4444",
  },
  errorIcon: {
    color: "#ffffff",
  },
  errorTitle: {
    color: "#ffffff",
  },
  errorMessage: {
    color: "#fef2f2",
  },
  errorProgress: {
    backgroundColor: "#ffffff",
  },

  // Warning styles
  warning: {
    backgroundColor: "#F59E0B",
  },
  warningIcon: {
    color: "#ffffff",
  },
  warningTitle: {
    color: "#ffffff",
  },
  warningMessage: {
    color: "#fffbeb",
  },
  warningProgress: {
    backgroundColor: "#ffffff",
  },

  // Info styles
  info: {
    backgroundColor: "#3B82F6",
  },
  infoIcon: {
    color: "#ffffff",
  },
  infoTitle: {
    color: "#ffffff",
  },
  infoMessage: {
    color: "#eff6ff",
  },
  infoProgress: {
    backgroundColor: "#ffffff",
  },
});
