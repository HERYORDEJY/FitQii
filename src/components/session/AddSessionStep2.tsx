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
import { SelectOptionType } from "~/components/inputs/types";

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
            />
          </View>
        </View>

        <View style={[styles.fieldGroup]}>
          <CustomText>Timing of Session</CustomText>
          <View style={[styles.dateFieldsRow]}>
            <TimeInput
              onSelectDate={(date) => handleEnterData("start_time", date)}
              selectedDate={props.formData?.start_time}
              containerStyle={{ flex: 1 }}
            />
            <ArrowRightIcon
              width={18}
              height={30}
              color={COLORS.text.tertiary}
            />
            <TimeInput
              onSelectDate={(date) => handleEnterData("end_time", date)}
              selectedDate={props.formData?.end_time}
              containerStyle={{ flex: 1 }}
            />
          </View>
        </View>

        <View style={[styles.fieldGroup]}>
          <CustomText>Duration</CustomText>
          <SelectInput
            options={Timezones}
            onSelectOption={(option) =>
              handleEnterData("duration", option.value)
            }
            selectedOptionValue={props.formData?.duration}
            containerStyle={{ flex: 1 }}
            selectTitle={"Select timezone"}
          />
        </View>

        <View style={[styles.fieldGroup]}>
          <CustomText>Reminder</CustomText>
          <SelectInput
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
          <CustomText>Repetition</CustomText>
          <SelectInput
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
    paddingVertical: 40,
    paddingHorizontal: 20,
    rowGap: 40,
  },
  fieldGroup: {
    rowGap: 12,
  },
  dateFieldsRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
  },
});

const ReminderOptions: Array<SelectOptionType> = [
  {
    label: "At time of event",
    value: 0,
  },
  {
    label: "10 min before",
    value: 10 * 60,
  },
  {
    label: "1 hour before",
    value: 1 * 60 * 60,
  },
  {
    label: "1 day before",
    value: 1 * 24 * 60 * 60,
  },
];

const RepetitionOptions: Array<SelectOptionType> = [
  {
    label: "Don't repeat",
    value: 0,
  },
  {
    label: "Every 1 day",
    value: 1 * 24 * 60 * 60,
  },
  {
    label: "Every 1 week",
    value: 7 * 24 * 60 * 60,
  },
  {
    label: "Every 1 month",
    value: 30 * 24 * 60 * 60,
  },
  {
    label: "Every 1 year",
    value: 365 * 24 * 60 * 60,
  },
];
