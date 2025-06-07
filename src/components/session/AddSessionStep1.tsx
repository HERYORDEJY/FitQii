import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import CustomTextInput from "~/components/inputs/CustomTextInput";
import { COLORS } from "~/constants/Colors";
import { screenDimensions } from "~/utils/size-helpers";
import SelectInput from "~/components/inputs/SelectInput";

interface Props {
  step: number;
  onEnterData: (step: number, data: any) => void;
  formData: Record<string, any>;
}

export default function AddSessionStep1(props: Props): React.JSX.Element {
  const handleEnterData = (key: string, value: any) => {
    props.onEnterData?.(props.step, { [key]: value });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.contentContainer]}>
        <CustomTextInput
          placeholder={"Session Name"}
          textInputStyle={{ fontSize: 22, fontFamily: "bold" }}
          contentContainerStyle={{
            backgroundColor: "transparent",
            borderLeftWidth: 6,
            borderLeftColor: COLORS.primary,
            borderRadius: 0,
          }}
          cursorColor={COLORS.primary}
          autoFocus={true}
          onChangeText={(text) => handleEnterData("name", text)}
        />

        <SelectInput
          label={"Category"}
          selectTitle={"Category"}
          placeholder={"Select category"}
          options={Categories}
          onSelectOption={(option) => handleEnterData("category", option.value)}
          selectedOptionValue={props.formData?.category}
        />
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
});

const Categories = [
  {
    id: "001",
    label: "Meeting",
    value: "meeting",
  },
  {
    id: "002",
    label: "Gym",
    value: "gym",
  },
  {
    id: "003",
    label: "Shopping",
    value: "shopping",
  },
  {
    id: "004",
    label: "Class",
    value: "class",
  },
];
