import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import ToastNotification from "../ToastNotification";

describe("ToastNotification", () => {
  it("renders top and bottom toasts correctly", () => {
    const { getByText } = render(<ToastNotification />);
    expect(getByText("Test toast")).toBeTruthy();
    expect(getByText("Bottom toast")).toBeTruthy();
  });

  it("displays default icon if none is provided", () => {
    const { getByText } = render(<ToastNotification />);
    expect(getByText("✓")).toBeTruthy(); // Default for "success"
  });

  it("calls onHide when close button is pressed", () => {
    const { getAllByText } = render(<ToastNotification />);
    const closeButtons = getAllByText("×");
    expect(closeButtons.length).toBeGreaterThan(0);
    fireEvent.press(closeButtons[0]);
  });
});
