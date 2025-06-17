import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { View } from "react-native";
import SecondaryButton from "~/components/buttons/SecondaryButton";
import CustomText from "~/components/general/CustomText";

describe(`SecondaryButton`, () => {
  it("renders with string children", () => {
    const { getByText } = render(<SecondaryButton>Click me</SecondaryButton>);
    expect(getByText("Click me")).toBeTruthy();
  });

  it("renders with JSX children", () => {
    const jsx = <CustomText>Custom</CustomText>;
    const { getByText } = render(<SecondaryButton>{jsx}</SecondaryButton>);
    expect(getByText("Custom")).toBeTruthy();
  });

  it("renders leftElement if passed", () => {
    const { getByTestId } = render(
      <SecondaryButton leftElement={<View testID="left-icon" />}>
        Hello
      </SecondaryButton>,
    );
    expect(getByTestId("left-icon")).toBeTruthy();
  });

  it("renders loading spinner if loading=true", () => {
    const { getByTestId, queryByText } = render(
      <SecondaryButton loading>Loading...</SecondaryButton>,
    );
    expect(getByTestId("activity-indicator")).toBeTruthy();
    expect(queryByText("Loading...")).toBeNull(); // text should be hidden
  });

  it("applies custom style and titleStyle", () => {
    const { getByText } = render(
      <SecondaryButton style={{ marginTop: 10 }} titleStyle={{ fontSize: 22 }}>
        Styled
      </SecondaryButton>,
    );
    const buttonText = getByText("Styled");
    const flat = Object.assign({}, ...buttonText.props.style);
    expect(flat.fontSize).toBe(22);
  });

  it("fires onPress if enabled", () => {
    const fn = jest.fn();
    const { getByText } = render(
      <SecondaryButton onPress={fn}>Tap</SecondaryButton>,
    );
    fireEvent.press(getByText("Tap"));
    expect(fn).toHaveBeenCalled();
  });

  it("does NOT fire onPress if disabled", () => {
    const fn = jest.fn();
    const { getByText } = render(
      <SecondaryButton onPress={fn} disabled>
        Disabled
      </SecondaryButton>,
    );
    fireEvent.press(getByText("Disabled"));
    expect(fn).not.toHaveBeenCalled();
  });

  it("does NOT fire onPress if loading", () => {
    const fn = jest.fn();
    const { getByTestId } = render(
      <SecondaryButton onPress={fn} loading>
        LoadBtn
      </SecondaryButton>,
    );
    fireEvent.press(getByTestId("activity-indicator")); // spinner is rendered
    expect(fn).not.toHaveBeenCalled();
  });
});
