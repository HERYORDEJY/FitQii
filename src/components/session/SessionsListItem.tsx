import React, { useRef } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "~/components/general/CustomText";
import { COLORS } from "~/constants/Colors";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/src/components/ReanimatedSwipeable";
import RadioButtonIcon from "~/components/svgs/RadioButtonIcon";
import { differenceInMinutes, format } from "date-fns";
import { convertMinutesToHourMinute, isValidDate } from "~/utils/date-helpers";
import { ActionSheetRef } from "react-native-actions-sheet";
import { useToastNotification } from "~/hooks/useToastNotification";
import ViewSessionSheet from "~/components/session/ViewSessionSheet";
import { useDeleteSession, useUpdateSession } from "~/services/db/actions";
import { SessionItemDataType } from "~/components/session/types";
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { RepetitionOptions } from "~/data/add-session-options";

interface Props {
  item: SessionItemDataType;
  onActionCompleted?: () => void;
  onSelectedItem?: (item: SessionItemDataType) => void;
}

function ItemSwipeLeftElement(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  item: SessionItemDataType,
  actions?: Record<string, () => Promise<void>>,
) {
  const styleAnimation = useAnimatedStyle(() => {
    // console.log("showRightProgress:", prog.value);
    // console.log("appliedTranslation:", drag.value);

    return {
      ...styles.itemSwipeRegionStyle,
      transform: [{ translateX: 0 }],
    };
  });

  const handleDone = async () => {
    try {
      await actions?.done?.();
    } catch (error: any) {
      throw new Error(error);
    }
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
  item: SessionItemDataType,
  actions?: Record<string, () => Promise<void>>,
) {
  const styleAnimation = useAnimatedStyle(() => {
    // console.log("showRightProgress:", prog.value);
    // console.log("appliedTranslation:", drag.value);

    return {
      ...styles.itemSwipeRegionStyle,
      transform: [{ translateX: 0 }], //drag.value + 120
    };
  });

  const handleCancel = async () => {
    try {
      await actions?.cancel?.();
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await actions?.delete?.();
    } catch (error: any) {
      throw new Error(error);
    }
  };

  return (
    <Reanimated.View style={styleAnimation}>
      <Pressable style={styles.itemSwipeButton} onPress={handleCancel}>
        <CustomText
          style={styles.itemSwipeButtonText}
          color={"#CCCCCC"}
          fontFamily={"medium"}
          numberOfLines={1}
        >
          Cancel
        </CustomText>
      </Pressable>
      <View style={[styles.separatorBar, { marginHorizontal: 20 }]} />
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

export default function SessionsListItem(props: Props): React.JSX.Element {
  const isSessionDone = props.item.status === "completed";
  const isSessionCancelled = props.item.status === "cancelled";
  const isSessionActive = props.item.status === "active";
  const isSessionUpcoming = props.item.status === "upcoming";
  const sheetRef = useRef<ActionSheetRef>(null);
  const reanimatedSwipeableRef = useRef<SwipeableMethods>(null);
  const toastNotification = useToastNotification();
  const repetitionOption = RepetitionOptions.find(
    (option) => option.value === props.item.repetition,
  );

  const minutesToHourMinutes = convertMinutesToHourMinute(
    differenceInMinutes(
      new Date(props.item.end_time),
      new Date(props.item.start_time),
    ),
  );

  const deleteSession = useDeleteSession(),
    updateSession = useUpdateSession();

  const handleSessionStatus = async (status: SessionItemDataType["status"]) => {
    try {
      await updateSession.mutateAsync({
        id: props.item.id,
        data: { status, status_at: new Date().getTime() },
      });
      reanimatedSwipeableRef.current?.close();
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSession.mutateAsync(props.item.id);
      toastNotification.success("Session deleted successfully.");
      props.onActionCompleted?.();
    } catch (error) {
      toastNotification.error("Unable to delete session.");

      throw error;
    }
  };

  const handleOpenItem = () => {
    props.onSelectedItem?.(props.item);
    sheetRef.current?.show();
  };

  return (
    <View style={[styles.container]}>
      <GestureHandlerRootView>
        <ReanimatedSwipeable
          enabled={isSessionUpcoming || isSessionActive}
          friction={2}
          enableTrackpadTwoFingerGesture
          leftThreshold={10}
          rightThreshold={10}
          renderRightActions={(prog, drag) =>
            ItemSwipeRightElement(prog, drag, props.item, {
              delete: handleDelete,
              cancel: () => handleSessionStatus("cancelled"),
            })
          }
          renderLeftActions={(prog, drag) =>
            ItemSwipeLeftElement(prog, drag, props.item, {
              done: () => handleSessionStatus("completed"),
              active: () => handleSessionStatus("active"),
            })
          }
        >
          <TouchableOpacity
            onPress={handleOpenItem}
            style={[
              styles.contentContainer,
              isSessionCancelled && { opacity: 0.5 },
            ]}
          >
            <View style={styles.timeWrapper}>
              <CustomText
                fontFamily={"medium"}
                fontSize={16}
                color={COLORS.primary}
              >
                {format(new Date(props.item.start_time), "hh:mm a")}
              </CustomText>

              <CustomText
                fontFamily={"regular"}
                fontSize={12}
                color={COLORS.text.tertiary}
              >
                {minutesToHourMinutes?.hours} hr {minutesToHourMinutes?.minutes}{" "}
                min
              </CustomText>
            </View>
            <View style={styles.separatorWrapper}>
              <RadioButtonIcon />
              <View style={[styles.separatorBar]} />
            </View>
            <View style={styles.body}>
              <View style={[styles.nameWrapper]}>
                <CustomText fontFamily={"medium"}>
                  {props.item?.name}
                </CustomText>
                {isSessionCancelled ? (
                  <CustomText
                    fontFamily={"medium"}
                    fontSize={11}
                    color={"#CCC"}
                  >
                    Cancelled
                  </CustomText>
                ) : null}
              </View>
              {isValidDate(new Date(props.item?.start_time)) &&
              isValidDate(new Date(props.item?.end_time)) ? (
                <View style={styles.bodyBottom}>
                  <CustomText style={[styles.bodyBottomText]}>
                    {props.item.category}
                  </CustomText>
                  <CustomText style={[styles.bodyBottomText]}>||</CustomText>
                  <CustomText style={[styles.bodyBottomText]}>
                    {props.item.mode}
                  </CustomText>
                  {Boolean(props.item.repetition) ? (
                    <>
                      <CustomText style={[styles.bodyBottomText]}>
                        ||
                      </CustomText>
                      <CustomText style={[styles.bodyBottomText]}>
                        {repetitionOption?.label}
                      </CustomText>
                    </>
                  ) : null}
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        </ReanimatedSwipeable>
      </GestureHandlerRootView>

      <ViewSessionSheet
        sheetRef={sheetRef}
        sessionData={props.item}
        showStatus={false}
      />
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
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  nameWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flex: 1,
  },
  bodyBottomText: {
    fontSize: 11,
    color: COLORS.text.secondary,
    textTransform: "capitalize",
  },
});
