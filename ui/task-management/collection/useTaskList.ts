import type { Task, TaskInput } from "@/core/task-management";
import type {
  ActionSideEffect,
  HistoryEvent,
  HistoryHookReturn,
} from "@/ui/hooks/useHistory";
import { useHistory } from "@/ui/hooks/useHistory";

import type { TaskListAction } from "./useTaskListReducer";
import { useTaskListReducer } from "./useTaskListReducer";

export interface TaskListHookOptions {
  initialTasks?: Task[];
  onAction?: (event: HistoryEvent<TaskListAction>) => void;
}

export interface TaskListHookReturn {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;

  // Adds a task to the list with a unique id
  addTask: (task: TaskInput, sideEffect?: ActionSideEffect) => void;
  // Adds multiple tasks to the list with unique ids
  addTasks: (tasks: TaskInput[], sideEffect?: ActionSideEffect) => void;
  // Updates a task in the list
  updateTask: (
    taskId: Task["id"],
    updates: Partial<Task>,
    sideEffect?: ActionSideEffect,
  ) => void;
  // Removes a task from the list
  removeTask: (taskId: Task["id"], sideEffect?: ActionSideEffect) => void;
  // Removes multiple tasks from the list
  removeTasks: (taskIds: Task["id"][], sideEffect?: ActionSideEffect) => void;

  history: Omit<HistoryHookReturn<TaskListAction>, "push">;
}

export function useTaskList(
  options: TaskListHookOptions = {},
): TaskListHookReturn {
  const [currentTasks, dispatch] = useTaskListReducer(options.initialTasks);
  const { push: pushAction, ...history } = useHistory({
    currentState: currentTasks,
    dispatch,
    onRestoreState: (tasks) => dispatch({ type: "set", tasks }),
    onNavigated: options.onAction,
  });

  // ------- Action Handlers -------

  const setTasks: TaskListHookReturn["setTasks"] = (tasks) => {
    dispatch({ type: "set", tasks });
  };

  const addTask: TaskListHookReturn["addTask"] = (task, sideEffect) =>
    pushAction({ type: "add", task }, sideEffect);

  const addTasks: TaskListHookReturn["addTasks"] = (tasks, sideEffect) =>
    pushAction({ type: "addMany", tasks }, sideEffect);

  const updateTask: TaskListHookReturn["updateTask"] = (
    taskId,
    updates,
    sideEffect,
  ) => pushAction({ type: "update", taskId, updates }, sideEffect);

  const removeTask: TaskListHookReturn["removeTask"] = (taskId, sideEffect) =>
    pushAction({ type: "remove", taskId }, sideEffect);

  const removeTasks: TaskListHookReturn["removeTasks"] = (
    taskIds,
    sideEffect,
  ) => pushAction({ type: "removeMany", taskIds }, sideEffect);

  // ------- History -------

  return {
    tasks: currentTasks,
    setTasks,
    addTask,
    addTasks,
    updateTask,
    removeTask,
    removeTasks,
    history,
  };
}
