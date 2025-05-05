import { useEffect, useReducer } from "react";
import { useLocalStorage } from "@mantine/hooks";
import superjson from "superjson";

import type { SprintPlan } from "@/core/deep-work";
import type { TaskId } from "@/core/task-management";

const LOCAL_STORAGE_KEY = "focus-session-plan";

export const useLocalFocusSessionPlan = () => {
  const [focusSessionPlan, setFocusSessionPlan] = useLocalStorage<{
    ready: boolean;
    tasks: TaskId[];
    sprints: SprintPlan[];
  }>({
    key: LOCAL_STORAGE_KEY,
    defaultValue: { tasks: [], sprints: [] },
    serialize: superjson.stringify,
    deserialize: (str) =>
      str === undefined ? { tasks: [], sprints: [] } : superjson.parse(str),
  });

  useEffect(() => {
    setFocusSessionPlan((prev) => ({
      ...prev,
      sprints: [{ id: "1", tasks: [1, 2], duration: { minutes: 25 } }],
    }));
  }, []);

  useEffect(() => {
    if (status !== undefined) return;
    if (!focusSessionPlan) return;
    if (focusSessionPlan?.sprints.flatMap(({ tasks }) => tasks).length > 0)
      return setStatus("sprint-builder");

    return setStatus("task-collector");
  }, [focusSessionPlan, status]);

  const [sprints, dispatch] = useReducer(
    (prev) => prev,
    focusSessionPlan.sprints,
  );
  return {
    status,
    setStatus,
    sprints,
    tasks: {
      ids: focusSessionPlan.tasks,
      addOne: (taskId: TaskId) =>
        setFocusSessionPlan((prev) => ({
          ...prev,
          tasks: [...prev.tasks, taskId],
        })),
      addMany: (taskIds: TaskId[]) =>
        setFocusSessionPlan((prev) => ({
          ...prev,
          tasks: [...prev.tasks, ...taskIds],
        })),
      removeOne: (taskId: TaskId) =>
        setFocusSessionPlan((prev) => ({
          ...prev,
          tasks: prev.tasks.filter((id) => id !== taskId),
        })),
      removeMany: (taskIds: TaskId[]) =>
        setFocusSessionPlan((prev) => ({
          ...prev,
          tasks: prev.tasks.filter((id) => !taskIds.includes(id)),
        })),
    },
  };
};
