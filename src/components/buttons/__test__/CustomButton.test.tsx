import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import CustomButton from "../CustomButton";
import { View } from "react-native";
import CustomText from "~/components/general/CustomText";

describe(`CustomButton`, () => {
  it("renders with string children", () => {
    const { getByText } = render(<CustomButton>Click me</CustomButton>);
    expect(getByText("Click me")).toBeTruthy();
  });

  it("renders with JSX children", () => {
    const jsx = <CustomText>Custom</CustomText>;
    const { getByText } = render(<CustomButton>{jsx}</CustomButton>);
    expect(getByText("Custom")).toBeTruthy();
  });

  it("renders leftElement if passed", () => {
    const { getByTestId } = render(
      <CustomButton leftElement={<View testID="left-icon" />}>
        Hello
      </CustomButton>,
    );
    expect(getByTestId("left-icon")).toBeTruthy();
  });

  it("renders loading spinner if loading=true", () => {
    const { getByTestId, queryByText } = render(
      <CustomButton loading>Loading...</CustomButton>,
    );
    expect(getByTestId("activity-indicator")).toBeTruthy();
    expect(queryByText("Loading...")).toBeNull(); // text should be hidden
  });

  it("applies custom style and titleStyle", () => {
    const { getByText } = render(
      <CustomButton style={{ marginTop: 10 }} titleStyle={{ fontSize: 22 }}>
        Styled
      </CustomButton>,
    );
    const buttonText = getByText("Styled");
    const flat = Object.assign({}, ...buttonText.props.style);
    expect(flat.fontSize).toBe(22);
  });

  it("fires onPress if enabled", () => {
    const fn = jest.fn();
    const { getByText } = render(<CustomButton onPress={fn}>Tap</CustomButton>);
    fireEvent.press(getByText("Tap"));
    expect(fn).toHaveBeenCalled();
  });

  it("does NOT fire onPress if disabled", () => {
    const fn = jest.fn();
    const { getByText } = render(
      <CustomButton onPress={fn} disabled>
        Disabled
      </CustomButton>,
    );
    fireEvent.press(getByText("Disabled"));
    expect(fn).not.toHaveBeenCalled();
  });

  it("does NOT fire onPress if loading", () => {
    const fn = jest.fn();
    const { getByTestId } = render(
      <CustomButton onPress={fn} loading>
        LoadBtn
      </CustomButton>,
    );
    fireEvent.press(getByTestId("activity-indicator")); // spinner is rendered
    expect(fn).not.toHaveBeenCalled();
  });
});
