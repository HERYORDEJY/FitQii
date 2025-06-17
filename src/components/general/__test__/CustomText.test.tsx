// CustomText.test.tsx
import React from "react";
import { render } from "@testing-library/react-native";
import CustomText from "~/components/general/CustomText";

describe("CustomText", () => {
  it("renders the text content", () => {
    const { getByText } = render(<CustomText>Hello World</CustomText>);
    expect(getByText("Hello World")).toBeTruthy();
  });

  it("applies default styles when no props are passed", () => {
    const { getByText } = render(<CustomText>Default</CustomText>);
    const text = getByText("Default");

    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: expect.any(String),
          fontSize: 14,
          fontFamily: "regular",
          fontWeight: 300,
        }),
      ]),
    );
  });

  it("overrides default styles with custom props", () => {
    const { getByText } = render(
      <CustomText color="red" fontSize={20} fontFamily="bold">
        Custom
      </CustomText>,
    );
    const text = getByText("Custom");

    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: "red",
          fontSize: 20,
          fontFamily: "bold",
        }),
      ]),
    );
  });

  it("merges external styles correctly", () => {
    const { getByText } = render(
      <CustomText style={{ marginTop: 10 }}>Styled</CustomText>,
    );
    const text = getByText("Styled");

    // Check that `marginTop` was merged
    const flatStyle = Object.assign({}, ...text.props.style);
    expect(flatStyle.marginTop).toBe(10);
  });

  it("passes additional props to Text (like numberOfLines)", () => {
    const { getByText } = render(
      <CustomText numberOfLines={2}>Clipped</CustomText>,
    );
    const text = getByText("Clipped");
    expect(text.props.numberOfLines).toBe(2);
  });
});
