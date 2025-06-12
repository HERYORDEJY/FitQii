import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DocumentPickerAsset } from "expo-document-picker";

export const sessionsSchema = sqliteTable("sessions_table", {
  id: int().primaryKey({ autoIncrement: true }),
  // step1
  name: text().notNull(),
  category: text().notNull(),
  // step2
  start_time: text().notNull(),
  end_time: text().notNull(),
  start_date: text().notNull(),
  end_date: text().notNull(),
  timezone: text().notNull(),
  reminder: int().notNull(),
  repetition: int().notNull(),
  // step3
  mode: text().notNull(),
  link: text(),
  location: text(),
  description: text(),
  attachments: blob({ mode: "json" }).$type<Array<DocumentPickerAsset>>(),
});
