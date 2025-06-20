import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import ViewSessionSheet from "../ViewSessionSheet";
import { Linking } from "react-native";
import { SessionItemDataType } from "~/components/session/types";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

jest.mock("~/services/db/actions", () => ({
  useDeleteSession: jest.fn(() => ({ mutateAsync: jest.fn(), status: "idle" })),
  useUpdateSession: jest.fn(() => ({ mutateAsync: jest.fn(), status: "idle" })),
}));

jest.mock("sonner-native", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("~/components/general/CustomText", () => {
  const { Text } = require("react-native");
  return (props: any) => <Text {...props}>{props.children}</Text>;
});

jest.mock("~/components/general/CustomActivityIndicator", () => {
  const { Text } = require("react-native");
  return () => <Text>Loading...</Text>;
});

jest.mock("~/components/general/CustomActionSheet", () => ({
  Container: (props: any) => <>{props.children}</>,
}));

jest.spyOn(Linking, "openURL").mockImplementation(async () => {});

const session: SessionItemDataType = {
  id: 1,
  name: "Session X",
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
};

describe("ViewSessionSheet", () => {
  it("renders session details correctly", () => {
    const { getByText } = render(
      <ViewSessionSheet sessionData={session} sheetRef={{ current: null }} />,
    );
    expect(getByText("Session X")).toBeTruthy();
    expect(getByText("🧭 upcoming")).toBeTruthy();
    expect(getByText("A deep work session")).toBeTruthy();
  });

  it("calls Linking.openURL for link and location", async () => {
    const { getByText } = render(
      <ViewSessionSheet sessionData={session} sheetRef={{ current: null }} />,
    );
    fireEvent.press(getByText(session.link!));
    fireEvent.press(getByText(session.location!));
    expect(Linking.openURL).toHaveBeenCalledWith(session.link);
    expect(Linking.openURL).toHaveBeenCalledWith(session.location);
  });

  it("calls router.push on Edit", () => {
    const { getByText } = render(
      <ViewSessionSheet
        sessionData={session}
        //@ts-ignore
        sheetRef={{ current: { hide: jest.fn() } }}
      />,
    );
    fireEvent.press(getByText("Edit"));
    expect(require("expo-router").router.push).toHaveBeenCalled();
  });
});
