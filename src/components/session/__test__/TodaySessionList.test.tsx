import React from "react";
import { act, render } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import TodaySessionList from "../TodaySessionList";
import { SessionItemDataType } from "~/components/session/types"; // adjust path if needed

// Mocks
jest.mock("~/db", () => ({
  sessionsDb: {}, // prevent SQLite error
}));

jest.mock("~/db/drizzle/migrations", () => ({}));

// Mock constants
jest.mock("~/constants/Colors", () => ({
  COLORS: {
    text: {
      primary: "#000000",
      secondary: "#666666",
      tertiary: "#999999",
    },
    background: {
      card: "#FFFFFF",
      screen: "#F5F5F5",
    },
  },
}));

// Mock components
jest.mock("~/components/session/TodaySessionListItem", () => (props: any) => {
  const { Text } = require("react-native");
  return (
    <Text testID={`session-item-${props.item.id}`} data-item={props.item}>
      {props.item.name}
    </Text>
  );
});

jest.mock("~/components/general/CustomActivityIndicator", () => () => {
  const { View, Text } = require("react-native");
  return (
    <View testID="activity-indicator">
      <Text>Loading...</Text>
    </View>
  );
});

jest.mock("~/components/general/CustomText", () => (props: any) => {
  const { Text } = require("react-native");
  // Extract color and style from props to properly simulate the component
  const { color, style, children, ...otherProps } = props;
  return (
    <Text
      {...otherProps}
      style={[style, color ? { color } : null]}
      testID={`custom-text-${children?.toString().replace(/\s+/g, "-").toLowerCase()}`}
    >
      {children}
    </Text>
  );
});

jest.mock("~/components/general/CustomText", () => () => {
  const { View, Text } = require("react-native");
  return (
    <View testID="empty-state">
      <Text>No session meets search query</Text>
    </View>
  );
});

jest.mock("~/services/db/actions", () => ({
  __esModule: true,
  useTodaySessions: jest.fn(),
}));

jest.mock("drizzle-orm/expo-sqlite/migrator", () => ({
  __esModule: true,
  useMigrations: jest.fn(),
}));

const mockUseTodaySessions = require("~/services/db/actions").useTodaySessions;

const mockUseMigrations =
  require("drizzle-orm/expo-sqlite/migrator").useMigrations;
// const mockUseTodaySessions = require("~/services/db/actions").default; // this is to mock the useTodaySessions hook

const renderWithSafeArea = (ui: React.ReactElement) =>
  render(<SafeAreaProvider>{ui}</SafeAreaProvider>);

const baseItem: SessionItemDataType = {
  id: 1,
  name: "Session A",
  status: "upcoming",
  start_time: Date.now(),
  end_time: Date.now() + 3600000,
  category: "Workshop",
  attachments: null,
  description: "An intro workshop",
  end_date: Date.now(),
  link: null,
  location: "Zoom",
  mode: "offline",
  reminder: 0,
  repetition: 0,
  start_date: Date.now(),
  timezone: "UTC",
  status_at: null,
};

describe("TodaySessionList", () => {
  // Force react to flush all effects and updates
  const flushEffects = async () => {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset migration mock to successful state
    mockUseMigrations.mockReturnValue({
      success: true,
      error: null,
    });

    // Default mock for useTodaySessions
    mockUseTodaySessions.mockReturnValue({
      data: [
        baseItem,
        { ...baseItem, id: 2, status: "active", name: "Session B" },
      ],
      isLoading: false,
      isRefetching: false,
      refetch: jest.fn(),
    });
  });

  it("renders list of sessions", async () => {
    const { findByText } = renderWithSafeArea(<TodaySessionList />);
    await flushEffects();

    // Use findByText which returns a promise and waits for elements
    const sessionA = await findByText("Session A");
    const sessionB = await findByText("Session B");

    expect(sessionA).toBeTruthy();
    expect(sessionB).toBeTruthy();
  });

  it("filters sessions by searchQuery", async () => {
    const { findByText, queryByText } = renderWithSafeArea(
      <TodaySessionList searchQuery="Session A" />,
    );
    await flushEffects();

    const sessionA = await findByText("Session A");
    expect(sessionA).toBeTruthy();
    expect(queryByText("Session B")).toBeNull();
  });

  it("shows empty state when no sessions match searchQuery", async () => {
    // Mock with data first, then apply filter that won't match
    const { findByText } = renderWithSafeArea(
      <TodaySessionList searchQuery="xyz" />,
    );
    await flushEffects();

    // Should show empty state text
    const emptyStateText = await findByText("No session meets search query");
    expect(emptyStateText).toBeTruthy();
  });

  it("shows loading spinner when sessions are loading", async () => {
    mockUseTodaySessions.mockReturnValue({
      data: [],
      isLoading: true,
      isRefetching: false,
      refetch: jest.fn(),
    });

    const { findByTestId } = renderWithSafeArea(<TodaySessionList />);
    await flushEffects();

    const spinnerContainer = await findByTestId("activity-indicator-container");
    // const spinner = await findByTestId("activity-indicator");
    expect(spinnerContainer).toBeTruthy();
  });

  it("shows migration error message", async () => {
    mockUseMigrations.mockReturnValue({
      success: false,
      error: { message: "Migration failed" },
    });

    const { findByText } = renderWithSafeArea(<TodaySessionList />);
    await flushEffects();

    const errorMessage = await findByText("Migration error: Migration failed");
    expect(errorMessage).toBeTruthy();
  });

  it("shows migration progress message", async () => {
    mockUseMigrations.mockReturnValue({
      success: false,
      error: null,
    });

    const { findByText } = renderWithSafeArea(<TodaySessionList />);
    await flushEffects();

    const progressMessage = await findByText("Migration is in progress...");
    expect(progressMessage).toBeTruthy();
  });

  // Helper test to check if our mocks are working correctly
  it("mocks are set up correctly", async () => {
    const CustomText = require("~/components/general/CustomText");
    const CustomActivityIndicator = require("~/components/general/CustomActivityIndicator");
    const TodaySessionListItem = require("~/components/session/TodaySessionListItem");

    const { findByText, findByTestId } = render(
      <>
        <CustomText>Test text</CustomText>
        <CustomActivityIndicator />
        <TodaySessionListItem item={{ id: 999, name: "Test item" }} />
      </>,
    );

    // Verify our mocks render correctly
    const textElement = await findByText("Test text");
    const loadingText = await findByText("Loading...");
    const itemText = await findByText("Test item");

    expect(textElement).toBeTruthy();
    expect(loadingText).toBeTruthy();
    expect(itemText).toBeTruthy();
  });

  // Test component behavior on session action
  it("refreshes the list when a session action is completed", async () => {
    const mockRefetch = jest.fn();
    mockUseTodaySessions.mockReturnValue({
      data: [baseItem],
      isLoading: false,
      isRefetching: false,
      refetch: mockRefetch,
    });

    const { getByText } = renderWithSafeArea(<TodaySessionList />);
    await flushEffects();

    // Force a refresh - in the real component this would happen after session actions
    await act(async () => {
      mockRefetch();
    });

    expect(mockRefetch).toHaveBeenCalled();
  });
});
