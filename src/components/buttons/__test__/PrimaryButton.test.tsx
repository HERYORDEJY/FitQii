import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import PrimaryButton from "../PrimaryButton";
import { View } from "react-native";
import CustomText from "~/components/general/CustomText";

describe(`PrimaryButton`, () => {
  it("renders with string children", () => {
    const { getByText } = render(<PrimaryButton>Click me</PrimaryButton>);
    expect(getByText("Click me")).toBeTruthy();
  });

  it("renders with JSX children", () => {
    const jsx = <CustomText>Custom</CustomText>;
    const { getByText } = render(<PrimaryButton>{jsx}</PrimaryButton>);
    expect(getByText("Custom")).toBeTruthy();
  });

  it("renders leftElement if passed", () => {
    const { getByTestId } = render(
      <PrimaryButton leftElement={<View testID="left-icon" />}>
        Hello
      </PrimaryButton>,
    );
    expect(getByTestId("left-icon")).toBeTruthy();
  });

  it("renders loading spinner if loading=true", () => {
    const { getByTestId, queryByText } = render(
      <PrimaryButton loading>Loading...</PrimaryButton>,
    );
    expect(getByTestId("activity-indicator")).toBeTruthy();
    expect(queryByText("Loading...")).toBeNull(); // text should be hidden
  });

  it("applies custom style and titleStyle", () => {
    const { getByText } = render(
      <PrimaryButton style={{ marginTop: 10 }} titleStyle={{ fontSize: 22 }}>
        Styled
      </PrimaryButton>,
    );
    const buttonText = getByText("Styled");
    const flat = Object.assign({}, ...buttonText.props.style);
    expect(flat.fontSize).toBe(22);
  });

  it("fires onPress if enabled", () => {
    const fn = jest.fn();
    const { getByText } = render(
      <PrimaryButton onPress={fn}>Tap</PrimaryButton>,
    );
    fireEvent.press(getByText("Tap"));
    expect(fn).toHaveBeenCalled();
  });

  it("does NOT fire onPress if disabled", () => {
    const fn = jest.fn();
    const { getByText } = render(
      <PrimaryButton onPress={fn} disabled>
        Disabled
      </PrimaryButton>,
    );
    fireEvent.press(getByText("Disabled"));
    expect(fn).not.toHaveBeenCalled();
  });

  it("does NOT fire onPress if loading", () => {
    const fn = jest.fn();
    const { getByTestId } = render(
      <PrimaryButton onPress={fn} loading>
        LoadBtn
      </PrimaryButton>,
    );
    fireEvent.press(getByTestId("activity-indicator")); // spinner is rendered
    expect(fn).not.toHaveBeenCalled();
  });
});
