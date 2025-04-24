# 6. useSessionsCoordinator

```ts
/**
 * Manages sequencing and state transitions for a list of SessionPlan objects,
 * handling session and break phases. Does not execute timers or task logic,
 * but provides:
 *  - `coordinator` with controls for current phase,
 *  - `sessions` array annotated with each plan’s status,
 *  - upcoming tasks grouped by their session,
 *  - a `pullTasks` method accepting an array of pull requests.
 */
function useSessionCoordinator(
  sessions: SessionPlan[],
  options?: {
    /** Default break duration in milliseconds */
    defaultBreakDuration?: number;
  },
): {
  coordinator:
    | {
        state: "session";
        /** The active session plan */
        session: SessionPlan;
        /** Upcoming tasks grouped by session ID */
        upcomingBySession: Array<{ sessionId: string; tasks: SessionTask[] }>;
        /**
         * Pull specified tasks or subtasks from upcoming sessions and appends them to the queue of the current session:
         * - When `subTaskId` is omitted, the entire task (with all its subtasks) is removed from the target session.
         * - When `subTaskId` is provided, only that subtask is removed from its parent task.
         * Pulled items are returned as an array of SessionTask objects with the `pulledIn` property set to true.
         * If all the subtasks are pulled from a task, the tasks will be deleted
         * Pulled subtaks should always be returned as copy of their parent task and subtaks from the same parent should always be merged
         * @param items  Array of pull requests, each specifying:
         *               - sessionId: ID of the session to pull from
         *               - taskId: ID of the task
         *               - subTaskId?: ID of a specific subtask (if pulling only that subtask)
         */
        pullTasks: (
          items: { sessionId: string; taskId: string; subTaskId?: string }[],
        ) => SessionTask[];
        /**
         * Switches to "break" state and starts the break timer.
         * @param duration Optional break duration in milliseconds
         */
        startBreak: (duration?: number) => void;
      }
    | {
        state: "break";
        /** Remaining break time in seconds */
        timeRemaining: number;
        /** Advance to the next session and switch to session state */
        startNextSession: () => void;
      }
    | {
        state: "completed";
      };

  /**
   * All session plans annotated with their status:
   * - 'completed' sessions already run
   * - 'current'   the active session
   * - 'upcoming'  sessions yet to run
   */
  sessions: Array<
    SessionPlan & { status: "completed" | "current" | "upcoming" }
  >;
};
```

# 6. `useSessionHistory`

```ts
/**
 * Provides read-only access to completed session history,
 * including duration, tasks completed, and interruptions.
 */
function useSessionHistory(): {
  sessions: CompletedSession[];
  getSessionById: (id: SessionId) => CompletedSession | undefined;
};
```

# 7. `useTaskMover`

```ts
type Container = "backlog" | "tasklist" | "session";

interface MoveOptions {
  taskIds: TaskId[];
  from: Container;
  to: Container;
  sessionId?: SessionId; // required if moving to/from session
}

/**
 * Provides utilities to move tasks between containers
 * (Backlog, TaskList, Sessions) with undo/redo support.
 */
function useTaskMover(): {
  moveTasks: (options: MoveOptions) => void;
  undo: () => void;
  redo: () => void;
};
```

# 8. `useDerivedState`

```ts
/**
 * Computes derived state such as total estimated session time,
 * session progress, and task distribution by project.
 */
function useDerivedState(): {
  getTotalEstimatedTime: (taskIds: TaskId[]) => number;
  getSessionProgress: (sessionId: SessionId) => {
    completed: number;
    total: number;
  };
  getBacklogStats: () => {
    total: number;
    byProject: Record<ProjectId, number>;
  };
};
```

# 9. `useAdapter`

```ts
interface Adapter {
  name: string;
  fetchTasks: () => Promise<TaskInput[]>;
}

/**
 * Manages external data sources via pluggable adapters.
 * Allows manual task import from registered systems into the TaskList.
 */
function useAdapter(): {
  registerAdapter: (adapter: Adapter) => void;
  importTasks: (name: string) => Promise<void>;
};
```

# 10. `useExportState`

```ts
/**
 * Exports the internal state of the library for persistence,
 * synchronization, or inspection.
 */
function useExportState(): {
  exportState: () => LibraryState;
};
```
