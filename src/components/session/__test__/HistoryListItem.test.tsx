import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import HistoryListItem from "../HistoryListItem";
import { SessionItemDataType } from "~/components/session/types";

jest.mock("~/components/session/ViewSessionSheet", () => {
  const { Text } = require("react-native");
  return () => <Text>Sheet Opened</Text>;
});
jest.mock("~/components/general/CustomText", () => {
  const { Text } = require("react-native");
  return (props: any) => <Text {...props}>{props.children}</Text>;
});

const session: SessionItemDataType = {
  id: 1,
  name: "Past Session",
  status: "completed",
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
};

const renderSafe = (ui: React.ReactElement) => render(<>{ui}</>);

describe("HistoryListItem", () => {
  it("renders session data and opens sheet on press", () => {
    const onSelectedItem = jest.fn();
    const { getByText } = renderSafe(
      <HistoryListItem item={session} onSelectedItem={onSelectedItem} />,
    );

    fireEvent.press(getByText("Past Session"));
    expect(onSelectedItem).toHaveBeenCalledWith(session);
    expect(getByText("Sheet Opened")).toBeTruthy();
  });
});
