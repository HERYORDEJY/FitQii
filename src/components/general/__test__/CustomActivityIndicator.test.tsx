import React from "react";
import { render } from "@testing-library/react-native";
import CustomActivityIndicator from "../CustomActivityIndicator";

// jest.mock("./CustomText", () => (props: any) => (
//   <CustomText {...props}>{props.children}</CustomText>
// ));
//
// jest.mock("./CustomBlurBackground", () => (props: any) => (
//   <CustomText testID="blur-background">{props.children}</CustomText>
// ));

describe("CustomActivityIndicator", () => {
  it("renders loading spinner by default", () => {
    const { getByTestId } = render(<CustomActivityIndicator />);
    expect(getByTestId("activity-indicator")).toBeTruthy();
  });

  it("renders with title and description", () => {
    const { getByText } = render(
      <CustomActivityIndicator title="Loading..." description="Please wait" />,
    );
    expect(getByText("Loading...")).toBeTruthy();
    expect(getByText("Please wait")).toBeTruthy();
  });

  it("renders with overlay styling when position is overlay", () => {
    const { getByTestId } = render(
      <CustomActivityIndicator position="overlay" />,
    );
    const container = getByTestId("activity-container");
    const flatStyle = Object.assign({}, ...container.props.style);
    expect(flatStyle.position).toBe("absolute");
  });

  it("renders inside CustomBlurBackground when blurred is set", () => {
    const { getByTestId } = render(
      <CustomActivityIndicator overlayBackgroundType="blurred" />,
    );
    expect(getByTestId("blur-background")).toBeTruthy();
  });
});
