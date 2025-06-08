import React, { useCallback, useRef, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomTextInput from "~/components/inputs/CustomTextInput";
import { CustomTextInputProps } from "~/components/inputs/types";
import { BottomSheetRef } from "~/components/general/types";
import BottomSheet from "~/components/general/BottomSheet";
import CustomText from "~/components/general/CustomText";
import { COLORS } from "~/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { format, isValid } from "date-fns";
import { useBooleanValue } from "~/hooks/useBooleanValue";
import CalendarIcon from "~/components/svgs/CalendarIcon";

type Props = CustomTextInputProps & {
  selectTitle?: string;
  disabled?: boolean;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
};

export default function DateInput(props: Props): React.JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const sheetRef = useRef<BottomSheetRef>(null);
  const isDisabled = props.disabled;
  const keyExtractor = useCallback((item: any, index: number) => {
    return `${item?.id} - ${index}`;
  }, []);
  const showAndroidPicker = useBooleanValue(false);

  const handleConfirmPick = () => {
    props.onSelectDate?.(selectedDate!);
    sheetRef.current?.close();
  };

  const handleCancelPick = () => {
    sheetRef.current?.close();
  };

  const handleOpenSelect = () => {
    if (Platform.OS === "ios") {
      sheetRef.current?.open({
        title: "Hello World",
        items: [...Array(10).keys()],
      });
      return;
    }
    showAndroidPicker.setTrueValue();
    return;
  };

  const handlePickerChange = (event: any, date: any) => {
    if (event.type === "dismissed") {
      showAndroidPicker.setFalseValue();
      return;
    }

    if (Platform.OS === "android") {
      props.onSelectDate?.(date);
      showAndroidPicker.setFalseValue();
      return;
    }

    if (Platform.OS === "ios") {
      setSelectedDate(date);
      // props.onSelectDate?.(date);
    }
  };

  const renderPicker = useCallback(() => {
    return (
      <DateTimePicker
        minimumDate={new Date()}
        value={props.selectedDate ?? new Date()}
        mode={"date"}
        display={"spinner"}
        accentColor={COLORS.primary}
        textColor="#FFF"
        themeVariant={"dark"}
        // style={{ flex: 1 }}
        negativeButton={{
          label: "Cancel",
          textColor: COLORS.background.card,
        }}
        positiveButton={{ label: "Confirm", textColor: COLORS.primary }}
        onChange={handlePickerChange}
      />
    );
  }, [props.selectedDate]);

  return (
    <>
      <TouchableOpacity
        onPress={handleOpenSelect}
        disabled={isDisabled}
        style={styles.container}
      >
        {props.label ? (
          <CustomText style={[styles.label]}>{props.label}</CustomText>
        ) : null}
        <CustomTextInput
          {...props}
          renderRightElement={<CalendarIcon />}
          pointerEvents={"none"}
          value={
            isValid(props.selectedDate)
              ? format(props.selectedDate!, "dd/MM/yy")
              : undefined
          }
          label={undefined}
          placeholder={props.placeholder ?? "DD/MM/YY"}
          editable={false}
        />
      </TouchableOpacity>

      {showAndroidPicker.value ? <View>{renderPicker()}</View> : null}

      <BottomSheet ref={sheetRef} title={props.selectTitle ?? "Select"}>
        {() => {
          return (
            <View
              style={[
                styles.pickerWrapper,
                { paddingBottom: safeAreaInsets.bottom },
              ]}
            >
              <>{renderPicker()}</>

              <View style={[styles.pickerButtons]}>
                <TouchableOpacity
                  style={[styles.cancelButton]}
                  onPress={handleCancelPick}
                >
                  <CustomText color={"#FFF"} fontSize={16} fontFamily="bold">
                    Cancel
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton]}
                  onPress={handleConfirmPick}
                >
                  <CustomText
                    color={COLORS.background.screen}
                    fontSize={16}
                    fontFamily="bold"
                  >
                    Confirm
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  item: {
    height: 40,
    flexDirection: "row",
    borderLeftWidth: 6,
    borderLeftColor: "transparent",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  contentContainer: {
    rowGap: 10,
  },
  label: {},
  confirmButton: {
    height: 40,
    width: "100%",
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  cancelButton: {
    height: 40,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "transparent",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.outline.card,
    alignItems: "center",
    flex: 1,
  },
  pickerWrapper: {
    rowGap: 20,
  },
  pickerButtons: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 20,
  },
});
