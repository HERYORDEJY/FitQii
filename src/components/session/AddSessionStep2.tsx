import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { screenDimensions } from "~/utils/size-helpers";
import DateInput from "~/components/inputs/DateInput";
import ArrowRightIcon from "~/components/svgs/ArrowRightIcon";
import { COLORS } from "~/constants/Colors";
import TimeInput from "~/components/inputs/TimeInput";
import CustomText from "~/components/general/CustomText";
import SelectInput from "~/components/inputs/SelectInput";
import { Timezones } from "~/data/timezones";
import { addMinutes, isAfter } from "date-fns";
import { ReminderOptions, RepetitionOptions } from "~/data/add-session-options";

interface Props {
  step: number;
  onEnterData: (step: number, data: any) => void;
  formData: Record<string, any>;
}

export default function AddSessionStep2(props: Props): React.JSX.Element {
  const handleEnterData = (key: string, value: any) => {
    props.onEnterData?.(props.step, { [key]: value });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.contentContainer]}>
        <View style={[styles.sessionTitleWrapper]}>
          <CustomText fontSize={22} fontFamily={"medium"}>
            {props.formData?.name ?? "Session"}
          </CustomText>
        </View>
        <View style={[styles.fieldGroup]}>
          <CustomText>When should it take place?</CustomText>
          <View style={[styles.dateFieldsRow]}>
            <DateInput
              onSelectDate={(date) => handleEnterData("start_date", date)}
              selectedDate={props.formData?.start_date}
              containerStyle={{ flex: 1 }}
            />
            <ArrowRightIcon
              width={18}
              height={30}
              color={COLORS.text.tertiary}
            />
            <DateInput
              onSelectDate={(date) => handleEnterData("end_date", date)}
              selectedDate={props.formData?.end_date}
              containerStyle={{ flex: 1 }}
              minimumDate={props.formData?.start_date}
            />
          </View>
        </View>

        <View style={[styles.fieldGroup]}>
          <CustomText>Timing of Session</CustomText>
          <View style={[styles.dateFieldsRow]}>
            <TimeInput
              onSelectTime={(date) => handleEnterData("start_time", date)}
              selectedTime={props.formData?.start_time}
              containerStyle={{ flex: 1 }}
            />
            <ArrowRightIcon
              width={18}
              height={30}
              color={COLORS.text.tertiary}
            />
            <TimeInput
              onSelectTime={(date) => handleEnterData("end_time", date)}
              selectedTime={props.formData?.end_time}
              containerStyle={{ flex: 1 }}
              minimumDate={
                isAfter(new Date(), props.formData?.start_time)
                  ? addMinutes(new Date(), 1)
                  : addMinutes(props.formData?.start_time, 1)
              }
            />
          </View>
        </View>

        <View style={[styles.fieldGroup]}>
          <SelectInput
            label={"Timezone"}
            options={Timezones}
            onSelectOption={(option) =>
              handleEnterData("timezone", option.value)
            }
            selectedOptionValue={props.formData?.timezone}
            containerStyle={{ flex: 1 }}
            selectTitle={"Select timezone"}
            sheetContentContainerStyle={{ paddingBottom: 50 }}
          />
        </View>

        <View style={[styles.fieldGroup]}>
          <SelectInput
            label={"Reminder"}
            options={ReminderOptions}
            onSelectOption={(option) =>
              handleEnterData("reminder", option.value)
            }
            selectedOptionValue={props.formData?.reminder}
            containerStyle={{ flex: 1 }}
            selectTitle={"Select reminder"}
          />
        </View>

        <View style={[styles.fieldGroup]}>
          <SelectInput
            label={"Repetition"}
            options={RepetitionOptions}
            onSelectOption={(option) =>
              handleEnterData("repetition", option.value)
            }
            selectedOptionValue={props.formData?.repetition}
            containerStyle={{ flex: 1 }}
            selectTitle={"Select repetition"}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenDimensions.width,
  },
  contentContainer: {
    width: screenDimensions.width,
    paddingVertical: 20,
    paddingHorizontal: 20,
    rowGap: 40,
  },
  fieldGroup: {
    rowGap: 10,
  },
  dateFieldsRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
  },
  sessionTitleWrapper: {
    borderLeftWidth: 6,
    borderLeftColor: COLORS.primary + 20,
    backgroundColor: COLORS.primary + 10,
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sessionTitleText: {
    //
  },
});
