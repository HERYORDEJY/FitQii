import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DocumentPickerAsset } from "expo-document-picker";
import { sql } from "drizzle-orm";

export const sessionsSchema = sqliteTable("sessions_table", {
  id: int().primaryKey({ autoIncrement: true }),
  created_at: int("created_at", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: int("updated_at", { mode: "number" }),
  status: text({
    enum: ["pending", "completed", "cancelled", "active", "upcoming"],
  })
    .notNull()
    .default("upcoming"),
  status_at: int("status_at", { mode: "number" }),
  // step1
  name: text().notNull(),
  category: text().notNull(),
  // step2
  start_time: int("start_time", { mode: "number" }).notNull(), // text().notNull(),
  end_time: int("end_time", { mode: "number" }).notNull(), //text().notNull(),
  start_date: int("start_date", { mode: "number" }).notNull(), //text().notNull(),
  end_date: int("end_date", { mode: "number" }).notNull(), //text().notNull(),
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
