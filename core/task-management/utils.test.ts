import { describe, expect, it } from "vitest";

import {
  excludeTaskSelection,
  mergeTaskSelections,
} from "@/core/task-management/utils";

describe("task-management utilities", () => {
  describe("mergeTaskSelections", () => {
    it("should merge tasks", () => {
      const mergedTasks = mergeTaskSelections([
        { taskId: "1" },
        {
          taskId: "2",
          subtaskIds: ["1", "2"],
        },
      ]);
      expect(mergedTasks).toHaveLength(2);
      expect(mergedTasks[0]!.taskId).toBe("1");
      expect(mergedTasks[0]!.subtaskIds).toBeUndefined();
      expect(mergedTasks[1]!.taskId).toBe("2");
      expect(mergedTasks[1]!.subtaskIds).toHaveLength(2);
      expect(mergedTasks[1]!.subtaskIds![0]).toBe("1");
      expect(mergedTasks[1]!.subtaskIds![1]).toBe("2");
    });

    it("should remove duplicates", () => {
      const mergedTasks = mergeTaskSelections([
        { taskId: "1" },
        { taskId: "1" },
      ]);
      expect(mergedTasks).toHaveLength(1);
      expect(mergedTasks[0]!.taskId).toBe("1");
      expect(mergedTasks[0]!.subtaskIds).toBeUndefined();
    });

    it("should merge subtasks", () => {
      const mergedTasks = mergeTaskSelections([
        {
          taskId: "1",
          subtaskIds: ["1", "2"],
        },
        {
          taskId: "1",
          subtaskIds: ["3"],
        },
      ]);
      expect(mergedTasks).toHaveLength(1);
      expect(mergedTasks[0]!.taskId).toBe("1");
      expect(mergedTasks[0]!.subtaskIds).toHaveLength(3);
      expect(mergedTasks[0]!.subtaskIds![0]).toBe("1");
      expect(mergedTasks[0]!.subtaskIds![1]).toBe("2");
      expect(mergedTasks[0]!.subtaskIds![2]).toBe("3");
    });
    it("should remove subtasks duplicates", () => {
      const mergedTasks = mergeTaskSelections([
        {
          taskId: "1",
          subtaskIds: ["1", "2"],
        },
        {
          taskId: "1",
          subtaskIds: ["2"],
        },
      ]);
      expect(mergedTasks).toHaveLength(1);
      expect(mergedTasks[0]!.taskId).toBe("1");
      expect(mergedTasks[0]!.subtaskIds).toHaveLength(2);
      expect(mergedTasks[0]!.subtaskIds![0]).toBe("1");
      expect(mergedTasks[0]!.subtaskIds![1]).toBe("2");
    });
  });

  describe("excludeTaskSelection", () => {
    it("should exclude task", () => {
      const result = excludeTaskSelection(
        [
          { taskId: "1" },
          {
            taskId: "2",
            subtaskIds: ["1", "2"],
          },
        ],
        { taskId: "1" },
      );
      expect(result).toHaveLength(1);
      expect(result[0]!.taskId).toBe("2");
      expect(result[0]!.subtaskIds).toHaveLength(2);
      expect(result[0]!.subtaskIds![0]).toBe("1");
      expect(result[0]!.subtaskIds![1]).toBe("2");
    });

    it("should exclude subtasks", () => {
      const result = excludeTaskSelection(
        [
          { taskId: "1" },
          {
            taskId: "2",
            subtaskIds: ["1", "2"],
          },
        ],
        {
          taskId: "2",
          subtaskIds: ["2"],
        },
      );
      expect(result).toHaveLength(2);
      expect(result[0]!.taskId).toBe("1");
      expect(result[0]!.subtaskIds).toBeUndefined();
      expect(result[1]!.taskId).toBe("2");
      expect(result[1]!.subtaskIds).toHaveLength(1);
      expect(result[1]!.subtaskIds![0]).toBe("1");
    });
  });
});
