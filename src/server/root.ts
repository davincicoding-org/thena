import { focusSessionsRouter } from "./routers/focus-session";
import { intelligenceRouter } from "./routers/intelligence";
import { projectsRouter } from "./routers/projects";
import { sprintsRouter } from "./routers/sprints";
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
  sprints: sprintsRouter,
  intelligence: intelligenceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
