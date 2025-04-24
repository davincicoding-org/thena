// import { useCallback, useMemo } from "react";

// import { BacklogTask, Task } from "@/core/task-management";

// import { useBacklogStore } from "./useBacklogStore";

// export interface BacklogHookReturn {
//   loading: boolean;
//   tasks: BacklogTask[];
//   addTask: (tag: TaskInput, callback?: (tag: Task) => void) => void;
//   updateTask: (tagId: Task["id"], updates: Partial<Omit<Task, "id">>) => void;
//   deleteTask: (tagId: Task["id"]) => void;
// }

// /**
//  * Manages stored tags.
//  */

// export function useBacklog(): BacklogHookReturn {
//   const store = useBacklogStore();

//   const tags = useMemo(
//     () =>
//       Object.entries(tagsStore.pool).map(([id, tag]) => ({
//         id,
//         ...tag,
//       })),
//     [tagsStore.pool],
//   );

//   const createTask = useCallback<TasksHookReturn["createTask"]>(
//     (input, callback) => {
//       tagsStore.addTask(input, async (tag) => {
//         if (callback) callback?.(tag);
//         // TODO store tag in backend
//       });
//     },
//     [],
//   );

//   const updateTask = useCallback<TasksHookReturn["updateTask"]>(
//     (tagId, updates) => {
//       tagsStore.updateTask(tagId, updates, (tag) => {
//         // TODO update in backend
//       });
//     },
//     [],
//   );

//   const deleteTask = useCallback<TasksHookReturn["deleteTask"]>((tagId) => {
//     tagsStore.removeTask(tagId);
//     // TODO delete in backend
//   }, []);

//   return {
//     loading: !tagsStore.ready,
//     tags,
//     createTask,
//     updateTask,
//     deleteTask,
//   };
// }
