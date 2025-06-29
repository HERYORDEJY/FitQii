import React, { useRef, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomTextInput from "~/components/inputs/CustomTextInput";
import { CustomTextInputProps } from "~/components/inputs/types";
import CustomText from "~/components/general/CustomText";
import { COLORS } from "~/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { format, isValid } from "date-fns";
import CalendarIcon from "~/components/svgs/CalendarIcon";
import CustomActionSheet from "~/components/general/CustomActionSheet";
import { ActionSheetRef } from "react-native-actions-sheet";

type Props = CustomTextInputProps & {
  selectTitle?: string;
  disabled?: boolean;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  maximumDate?: Date;
  minimumDate?: Date;
};

export default function DateInput(props: Props): React.JSX.Element {
  const safeAreaInsets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const sheetRef = useRef<ActionSheetRef>(null);
  const isDisabled = props.disabled;
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  const handleConfirmPick = () => {
    props.onSelectDate?.(selectedDate!);
    sheetRef.current?.hide();
  };

  const handleCancelPick = () => {
    sheetRef.current?.hide();
  };

  const handleOpenSelect = () => {
    setSelectedDate(props.selectedDate ?? props.minimumDate ?? new Date());
    if (Platform.OS === "ios") {
      sheetRef.current?.show();
      return;
    }
    setShowAndroidPicker(true);
    return;
  };

  const handlePickerChange = (event: any, date: any) => {
    if (event.type === "dismissed") {
      setShowAndroidPicker(false);
      return;
    }

    if (Platform.OS === "android") {
      setSelectedDate(date);
      props.onSelectDate?.(date);
      setShowAndroidPicker(false);
      return;
    }

    if (Platform.OS === "ios") {
      setSelectedDate(date);
      // props.onSelectDate?.(date);
    }
  };

  const renderPicker = () => {
    return (
      <DateTimePicker
        minimumDate={
          props.minimumDate ? new Date(props.minimumDate) : new Date()
        }
        maximumDate={
          props.maximumDate ? new Date(props.maximumDate) : undefined
        }
        value={props.selectedDate ?? selectedDate!}
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
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleOpenSelect}
        disabled={isDisabled}
        style={styles.container}
        testID={"date-input-container"}
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

      {showAndroidPicker ? (
        <View testID="android-picker-wrapper">{renderPicker()}</View>
      ) : null}

      <CustomActionSheet.Container
        sheetRef={sheetRef}
        title={props.selectTitle ?? "Select"}
        showHeader={false}
      >
        <View
          style={[
            styles.pickerWrapper,
            { paddingBottom: safeAreaInsets.bottom },
          ]}
        >
          {Platform.OS === "ios" ? (
            <View testID="ios-picker-wrapper">{renderPicker()}</View>
          ) : null}

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
      </CustomActionSheet.Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
    flex: 1,
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
