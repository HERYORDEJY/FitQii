export interface SessionItemDataType {
  attachments: string | null;
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
  status_at: number | null;
}
