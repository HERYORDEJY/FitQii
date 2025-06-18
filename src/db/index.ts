import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

const sessionsSqlite = SQLite?.openDatabaseSync("sessions.db");

export const sessionsDb = drizzle(sessionsSqlite);
