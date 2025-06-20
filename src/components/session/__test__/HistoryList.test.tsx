import React from "react";
import { render } from "@testing-library/react-native";
import HistoryList from "../HistoryList";

jest.mock("~/components/session/HistoryListItem", () => {
  const { Text } = require("react-native");
  return ({ item }: any) => <Text>{item.name}</Text>;
});
jest.mock("~/components/general/CustomText", () => {
  const { Text } = require("react-native");
  return (props: any) => <Text>{props.children}</Text>;
});
jest.mock("~/components/general/CustomActivityIndicator", () => {
  const { Text } = require("react-native");
  return () => <Text>Loading...</Text>;
});
jest.mock("~/services/db/actions", () => ({
  usePastSessions: jest.fn(() => ({
    data: [
      {
        title: new Date().toISOString(),
        data: [
          {
            id: 1,
            name: "History 1",
            status: "upcoming",
            start_date: Date.now(),
            end_date: Date.now(),
            start_time: Date.now(),
            end_time: Date.now() + 1000 * 60 * 60,
            category: "focus",
            location: "https://maps.app/test",
            link: "https://zoom.com/test",
            timezone: "UTC",
            reminder: 0,
            repetition: 0,
            description: "A deep work session",
            attachments: JSON.stringify([{ name: "file1.pdf" }]),
            mode: "online",
            status_at: null,
          },
        ],
      },
    ],
    isLoading: false,
    isRefetching: false,
    refetch: jest.fn(),
  })),
}));

jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest
      .fn()
      .mockImplementation(({ children }) => children(inset)),
    SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  };
});

const renderSafe = (ui: React.ReactElement) => render(<>{ui}</>);

describe("HistoryList", () => {
  it("renders sectioned history sessions", () => {
    const { getByText } = renderSafe(<HistoryList headerHeight={100} />);
    expect(getByText("History 1")).toBeTruthy();
  });

  it("renders empty text if search has no result", () => {
    const mockPast = require("~/services/db/actions").usePastSessions;
    mockPast.mockReturnValueOnce({
      data: [],
      isLoading: false,
      isRefetching: false,
      refetch: jest.fn(),
    });

    const { getByText } = renderSafe(
      <HistoryList searchQuery="nothing" headerHeight={100} />,
    );
    expect(getByText("No session meets search query")).toBeTruthy();
  });
});
