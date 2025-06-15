import { SessionItemDataType } from "~/components/session/types";

export type SessionItemParamsDataType = Partial<
  Omit<SessionItemDataType, "id">
>;

export type SessionInsertData = Omit<SessionItemDataType, "id">;
export type SessionUpdateData = Partial<Omit<SessionItemDataType, "id">>;
