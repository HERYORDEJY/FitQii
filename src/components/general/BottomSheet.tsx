import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { BottomSheetRef } from "~/components/general/types";
import CloseIcon from "~/components/svgs/CloseIcon";
import CustomText from "~/components/general/CustomText";
import { COLORS } from "~/constants/Colors";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface Props {
  maxHeight?: number;
  backdropColor?: string;
  children: (data: any) => React.ReactNode;
  title?: string;
  showHeader?: boolean;
}

// eslint-disable-next-line react/display-name
const BottomSheet = forwardRef<BottomSheetRef, Props>(
  (
    {
      maxHeight = SCREEN_HEIGHT * 0.85,
      backdropColor = "rgba(0,0,0,0.4)",
      showHeader = true,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const [openParams, setOpenParams] = useState<any>(null); // title
    const [contentHeight, setContentHeight] = useState(0);
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    useImperativeHandle(ref, () => ({
      open: (payload?: any) => {
        setOpenParams(payload);
        setVisible(true);
      },
      close: () => {
        animateOut();
      },
      data: openParams,
      isVisible: visible,
    }));

    useEffect(() => {
      if (visible) {
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT - Math.min(contentHeight, maxHeight),
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }, [visible, contentHeight]);

    const animateOut = () => {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        setOpenParams(null);
      });
    };

    const handleLayout = (e: LayoutChangeEvent) => {
      const height = e.nativeEvent.layout.height;
      setContentHeight(height);
    };

    if (!visible) return null;

    return (
      <Modal transparent visible={visible} animationType="none">
        <View style={styles.overlay}>
          <Pressable
            style={[styles.backdrop, { backgroundColor: backdropColor }]}
            onPress={animateOut}
          />

          <Animated.View
            style={[
              styles.sheetContainer,
              {
                maxHeight,
                // transform: [{ translateY }],
              },
            ]}
          >
            {showHeader ? (
              <View style={styles.header}>
                <View style={styles.titleWrapper}>
                  {Boolean(props.title ?? openParams?.title) ? (
                    <CustomText
                      fontSize={16}
                      fontFamily={"bold"}
                      numberOfLines={1}
                      color={"#FFF"}
                    >
                      {props.title ?? openParams?.title}
                    </CustomText>
                  ) : null}
                </View>
                <View style={styles.closeWrapper}>
                  <Pressable onPress={animateOut} style={[styles.closeButton]}>
                    <CloseIcon color={"#FFF"} />
                  </Pressable>
                </View>
              </View>
            ) : null}

            <View onLayout={handleLayout}>{props.children(openParams)}</View>
          </Animated.View>
        </View>
      </Modal>
    );
  },
);

export default BottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    backgroundColor: COLORS.background.card,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
    rowGap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
  },
  titleWrapper: {},
  closeButton: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  closeWrapper: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  closeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});
