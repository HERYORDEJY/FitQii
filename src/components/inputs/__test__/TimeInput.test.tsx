import React from "react";
import { Platform, Text } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";
import { format } from "date-fns";
import TimeInput from "~/components/inputs/TimeInput";

jest.mock("~/components/general/CustomText", () => {
  const { Text } = require("react-native");
  return (props: any) => <Text>{props.children}</Text>;
});

jest.mock("~/components/inputs/CustomTextInput", () => {
  const { TextInput } = require("react-native");
  return (props: any) => <TextInput {...props} testID="time-input-field" />;
});

jest.mock("@react-native-community/datetimepicker", () => {
  return (props: any) => {
    const { Text, View } = require("react-native");
    return (
      <View testID={`mock-picker`}>
        <Text>Picker mode: {props.mode}</Text>
      </View>
    );
  };
});

jest.mock("~/components/general/CustomActionSheet", () => ({
  Container: (props: any) => {
    const { View } = require("react-native");
    return <View testID="action-sheet">{props.children}</View>;
  },
}));

describe("TimeInput", () => {
  const devicePlatform = Platform.OS;
  const testDate = new Date();

  afterEach(() => {
    Object.defineProperty(Platform, "OS", { value: devicePlatform });
  });

  it("opens CustomActionSheet on iOS and renders picker inside it", () => {
    Object.defineProperty(Platform, "OS", { value: "ios" });

    const { getByTestId, getAllByTestId } = render(
      <TimeInput selectedTime={testDate} onSelectTime={jest.fn()} />,
    );

    fireEvent.press(getByTestId("time-input-container"));

    const actionSheet = getByTestId("action-sheet");
    const pickers = getAllByTestId(`ios-picker-wrapper`);
    expect(actionSheet).toBeTruthy();
    expect(pickers.length).toBe(1); // Only 1 picker rendered inside sheet
  });

  it("shows Android picker when pressed", () => {
    Object.defineProperty(Platform, "OS", { value: "android" });

    const { getByTestId, queryByTestId } = render(
      <TimeInput selectedTime={testDate} onSelectTime={jest.fn()} />,
    );

    fireEvent.press(getByTestId("time-input-container"));

    expect(getByTestId("android-picker-wrapper")).toBeTruthy();
  });

  /*
  it('calls onSelectTime when Confirm is pressed', () => {
    const onSelectTime = jest.fn();
    const { getByText } = render(
      <TimeInput selectedTime={testDate} onSelectTime={onSelectTime} />
    );

    fireEvent.press(getByText('Confirm'));
    expect(onSelectTime).toHaveBeenCalledWith(testDate);
  });
*/

  it("calls onSelectTime when Confirm is pressed", () => {
    const onSelectTime = jest.fn();
    const { getByText } = render(
      <TimeInput selectedTime={testDate} onSelectTime={onSelectTime} />,
    );

    fireEvent.press(getByText("Confirm"));
    expect(onSelectTime).toHaveBeenCalled();
    const calledDate = onSelectTime.mock.calls[0][0];
    expect(calledDate instanceof Date).toBe(true);
    expect(format(calledDate.getTime(), "dd-MM-yy hh:mm")).toBe(
      format(testDate.getTime(), "dd-MM-yy hh:mm"),
    );
  });
});
