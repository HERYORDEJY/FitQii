import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "~/components/general/CustomText";
import { COLORS } from "~/constants/Colors";
import ClockIcon from "~/components/svgs/ClockIcon";
import ArrowRightIcon from "~/components/svgs/ArrowRightIcon";
import { SessionItemDataType } from "~/components/session/types";
import { format } from "date-fns";
import ViewSessionSheet from "~/components/session/ViewSessionSheet";
import { ActionSheetRef } from "react-native-actions-sheet";
import { isValidDate } from "~/utils/date-helpers";

interface Props {
  item: SessionItemDataType;
  onActionCompleted?: () => void;
  onSelectedItem?: (item: SessionItemDataType) => void;
}

export default function HistoryListItem(props: Props): React.JSX.Element {
  const isSessionCancelled = props.item.status === "cancelled";
  const sheetRef = useRef<ActionSheetRef>(null);

  const handleOpenItem = () => {
    props.onSelectedItem?.(props.item);
    sheetRef.current?.show();
  };

  return (
    <>
      <View style={[styles.container]}>
        <TouchableOpacity
          onPress={handleOpenItem}
          style={[
            styles.contentContainer,
            isSessionCancelled && { opacity: 0.5 },
          ]}
        >
          <View style={styles.body}>
            <View style={[styles.nameWrapper]}>
              <CustomText fontFamily={"medium"}>{props.item?.name}</CustomText>
              {isSessionCancelled ? (
                <CustomText fontFamily={"medium"} fontSize={11} color={"#CCC"}>
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
      </View>

      <ViewSessionSheet
        sheetRef={sheetRef}
        sessionData={props.item}
        showStatus={false}
      />
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
