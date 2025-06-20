import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import SelectInput from "../SelectInput";

jest.mock("~/components/general/CustomText", () => {
  const { Text } = require("react-native");
  return (props: any) => <Text>{props.children}</Text>;
});

jest.mock("~/components/inputs/CustomTextInput", () => {
  const { TextInput } = require("react-native");
  return (props: any) => <TextInput {...props} testID="text-input" />;
});

jest.mock("~/components/general/CustomActionSheet", () => ({
  Container: (props: any) => <>{props.children}</>,
  Item: (props: any) => {
    const { Text, TouchableOpacity } = require("react-native");
    return (
      <TouchableOpacity onPress={props.onPress} testID="sheet-item">
        <Text>{props.children}</Text>
      </TouchableOpacity>
    );
  },
}));

describe("SelectInput", () => {
  const mockOptions = [
    { id: "1", label: "Option A", value: "a" },
    { id: "2", label: "Option B", value: "b" },
  ];

  it("renders input with placeholder and label", () => {
    const { getByText, getByPlaceholderText } = render(
      <SelectInput
        label="Choose option"
        placeholder="Select here"
        options={mockOptions}
        selectedOptionValue="a"
        onSelectOption={jest.fn()}
      />,
    );

    expect(getByText("Choose option")).toBeTruthy();
    expect(getByPlaceholderText("Select here")).toBeTruthy();
  });

  it("calls onSelectOption when item is selected", () => {
    const onSelectOption = jest.fn();
    const { getAllByTestId } = render(
      <SelectInput
        options={mockOptions}
        selectedOptionValue="a"
        onSelectOption={onSelectOption}
      />,
    );

    const items = getAllByTestId("sheet-item");
    fireEvent.press(items[1]);

    expect(onSelectOption).toHaveBeenCalledWith(mockOptions[1]);
  });
});
