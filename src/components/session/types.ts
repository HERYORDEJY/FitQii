import { DocumentPickerAsset } from "expo-document-picker";

export interface SessionItemDataType {
  attachments: Array<DocumentPickerAsset> | null;
  category: string;
  description: string | null;
  end_date: number;
  end_time: number;
  id: number;
  link: string | null;
  location: string | null;
  mode: string;
  name: string;
  reminder: number;
  repetition: number;
  start_date: number;
  start_time: number;
  timezone: string;
  status: "pending" | "completed" | "cancelled" | "active" | "upcoming";
}
