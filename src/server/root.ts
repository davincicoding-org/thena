import { focusSessionBreaksRouter } from "./routers/focus-session-breaks";
import { focusSessionsRouter } from "./routers/focus-sessions";
import { intelligenceRouter } from "./routers/intelligence";
import { projectsRouter } from "./routers/projects";
import { taskRunsRouter } from "./routers/task-runs";
import { tasksRouter } from "./routers/tasks";
import { createCallerFactory, createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tasks: tasksRouter,
  projects: projectsRouter,
  focusSessions: focusSessionsRouter,
  focusSessionBreaks: focusSessionBreaksRouter,
  taskRuns: taskRunsRouter,
  intelligence: intelligenceRouter,
});

export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
