import React from "react";
import { render } from "@testing-library/react-native";
import CustomTextInput from "../CustomTextInput";
import { View } from "react-native";

describe("CustomTextInput", () => {
  it("renders with label", () => {
    const { getByText } = render(<CustomTextInput label="Email" />);
    expect(getByText("Email")).toBeTruthy();
  });

  it("does not render label if none is provided", () => {
    const { queryByText } = render(<CustomTextInput />);
    expect(queryByText("Label")).toBeNull();
  });

  it("renders left and right elements", () => {
    const { getByTestId } = render(
      <CustomTextInput
        renderLeftElement={<View testID="left" />}
        renderRightElement={<View testID="right" />}
      />,
    );
    expect(getByTestId("left")).toBeTruthy();
    expect(getByTestId("right")).toBeTruthy();
  });

  it("passes custom styles to container and text input", () => {
    const { getByTestId } = render(
      <CustomTextInput
        containerStyle={{ marginTop: 20 }}
        textInputStyle={{ fontSize: 18 }}
        testID="input"
      />,
    );
    const input = getByTestId("input");
    expect(input).toBeTruthy();
  });
});
