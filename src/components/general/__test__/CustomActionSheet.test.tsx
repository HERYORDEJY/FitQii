import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomActionSheet from "~/components/general/CustomActionSheet";
import CustomText from "~/components/general/CustomText";

jest.mock("react-native-actions-sheet", () => ({
  __esModule: true,
  ...jest.requireActual("react-native-actions-sheet"),
  default: ({ children }) => children,
}));

jest.mock("~/constants/Colors", () => ({
  COLORS: {
    background: { card: "#fff", screen: "#eee" },
    text: { tertiary: "#333", secondary: "#666" },
    primary: "#007bff",
    secondary: "#ff9900",
  },
}));

/*jest.mock("~/components/general/CustomText", () => {
  return ({ children, ...props }: any) => <Text {...props}>{children}</Text>;
});

jest.mock("~/components/inputs/SearchInput", () => {
  return ({ onChangeText }: any) => (
    <Text onPress={() => onChangeText?.("search")}>SearchInput</Text>
  );
});*/

const renderWithSafeArea = (ui: React.ReactElement) =>
  render(<SafeAreaProvider>{ui}</SafeAreaProvider>);

describe("CustomActionSheet.Container", () => {
  const refMock = { current: { hide: jest.fn(), show: jest.fn() } };

  it("renders title and subtitle", () => {
    refMock.current.show();

    const { getByText } = renderWithSafeArea(
      <CustomActionSheet.Container
        sheetRef={refMock}
        title="Select Item"
        subtitle="Choose one below"
        showHeader
      >
        <CustomText>Item 1</CustomText>
      </CustomActionSheet.Container>,
    );
    expect(getByText("Select Item")).toBeTruthy();
    expect(getByText("Choose one below")).toBeTruthy();
  });

  it("renders close button and calls onClose", async () => {
    const onClose = jest.fn();
    const { getByTestId, getByText } = renderWithSafeArea(
      <CustomActionSheet.Container
        sheetRef={refMock}
        onClose={onClose}
        closeTitle="Dismiss"
        showHeader
      />,
    );
    fireEvent.press(getByTestId("close-button"));
    expect(onClose).toHaveBeenCalled();
    expect(refMock.current.hide).toHaveBeenCalled();
    expect(getByText("Dismiss")).toBeTruthy();
  });

  it("renders done button and calls onDone", async () => {
    const onDone = jest.fn();
    const { getByTestId, getByText } = renderWithSafeArea(
      <CustomActionSheet.Container
        sheetRef={refMock}
        onDone={onDone}
        showDone
        doneTitle="Finish"
        showHeader
      />,
    );
    fireEvent.press(getByTestId("done-button"));
    expect(onDone).toHaveBeenCalled();
    expect(refMock.current.hide).toHaveBeenCalled();
    expect(getByText("Finish")).toBeTruthy();
  });

  it("shows SearchInput if showSearch is true", () => {
    const { getByText } = renderWithSafeArea(
      <CustomActionSheet.Container
        sheetRef={refMock}
        showSearch
        onSearch={jest.fn()}
      />,
    );
    expect(getByText("SearchInput")).toBeTruthy();
  });

  it("renders children correctly", () => {
    const { getByText } = renderWithSafeArea(
      <CustomActionSheet.Container sheetRef={refMock}>
        <CustomText>Custom child</CustomText>
      </CustomActionSheet.Container>,
    );
    expect(getByText("Custom child")).toBeTruthy();
  });

  it("does not render header if showHeader is false", () => {
    const { queryByText } = renderWithSafeArea(
      <CustomActionSheet.Container
        sheetRef={refMock}
        showHeader={false}
        title="No Header"
      />,
    );
    expect(queryByText("No Header")).toBeNull();
  });
});

describe("CustomActionSheet.Item", () => {
  it("renders string children", () => {
    const { getByText } = render(
      <CustomActionSheet.Item active>Item Label</CustomActionSheet.Item>,
    );
    expect(getByText("Item Label")).toBeTruthy();
  });

  it("renders JSX children", () => {
    const { getByText } = render(
      <CustomActionSheet.Item>
        <CustomText>Child Component</CustomText>
      </CustomActionSheet.Item>,
    );
    expect(getByText("Child Component")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <CustomActionSheet.Item onPress={mockPress}>
        ClickMe
      </CustomActionSheet.Item>,
    );
    fireEvent.press(getByText("ClickMe"));
    expect(mockPress).toHaveBeenCalled();
  });

  it("applies disabled style", () => {
    const { getByText } = render(
      <CustomActionSheet.Item disabled>Disabled</CustomActionSheet.Item>,
    );
    expect(getByText("Disabled")).toBeTruthy();
  });
});
