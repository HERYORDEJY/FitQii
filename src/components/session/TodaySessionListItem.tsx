import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import CustomText from "~/components/general/CustomText";
import { COLORS } from "~/constants/Colors";
import ClockIcon from "~/components/svgs/ClockIcon";
import ArrowRightIcon from "~/components/svgs/ArrowRightIcon";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/src/components/ReanimatedSwipeable";
import { SessionItemDataType } from "~/components/session/types";

interface Props {
  item: SessionItemDataType;
}

function ItemSwipeLeftElement(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  item: SessionItemDataType,
) {
  const styleAnimation = useAnimatedStyle(() => {
    // console.log("showRightProgress:", prog.value);
    // console.log("appliedTranslation:", drag.value);

    return {
      ...styles.itemSwipeRegionStyle,
      transform: [{ translateX: 0 }],
    };
  });

  const handleDone = () => {
    // TODO:: implement done action
  };

  return (
    <Reanimated.View style={styleAnimation}>
      <Pressable style={styles.itemSwipeButton} onPress={handleDone}>
        <CustomText
          style={styles.itemSwipeButtonText}
          color={COLORS.primary}
          fontFamily={"medium"}
        >
          Done
        </CustomText>
      </Pressable>
    </Reanimated.View>
  );
}

function ItemSwipeRightElement(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  item: Record<string, any>,
) {
  const styleAnimation = useAnimatedStyle(() => {
    // console.log("showRightProgress:", prog.value);
    // console.log("appliedTranslation:", drag.value);

    return {
      ...styles.itemSwipeRegionStyle,
      transform: [{ translateX: 0 }], //drag.value + 120
    };
  });

  const handleDelete = () => {
    // TODO:: implement delete action
  };

  return (
    <Reanimated.View style={styleAnimation}>
      <Pressable style={styles.itemSwipeButton} onPress={handleDelete}>
        <CustomText
          style={styles.itemSwipeButtonText}
          color={"#FF0000"}
          fontFamily={"medium"}
          numberOfLines={1}
        >
          Delete
        </CustomText>
      </Pressable>
    </Reanimated.View>
  );
}

export default function TodaySessionListItem(props: Props): React.JSX.Element {
  return (
    <View style={[styles.container]}>
      <GestureHandlerRootView>
        <ReanimatedSwipeable
          friction={2}
          enableTrackpadTwoFingerGesture
          rightThreshold={40}
          renderRightActions={(prog, drag) =>
            ItemSwipeRightElement(prog, drag, props.item)
          }
          renderLeftActions={(prog, drag) =>
            ItemSwipeLeftElement(prog, drag, props.item)
          }
          containerStyle={{ backgroundColor: COLORS.background.card }}
        >
          <View style={styles.contentContainer}>
            <View style={styles.body}>
              <CustomText fontFamily={"medium"}>System Setup</CustomText>
              <View style={styles.bodyBottom}>
                <ClockIcon />
                <CustomText fontFamily={"regular"} fontSize={12}>
                  10:00 AM
                </CustomText>
                <ArrowRightIcon />
                <CustomText fontFamily={"regular"} fontSize={12}>
                  11:00 AM
                </CustomText>
              </View>
            </View>
          </View>
        </ReanimatedSwipeable>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 10, overflow: "hidden" },
  contentContainer: {
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: COLORS.background.card,
    paddingBottom: 10,
    paddingRight: 6,
    paddingLeft: 40,
    paddingTop: 5,
    borderLeftWidth: 12,
    borderLeftColor: COLORS.secondary,
  },
  body: {
    rowGap: 6,
  },
  bodyBottom: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  itemSwipeButton: {
    width: 48,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  itemSwipeButtonText: {},
  itemSwipeRegionStyle: {
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: COLORS.background.screen,
    paddingHorizontal: 20,
  },
});
