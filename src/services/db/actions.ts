import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { sessionsDbService } from "~/services/db/sessions";
import { SessionItemDataType } from "~/components/session/types";
import { SessionInsertData, SessionUpdateData } from "~/services/db/types";
import { errorLogOnDev } from "~/utils/log-helpers";

// Query Keys - Centralized key management
export const sessionQueryKeys = {
  all: ["sessions"] as const,
  lists: () => [...sessionQueryKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...sessionQueryKeys.lists(), { filters }] as const,
  details: () => [...sessionQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...sessionQueryKeys.details(), id] as const,
  today: () => [...sessionQueryKeys.all, "today"] as const,
  week: () => [...sessionQueryKeys.all, "week"] as const,
  past: () => [...sessionQueryKeys.all, "past"] as const,
  byDate: (date: string) => [...sessionQueryKeys.all, "byDate", date] as const,
  dateRange: (start: string, end: string) =>
    [...sessionQueryKeys.all, "dateRange", start, end] as const,
  count: () => [...sessionQueryKeys.all, "count"] as const,
};

// ====================
// QUERY HOOKS
// ====================

/**
 * Get all sessions
 */
export const useAllSessions = (
  options?: Omit<
    UseQueryOptions<Array<SessionItemDataType>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    // @ts-ignore
    queryKey: sessionQueryKeys.lists(),
    queryFn: async () => {
      return await sessionsDbService.getAllSessions();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    ...options,
  });
};

/**
 * Get session by ID
 */
export const useSessionById = (
  sessionId: number,
  options?: Omit<
    UseQueryOptions<SessionItemDataType | null, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    // @ts-ignore
    queryKey: sessionQueryKeys.detail(sessionId),
    queryFn: async () => {
      if (!sessionId || sessionId <= 0) return null;
      return await sessionsDbService.getSessionById(sessionId);
    },
    enabled: !!sessionId && sessionId > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Get today's sessions
 */
export const useTodaySessions = (
  options?: Omit<
    UseQueryOptions<Array<SessionItemDataType>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    // @ts-ignore
    queryKey: sessionQueryKeys.today(),
    queryFn: async () => {
      return await sessionsDbService.getTodaySessions();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for today)
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
    ...options,
  });
};

/**
 * Get week's sessions
 */
export const useWeeksSessions = (
  options?: Omit<
    UseQueryOptions<Array<SessionItemDataType>, Error>,
    "queryFn"
  > & { searchQuery?: string; referenceDate?: Date; week?: number },
  searchQuery?: string,
) => {
  return useQuery({
    // @ts-ignore
    queryKey: [
      ...sessionQueryKeys.week(),
      {
        searchQuery: options?.searchQuery,
        week: options?.week,
        referenceDate: options?.referenceDate,
      },
    ],
    // @ts-ignore
    queryFn: async () => {
      return await sessionsDbService.getWeekSessions({
        searchQuery: options?.searchQuery,
        referenceDate: new Date(),
        week: options?.week,
      });
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for today)
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
    ...options,
  });
};

/**
 * Get past sessions
 */
export const usePastSessions = (
  options?: Omit<
    UseQueryOptions<Array<SessionItemDataType>, Error>,
    "queryFn"
  > & { searchQuery?: string },
  searchQuery?: string,
) => {
  return useQuery({
    // @ts-ignore
    queryKey: [
      ...sessionQueryKeys.past(),
      {
        searchQuery: options?.searchQuery,
      },
    ],
    // @ts-ignore
    queryFn: async () => {
      return await sessionsDbService.getPastSessions(options?.searchQuery);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for today)
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
    ...options,
  });
};

/**
 * Get sessions by specific date
 */
export const useSessionsByDate = (
  date: Date,
  options?: Omit<
    UseQueryOptions<Array<SessionItemDataType>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD format

  return useQuery({
    // @ts-ignore
    queryKey: sessionQueryKeys.byDate(dateString),
    queryFn: async () => {
      return await sessionsDbService.getSessionsByDate(date);
    },
    enabled: !!date,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Get sessions in date range
 */
export const useSessionsInRange = (
  startDate: Date,
  endDate: Date,
  options?: Omit<
    UseQueryOptions<Array<SessionItemDataType>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const startString = startDate.toISOString().split("T")[0];
  const endString = endDate.toISOString().split("T")[0];

  return useQuery({
    // @ts-ignore
    queryKey: sessionQueryKeys.dateRange(startString, endString),
    queryFn: async () => {
      return await sessionsDbService.getSessionsInRange(startDate, endDate);
    },
    enabled: !!startDate && !!endDate && startDate <= endDate,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Get session count
 */
export const useSessionCount = (
  options?: Omit<UseQueryOptions<number, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    // @ts-ignore
    queryKey: sessionQueryKeys.count(),
    queryFn: async () => {
      return await sessionsDbService.getSessionCount();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
    ...options,
  });
};

// ====================
// MUTATION HOOKS
// ====================

/**
 * Create new session
 */
export const useCreateSession = (
  options?: UseMutationOptions<SessionItemDataType, Error, SessionInsertData>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionData: SessionInsertData) => {
      return await sessionsDbService.insertSession(sessionData);
    },
    onSuccess: (newSession) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.all });

      // Optionally add the new session to existing cache
      queryClient.setQueryData(
        sessionQueryKeys.detail(newSession.id!),
        newSession,
      );
    },
    onError: (error) => {
      errorLogOnDev("Failed to create session:", error);
    },
    ...options,
  });
};

/**
 * Update existing session
 */
export const useUpdateSession = (
  options?: UseMutationOptions<
    SessionItemDataType | null,
    Error,
    { id: number; data: SessionUpdateData }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: SessionUpdateData;
    }) => {
      return await sessionsDbService.updateSession(id, data);
    },
    onSuccess: (updatedSession, { id }) => {
      if (updatedSession) {
        // Update the specific session cache
        queryClient.setQueryData(sessionQueryKeys.detail(id), updatedSession);
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.today() });
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.count() });
    },
    onError: (error) => {
      errorLogOnDev("Failed to update session:", error);
    },
    ...options,
  });
};

/**
 * Delete session
 */
export const useDeleteSession = (
  options?: UseMutationOptions<boolean, Error, number>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: number) => {
      return await sessionsDbService.deleteSession(sessionId);
    },
    onSuccess: (_, sessionId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: sessionQueryKeys.detail(sessionId),
      });

      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.today() });
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.count() });
    },
    onError: (error) => {
      errorLogOnDev("Failed to delete session:", error);
    },
    ...options,
  });
};

// ====================
// OPTIMISTIC UPDATE HOOKS
// ====================

/**
 * Update session with optimistic updates
 */
export const useOptimisticUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: SessionUpdateData;
    }) => {
      return await sessionsDbService.updateSession(id, data);
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: sessionQueryKeys.detail(id),
      });

      // Snapshot previous value
      const previousSession = queryClient.getQueryData<SessionItemDataType>(
        sessionQueryKeys.detail(id),
      );

      // Optimistically update
      if (previousSession) {
        queryClient.setQueryData(sessionQueryKeys.detail(id), {
          ...previousSession,
          ...data,
        });
      }

      return { previousSession };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousSession) {
        queryClient.setQueryData(
          sessionQueryKeys.detail(id),
          context.previousSession,
        );
      }
    },
    onSettled: (_, __, { id }) => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: sessionQueryKeys.detail(id) });
    },
  });
};

// ====================
// UTILITY HOOKS
// ====================

/**
 * Prefetch session data
 */
export const usePrefetchSession = () => {
  const queryClient = useQueryClient();

  const prefetchSession = async (sessionId: number) => {
    await queryClient.prefetchQuery({
      queryKey: sessionQueryKeys.detail(sessionId),
      queryFn: () => sessionsDbService.getSessionById(sessionId),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchTodaySessions = async () => {
    await queryClient.prefetchQuery({
      queryKey: sessionQueryKeys.today(),
      queryFn: () => sessionsDbService.getTodaySessions(),
      staleTime: 2 * 60 * 1000,
    });
  };

  return {
    prefetchSession,
    prefetchTodaySessions,
  };
};
