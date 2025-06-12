import { DocumentPickerAsset } from "expo-document-picker";

export interface SessionItemDataType {
  attachments: Array<DocumentPickerAsset> | null;
  category: string;
  description: string | null;
  end_date: string;
  end_time: string;
  id: number;
  link: string | null;
  location: string | null;
  mode: string;
  name: string;
  reminder: number;
  repetition: number;
  start_date: string;
  start_time: string;
  timezone: string;
}
