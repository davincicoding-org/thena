# 4. `useSessionPlanner`

```ts
interface SessionPlan {
  id: string
  duration: number
  tasks: Task[]
}

/**
 * Provides in-memory session planning: initialize sessions, adjust durations, and assign, move, and reorder tasks. Dropping a session returns its tasks to the unassigned pool.
 */
function useSessionPlanner(options?: {
  /** Default duration for new sessions */
  defaultDuration?: number
  /** Initial tasks to populate the unassigned pool */
  initialTasks?: Omit<Task, 'id'>[]
}): {
  /** Tasks not yet assigned to any session */
  unassignedTasks: Task[]

  /** All current session plans */
  sessions: SessionPlan[]

  /** Initialize `count` empty sessions */
  initialize: (count: number) => void

  /** Add a new empty session, using optional duration */
  addSession: (duration?: number) => SessionPlan

  /** Update only the duration of a session */
  updateSession: (id: string, updates: Pick<SessionPlan, 'duration'>>) => void

  /** Assign one of the unassigned tasks into a session */
  assignTask: (options: { sessionId: string; taskId: string }) => void

  /** Add more tasks into the unassigned pool */
  addTasks: (tasks: Omit<Task, 'id'>[]) => void

  /** Move tasks between two sessions */
  moveTasks: (options: {
    fromSessionId: string
    toSessionId: string
    taskIds: string[]
  }) => void

  /** Reorder sessions (for drag‑and‑drop UIs) */
  reorderSessions: (sessionIds: string[]) => void

  /** Reorder tasks within a session (for drag‑and‑drop UIs) */
  reorderSessionTasks: (sessionId: string, taskIds: string[]) => void

  /** Delete a session and return its tasks to the unassigned pool */
  dropSession: (sessionId: string) => void
}
```

# 5. `useSession`

```ts
interface Subtask extends Task {
  skipped?: boolean;
  completedAt?: number;
  /** Subtask was pulled into the session mid‑run */
  pulledIn?: boolean;
}

interface SessionTask extends Task {
  skipped?: boolean;
  /** Task was pulled into the session mid‑run */
  pulledIn?: boolean;
  subtasks?: Subtask[];
}

/**
 * Runs a single session plan, managing timer, state, queue, and event logs.
 * Tasks with subtasks execute only their subtasks; parent tasks can only be skipped.
 */
function useSession(
  session: SessionPlan,
  options?: {
    onStart?: () => void;
    onPause?: () => void;
    onResume?: () => void;
    /** Called when the session completes, receiving the final queue */
    onComplete?: (queue: SessionTask[]) => void;
    /** Called when the queue runs out of tasks */
    onRanOut?: () => void;
  },
): {
  /** ‘idle’ before start, then ‘running’, ‘paused’, and ‘completed’ */
  state: "idle" | "running" | "paused" | "completed";
  /** Whether all tasks/subtasks have been processed before the timer ran out */
  ranOutOfTasks: boolean;
  /** Remaining time in seconds. */
  timeRemaining: number;
  /**
   * The currently active item, by taskId and optional subTaskId
   * (for subtasks)
   */
  currentTask: { taskId: string; subTaskId?: string } | null;
  /** Full queue of tasks (with nested subtasks), each flagged if pulled in */
  queue: SessionTask[];
  /** Chronological log of session events */
  logs: {
    event: "start" | "pause" | "resume" | "complete" | "ranOut";
    timestamp: number;
  }[];

  start: () => void;
  pause: () => void;
  resume: () => void;
  complete: () => void;

  /** Mark the specified item as completed and advance */
  completeTask: (current: { taskId: string; subTaskId?: string }) => void;
  /** Mark the specified item as skipped and advance */
  skipTask: (current: { taskId: string; subTaskId?: string }) => void;

  /** Request more items when the queue runs dry */
  requestMoreTasks: () => void;
  /** Pull specific tasks into the queue mid‑run */
  pullInTasks: (tasks: Omit<Task, "id">[]) => void;
};
```

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
