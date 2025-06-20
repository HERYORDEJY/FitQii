import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { differenceInMinutes, format } from "date-fns";
import { SessionItemDataType } from "~/components/session/types";
import SessionsListItem from "~/components/session/SessionsListItem";
import { convertMinutesToHourMinute } from "~/utils/date-helpers";

jest.mock("~/services/db/actions", () => ({
  useDeleteSession: jest.fn(() => ({
    mutateAsync: jest.fn(),
    status: "idle",
  })),
  useUpdateSession: jest.fn(() => ({
    mutateAsync: jest.fn(),
    status: "idle",
  })),
}));

jest.mock("~/components/general/CustomActivityIndicator", () => {
  const { Text } = require("react-native");
  return ({ children, ...props }: any) => (
    <Text testID="activity-indicator" {...props}>
      Loading...
    </Text>
  );
});

jest.mock("~/components/session/ViewSessionSheet", () => {
  const { View } = require("react-native");
  return ({ children, ...props }: any) => (
    <View testID="view-session-sheet" {...props}>
      {children}
    </View>
  );
});

// Sample session data
const session: SessionItemDataType = {
  id: 1,
  name: "Deep Work",
  description: "Focus time",
  start_time: Date.now(),
  end_time: Date.now() + 60 * 60 * 1000,
  attachments: null,
  category: "focus",
  end_date: Date.now(),
  link: null,
  location: null,
  mode: "online",
  reminder: 0,
  repetition: 0,
  start_date: Date.now(),
  timezone: "UTC",
  status: "upcoming",
  status_at: null,
};

describe("SessionsListItem", () => {
  it("renders session name and status icon", () => {
    const { getByText, getByTestId } = render(
      <SessionsListItem item={session} />,
    );
    screen.debug();
    expect(getByText("Deep Work")).toBeTruthy();
  });

  it("calls onSelectedItem when tapped", () => {
    const mockFn = jest.fn();
    const { getByText } = render(
      <SessionsListItem item={session} onSelectedItem={mockFn} />,
    );
    fireEvent.press(getByText("Deep Work"));
    expect(mockFn).toHaveBeenCalledWith(session);
  });

  it("renders formatted start and end times", () => {
    const minutesToHourMinutes = convertMinutesToHourMinute(
      differenceInMinutes(
        new Date(session.end_time),
        new Date(session.start_time),
      ),
    );

    const { getByText } = render(<SessionsListItem item={session} />);
    expect(getByText(format(session.start_time, "hh:mm a"))).toBeTruthy();
    expect(
      getByText(
        `${minutesToHourMinutes?.hours} hr ${minutesToHourMinutes?.minutes} min`,
      ),
    ).toBeTruthy();
  });

  it("shows loading indicator when mutation is in progress", () => {
    const useUpdateSession = require("~/services/db/actions").useUpdateSession;
    const useDeleteSession = require("~/services/db/actions").useDeleteSession;

    useUpdateSession.mockReturnValue({
      mutateAsync: jest.fn(),
      status: "loading",
    });
    useDeleteSession.mockReturnValue({
      mutateAsync: jest.fn(),
      status: "idle",
    });

    const { getByText } = render(<SessionsListItem item={session} />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("calls toast on successful delete", async () => {
    const { toast } = require("sonner-native");
    const deleteMock = jest.fn().mockResolvedValueOnce(undefined);

    const useDeleteSession = require("~/services/db/actions").useDeleteSession;
    useDeleteSession.mockReturnValue({
      mutateAsync: deleteMock,
      status: "idle",
    });

    render(<SessionsListItem item={session} />);

    await deleteMock();

    toast.success("Session deleted successfully.");
    expect(toast.success).toHaveBeenCalledWith("Session deleted successfully.");
  });

  it("calls toast.error on failed delete", async () => {
    const { toast } = require("sonner-native");
    const useDeleteSession = require("~/services/db/actions").useDeleteSession;
    // Simulate the hook returning a function that will reject when called
    const deleteMock = jest.fn().mockRejectedValueOnce(new Error("fail"));
    useDeleteSession.mockReturnValue({
      mutateAsync: deleteMock,
      status: "idle",
    });

    render(<SessionsListItem item={session} />);

    await deleteMock().catch(() => {});

    toast.error("Unable to delete session.");
    expect(toast.error).toHaveBeenCalledWith("Unable to delete session.");
  });
});
