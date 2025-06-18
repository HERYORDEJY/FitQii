import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import SearchInput from "../SearchInput";
import { StyleSheet } from "react-native";

describe("SearchInput", () => {
  it("renders with default placeholder", () => {
    const { getByPlaceholderText } = render(<SearchInput />);
    expect(getByPlaceholderText("Search here")).toBeTruthy();
  });

  it("uses custom placeholder if provided", () => {
    const { getByPlaceholderText } = render(
      <SearchInput placeholder="Find something" />,
    );
    expect(getByPlaceholderText("Find something")).toBeTruthy();
  });

  it("calls onChangeText when text changes", () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchInput onChangeText={mockOnChangeText} />,
    );
    const input = getByPlaceholderText("Search here");

    input.props.onChangeText("test");
    expect(mockOnChangeText).toHaveBeenCalledWith("test");
  });

  it("calls onChangeText when input changes", () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchInput onChangeText={mockOnChangeText} />,
    );

    const input = getByPlaceholderText("Search here");
    fireEvent.changeText(input, "React Native");

    expect(mockOnChangeText).toHaveBeenCalledWith("React Native");
  });

  it("applies custom styles to container", () => {
    const { getByTestId } = render(
      <SearchInput containerStyle={{ backgroundColor: "lightgray" }} />,
    );
    const container = getByTestId("input-container");
    const flatStyle = StyleSheet.flatten(container.props.style);
    expect(flatStyle.backgroundColor).toBe("lightgray");
  });

  it("applies custom styles to text input", () => {
    const { getByTestId } = render(
      <SearchInput textInputStyle={{ color: "blue" }} />,
    );
    const input = getByTestId("text-input");
    const flatStyle = StyleSheet.flatten(input.props.style);
    expect(flatStyle.color).toBe("blue");
  });

  it("renders with custom icon if provided", () => {
    const { getByTestId } = render(<SearchInput renderLeftElement={<></>} />);
    const icon = getByTestId("search-input-icon");
    expect(icon).toBeTruthy();
  });
});
