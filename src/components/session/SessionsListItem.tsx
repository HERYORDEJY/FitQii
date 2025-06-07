import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import CustomText from "~/components/general/CustomText";
import { COLORS } from "~/constants/Colors";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/src/components/ReanimatedSwipeable";
import RadioButtonIcon from "~/components/svgs/RadioButtonIcon";

interface Props {
  item?: any; // TODO:: implement correct type
}

function ItemSwipeLeftElement(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  item: Record<string, any>,
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
        >
          Delete
        </CustomText>
      </Pressable>
    </Reanimated.View>
  );
}

export default function SessionsListItem(props: Props): React.JSX.Element {
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
          // containerStyle={{ backgroundColor: COLORS.background.card }}
        >
          <View style={styles.contentContainer}>
            <View style={styles.timeWrapper}>
              <CustomText
                fontFamily={"medium"}
                fontSize={16}
                color={COLORS.primary}
              >
                10:00 AM
              </CustomText>
              <CustomText
                fontFamily={"regular"}
                fontSize={12}
                color={COLORS.text.tertiary}
              >
                45 min
              </CustomText>
            </View>
            <View style={styles.separatorWrapper}>
              <RadioButtonIcon />
              <View style={[styles.separatorBar]} />
            </View>
            <View style={styles.body}>
              <CustomText
                fontFamily={"medium"}
                numberOfLines={1}
                style={{ textAlignVertical: "top" }}
              >
                System Setup
              </CustomText>
              <View style={styles.bodyBottom}>
                <CustomText
                  fontFamily={"regular"}
                  fontSize={12}
                  color={COLORS.text.tertiary}
                >
                  Host: John Doe
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
    flexDirection: "row",
    height: 63,
    columnGap: 15,
    backgroundColor: COLORS.background.screen,
  },
  timeWrapper: {
    rowGap: 5,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  body: {
    rowGap: 6,
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: COLORS.background.card,
    paddingBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    height: "auto",
    flex: 1,
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
  separatorWrapper: {
    alignItems: "center",
    rowGap: 6,
    justifyContent: "flex-start",
  },
  separatorBar: {
    width: 3,
    height: "100%",
    borderRadius: 100,
    backgroundColor: "#FFFFFF60",
  },
});
