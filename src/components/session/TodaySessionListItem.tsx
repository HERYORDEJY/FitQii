import React, { useRef } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
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
import { format } from "date-fns";
import { useToastNotification } from "~/hooks/useToastNotification";
import ViewSessionSheet from "~/components/session/ViewSessionSheet";
import { ActionSheetRef } from "react-native-actions-sheet";
import { isValidDate } from "~/utils/date-helpers";
import { useDeleteSession, useUpdateSession } from "~/services/db/actions";
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import CustomActivityIndicator from "~/components/general/CustomActivityIndicator";

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

  const handleActive = async () => {
    try {
      await actions?.active?.();
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
      {item.status === "active" ? null : (
        <>
          <View style={[styles.separatorBar]} />
          <TouchableOpacity
            style={[styles.itemSwipeButton]}
            onPress={handleActive}
          >
            <CustomText
              style={styles.itemSwipeButtonText}
              color={COLORS.primary}
              fontFamily={"medium"}
              fontSize={20}
            >
              🏃
            </CustomText>
          </TouchableOpacity>
        </>
      )}
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
      <View style={[styles.separatorBar]} />
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
  const isSessionDone = props.item.status === "completed";
  const isSessionCancelled = props.item.status === "cancelled";
  const isSessionActive = props.item.status === "active";
  const isSessionUpcoming = props.item.status === "upcoming";
  const isSessionPending = props.item.status === "pending";
  const sheetRef = useRef<ActionSheetRef>(null);
  const reanimatedSwipeableRef = useRef<SwipeableMethods>(null);
  const toastNotification = useToastNotification();

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
    <>
      <View style={[styles.container]}>
        <GestureHandlerRootView>
          <ReanimatedSwipeable
            ref={reanimatedSwipeableRef}
            enabled={isSessionUpcoming || isSessionActive}
            friction={2}
            enableTrackpadTwoFingerGesture
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
            containerStyle={{ backgroundColor: COLORS.background.card }}
            leftThreshold={10}
            rightThreshold={10}
          >
            <TouchableOpacity
              onPress={handleOpenItem}
              style={[
                styles.contentContainer,
                isSessionCancelled && { opacity: 0.5 },
              ]}
            >
              <>
                {isSessionDone ? (
                  <CustomText>✅</CustomText>
                ) : isSessionActive ? (
                  <CustomText>🏃</CustomText>
                ) : isSessionUpcoming ? (
                  <CustomText>⌛️</CustomText>
                ) : (
                  <CustomText>⚠️</CustomText>
                )}
              </>
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
                    <ClockIcon />
                    <CustomText fontFamily={"regular"} fontSize={12}>
                      {format(props.item?.start_time, "h:mm a")}
                    </CustomText>
                    <ArrowRightIcon />
                    <CustomText fontFamily={"regular"} fontSize={12}>
                      {format(props.item?.end_time, "h:mm a")}
                    </CustomText>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          </ReanimatedSwipeable>
        </GestureHandlerRootView>
        {updateSession.status === "loading" ||
        deleteSession.status === "loading" ? (
          <CustomActivityIndicator
            position={"overlay"}
            overlayBackgroundType={"blurred"}
            size={"small"}
          />
        ) : null}
      </View>

      <ViewSessionSheet sheetRef={sheetRef} sessionData={props.item} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 10, overflow: "hidden" },
  contentContainer: {
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: COLORS.background.card,
    paddingBottom: 10,
    paddingHorizontal: 20,
    columnGap: 20,
    paddingTop: 5,
    borderLeftWidth: 12,
    borderLeftColor: COLORS.secondary,
    flexDirection: "row",
    alignItems: "center",
  },
  body: {
    rowGap: 6,
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
  separatorBar: {
    width: 1,
    height: "100%",
    borderRadius: 100,
    backgroundColor: COLORS.background.card,
    marginHorizontal: 20,
  },
  nameWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flex: 1,
  },
});
