import { sessionsDb } from "~/db";
import { sessionsSchema } from "~/db/schema";
import { SessionItemDataType } from "~/components/session/types";
import { and, desc, eq, gte, like, lte } from "drizzle-orm";
import { errorLogOnDev, logOnDev } from "~/utils/log-helpers";
import {
  getDatesFromReferenceTillNowModern,
  getWeekDates,
} from "~/utils/date-helpers";

class SessionDatabaseService {
  private db: typeof sessionsDb;
  private schema: any;

  constructor(database: typeof sessionsDb, schema: any) {
    if (!database) {
      throw new Error("Database instance is required");
    }
    if (!schema) {
      throw new Error("Schema is required");
    }

    this.db = database;
    this.schema = schema;

    this.diagnoseDateStorage();
  }

  /**
   * Get all sessions
   */
  async getAllSessions(): Promise<Array<SessionItemDataType>> {
    try {
      return (await this.db
        .select()
        .from(this.schema)
        .orderBy(desc(this.schema.start_date))) as Array<SessionItemDataType>;
    } catch (error) {
      errorLogOnDev("Error fetching all sessions:", error);
      throw new Error("Failed to fetch sessions");
    }
  }

  /**
   * Get first sessions in databse
   */
  async getFirstSessionsInDb(): Promise<SessionItemDataType> {
    try {
      return (
        (await this.db
          .select()
          .from(this.schema)
          .limit(1)) as Array<SessionItemDataType>
      )[0];
    } catch (error) {
      errorLogOnDev("Error fetching all sessions:", error);
      throw new Error("Failed to fetch sessions");
    }
  }

  /**
   * Get session by ID
   */
  async getSessionById(sessionId: number): Promise<SessionItemDataType | null> {
    try {
      if (!sessionId || sessionId <= 0) {
        throw new Error("Valid session ID is required");
      }

      const result = (await this.db
        .select()
        .from(this.schema)
        .where(eq(this.schema.id, sessionId))
        .limit(1)) as Array<SessionItemDataType>;

      return result[0] || null;
    } catch (error) {
      errorLogOnDev(`Error fetching session ${sessionId}:`, error);
      throw new Error(`Failed to fetch session with ID ${sessionId}`);
    }
  }

  /**
   * Insert new session
   */
  async insertSession(
    sessionData: Omit<SessionItemDataType, "id">,
  ): Promise<SessionItemDataType> {
    try {
      if (!sessionData.start_date || !sessionData.end_date) {
        throw new Error("Start date and end date are required");
      }

      const result = (await this.db
        .insert(this.schema)
        .values({
          ...sessionData,
          start_date: new Date(sessionData.start_date).getTime(),
          end_date: new Date(sessionData.end_date).getTime(),
          start_time: new Date(sessionData.start_time).getTime(),
          end_time: new Date(sessionData.end_time).getTime(),
        })
        .returning()) as Array<SessionItemDataType>;

      return result[0];
    } catch (error) {
      errorLogOnDev("Error inserting session:", error);
      throw new Error("Failed to create session");
    }
  }

  /**
   * Update existing session
   */
  async updateSession(
    sessionId: number,
    sessionData: Partial<Omit<SessionItemDataType, "id">>,
  ): Promise<SessionItemDataType | null> {
    try {
      if (!sessionId || sessionId <= 0) {
        throw new Error("Valid session ID is required");
      }

      // Check if session exists
      const existingSession = await this.getSessionById(sessionId);
      if (!existingSession) {
        throw new Error(`Session with ID ${sessionId} not found`);
      }

      // Prepare update data
      const updateData: any = {
        ...sessionData,
        start_date: new Date(sessionData.start_date!).getTime(),
        end_date: new Date(sessionData.end_date!).getTime(),
        start_time: new Date(sessionData.start_time!).getTime(),
        end_time: new Date(sessionData.end_time!).getTime(),
        updated_at: new Date().getTime(),
      };

      const result = (await this.db
        .update(this.schema)
        .set(updateData)
        .where(eq(this.schema.id, sessionId))
        .returning()) as Array<SessionItemDataType>;

      return result[0] || null;
    } catch (error) {
      errorLogOnDev(`Error updating session ${sessionId}:`, error);
      throw new Error(`Failed to update session with ID ${sessionId}`);
    }
  }

  /**
   * Delete session
   */
  async deleteSession(sessionId: number): Promise<boolean> {
    try {
      if (!sessionId || sessionId <= 0) {
        throw new Error("Valid session ID is required");
      }

      // Check if session exists
      const existingSession = await this.getSessionById(sessionId);
      if (!existingSession) {
        throw new Error(`Session with ID ${sessionId} not found`);
      }

      await this.db.delete(this.schema).where(eq(this.schema.id, sessionId));

      return true;
    } catch (error) {
      errorLogOnDev(`Error deleting session ${sessionId}:`, error);
      throw new Error(`Failed to delete session with ID ${sessionId}`);
    }
  }

  /**
   * Get today's sessions using database-level filtering
   */
  async getTodaySessions(): Promise<Array<SessionItemDataType>> {
    try {
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0,
      ).getTime();

      const todayEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      ).getTime();

      return (await this.db
        .select()
        .from(this.schema)
        .where(
          and(
            lte(this.schema.start_date, todayEnd),
            gte(this.schema.end_date, todayStart),
          ),
        )
        .orderBy(this.schema.start_date)) as Array<SessionItemDataType>;
    } catch (error) {
      errorLogOnDev("Error fetching today's sessions:", error);
      throw new Error("Failed to fetch today's sessions");
    }
  }

  /**
   * Get week's sessions using database-level filtering
   * and grouped for section-list
   */
  async getWeekSessions({
    searchQuery,
    referenceDate = new Date(),
    week,
  }: {
    searchQuery?: string;
    referenceDate?: Date;
    week?: number;
  }): Promise<Array<{ title: Date; data: Array<SessionItemDataType> }>> {
    try {
      const result: Array<{ title: Date; data: Array<SessionItemDataType> }> =
        [];
      const { weekDates } = getWeekDates(referenceDate);
      for (const date of weekDates) {
        const title = new Date(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            0,
            0,
            0,
            0,
          ),
        );
        // const data = [];
        const now = new Date(date),
          nowStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0,
            0,
            0,
            0,
          ).getTime(),
          nowEnd = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59,
            999,
          ).getTime();
        const wildcardSearchQuery = `%${searchQuery?.toLowerCase()}%`;
        const data = (await this.db
          .select()
          .from(this.schema)
          .where(
            and(
              lte(this.schema.start_date, nowEnd),
              gte(this.schema.end_date, nowStart),
              like(this.schema.name, wildcardSearchQuery),
            ),
          )) as Array<SessionItemDataType>;

        result.push({ title, data });
      }

      return result;
    } catch (error) {
      errorLogOnDev("Error fetching week's sessions:", error);
      throw new Error("Failed to fetch week's sessions");
    }
  }

  /**
   * Get pas sessions using database-level filtering,
   * i.e. sessions that occurred in the past
   * and grouped for section-list
   */
  async getPastSessions(
    searchQuery?: string,
  ): Promise<Array<{ title: Date; data: Array<SessionItemDataType> }>> {
    try {
      const firstSessionInDb = await this.getFirstSessionsInDb();
      const result: Array<{ title: Date; data: Array<SessionItemDataType> }> =
        [];
      const { weekDates } = getWeekDates();
      const datesFromReferenceTillNowModern =
        getDatesFromReferenceTillNowModern(
          new Date(firstSessionInDb.start_date),
        );

      for (const date of datesFromReferenceTillNowModern) {
        const title = new Date(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            0,
            0,
            0,
            0,
          ),
        );
        // const data = [];
        const now = new Date(date),
          nowStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0,
            0,
            0,
            0,
          ).getTime(),
          nowEnd = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59,
            999,
          ).getTime();
        const wildcardSearchQuery = `%${searchQuery?.toLowerCase()}%`;
        const data = (await this.db
          .select()
          .from(this.schema)
          .where(
            and(
              lte(this.schema.start_date, nowEnd),
              gte(this.schema.end_date, nowStart),
              like(this.schema.name, wildcardSearchQuery),
            ),
          )) as Array<SessionItemDataType>;

        result.push({ title, data });
      }

      return result;
    } catch (error) {
      errorLogOnDev("Error fetching week's sessions:", error);
      throw new Error("Failed to fetch week's sessions");
    }
  }

  /**
   * Get sessions within a date range
   */
  async getSessionsInRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Array<SessionItemDataType>> {
    try {
      if (!startDate || !endDate) {
        throw new Error("Start date and end date are required");
      }

      if (startDate > endDate) {
        throw new Error("Start date cannot be after end date");
      }

      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      return (await this.db
        .select()
        .from(this.schema)
        .where(
          and(
            lte(this.schema.start_date, end),
            gte(this.schema.end_date, start),
          ),
        )
        .orderBy(this.schema.start_date)) as Array<SessionItemDataType>;
    } catch (error) {
      errorLogOnDev("Error fetching sessions in range:", error);
      throw new Error("Failed to fetch sessions in date range");
    }
  }

  /**
   * Get sessions by date (specific day)
   */
  async getSessionsByDate(date: Date): Promise<Array<SessionItemDataType>> {
    try {
      if (!date) {
        throw new Error("Date is required");
      }

      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
        0,
      ).getTime();

      const dayEnd = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999,
      ).getTime();

      return (await this.db
        .select()
        .from(this.schema)
        .where(
          and(
            lte(this.schema.start_date, dayEnd),
            gte(this.schema.end_date, dayStart),
          ),
        )
        .orderBy(this.schema.start_date)) as Array<SessionItemDataType>;
    } catch (error) {
      errorLogOnDev("Error fetching sessions by date:", error);
      throw new Error("Failed to fetch sessions for the specified date");
    }
  }

  /**
   * Count total sessions
   */
  async getSessionCount(): Promise<number> {
    try {
      const result = await this.db
        .select({ count: this.schema.id })
        .from(this.schema);

      return result.length;
    } catch (error) {
      errorLogOnDev("Error counting sessions:", error);
      throw new Error("Failed to count sessions");
    }
  }

  /**
   * Check if database connection is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.db.select().from(this.schema).limit(1);
      return true;
    } catch (error) {
      errorLogOnDev("Database health check failed:", error);
      return false;
    }
  }

  /**
   * Diagnostic method to understand date storage format
   * Call this method to see how your dates are actually stored
   */
  async diagnoseDateStorage(): Promise<void> {
    try {
      const samples = await this.db.select().from(this.schema).limit(3);

      logOnDev("=== DATE STORAGE DIAGNOSIS ===");
      logOnDev(`Found ${samples.length} sample sessions`);

      samples.forEach((session, index) => {
        logOnDev(`\n--- Session ${index + 1} ---`);
        logOnDev("start_date value:", session.start_date);
        logOnDev("start_date type:", typeof session.start_date);
        logOnDev("end_date value:", session.end_date);
        logOnDev("end_date type:", typeof session.end_date);

        // Try parsing as different formats
        if (typeof session.start_date === "string") {
          logOnDev("Parsed as Date:", new Date(session.start_date));
        } else if (typeof session.start_date === "number") {
          logOnDev(
            "As seconds timestamp:",
            new Date(session.start_date * 1000),
          );
          logOnDev("As milliseconds timestamp:", new Date(session.start_date));
        }
      });

      logOnDev("=== CURRENT DATE COMPARISONS ===");
      const now = new Date();
      logOnDev("Current Date:", now);
      logOnDev("ISO String:", now.toISOString());
      logOnDev("Unix Timestamp (seconds):", Math.floor(now.getTime() / 1000));
      logOnDev("Unix Timestamp (ms):", now.getTime());
      logOnDev("=== END DIAGNOSIS ===");
    } catch (error) {
      errorLogOnDev("Error during date diagnosis:", error);
    }
  }
}

// Factory function to create service instance
export const createSessionDatabaseService = (
  database: typeof sessionsDb,
  schema: any,
): SessionDatabaseService => {
  return new SessionDatabaseService(database, schema);
};

// Usage example:
export const sessionsDbService = createSessionDatabaseService(
  sessionsDb,
  sessionsSchema,
);
