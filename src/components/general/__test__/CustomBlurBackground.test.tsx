import React from "react";
import { render } from "@testing-library/react-native";
import { BlurView } from "expo-blur";
import CustomBlurBackground from "~/components/general/CustomBlurBackground";
import CustomText from "~/components/general/CustomText";

describe("CustomBlurBackground", () => {
  it("renders BlurView with given blurAmount and blurType", () => {
    const { UNSAFE_getByType } = render(
      <CustomBlurBackground blurAmount={50} blurType="dark">
        <CustomText>Blurred content</CustomText>
      </CustomBlurBackground>,
    );

    const blur = UNSAFE_getByType(BlurView);
    expect(blur.props.intensity).toBe(50);
    expect(blur.props.tint).toBe("dark");
  });

  it("applies overlay style when position is overlay", () => {
    const { UNSAFE_getByType } = render(
      <CustomBlurBackground position="overlay">
        <CustomText>Overlayed</CustomText>
      </CustomBlurBackground>,
    );

    const blurView = UNSAFE_getByType(BlurView);
    const flattened = Array.isArray(blurView.props.style)
      ? Object.assign({}, ...blurView.props.style)
      : blurView.props.style;
    expect(flattened.position).toBe("absolute");
  });

  it("renders children inside", () => {
    const { getByText } = render(
      <CustomBlurBackground>
        <CustomText>Content</CustomText>
      </CustomBlurBackground>,
    );
    expect(getByText("Content")).toBeTruthy();
  });
});
