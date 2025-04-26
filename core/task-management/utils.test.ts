import { describe, expect, it } from "vitest";

import { excludeTask, mergeTasks } from "@/core/task-management/utils";

describe("task-management utilities", () => {
  describe("mergeTasks", () => {
    it("should merge tasks", () => {
      const mergedTasks = mergeTasks([
        { id: "1", title: "Task 1" },
        {
          id: "2",
          title: "Task 2",
          subtasks: [
            { id: "1", title: "Subtask 1" },
            { id: "2", title: "Subtask 2" },
          ],
        },
      ]);
      expect(mergedTasks).toHaveLength(2);
      expect(mergedTasks[0]!.id).toBe("1");
      expect(mergedTasks[0]!.subtasks).toBeUndefined();
      expect(mergedTasks[1]!.id).toBe("2");
      expect(mergedTasks[1]!.subtasks).toHaveLength(2);
      expect(mergedTasks[1]!.subtasks![0]!.id).toBe("1");
      expect(mergedTasks[1]!.subtasks![1]!.id).toBe("2");
    });

    it("should remove duplicates", () => {
      const mergedTasks = mergeTasks([
        { id: "1", title: "Task 1" },
        { id: "1", title: "Task 1" },
      ]);
      expect(mergedTasks).toHaveLength(1);
      expect(mergedTasks[0]!.id).toBe("1");
      expect(mergedTasks[0]!.subtasks).toBeUndefined();
    });

    it("should merge subtasks", () => {
      const mergedTasks = mergeTasks([
        {
          id: "1",
          title: "Task 1",
          subtasks: [
            { id: "1", title: "Subtask 1" },
            { id: "2", title: "Subtask 2" },
          ],
        },
        {
          id: "1",
          title: "Task 1",
          subtasks: [{ id: "3", title: "Subtask 3" }],
        },
      ]);
      expect(mergedTasks).toHaveLength(1);
      expect(mergedTasks[0]!.id).toBe("1");
      expect(mergedTasks[0]!.subtasks).toHaveLength(3);
      expect(mergedTasks[0]!.subtasks![0]!.id).toBe("1");
      expect(mergedTasks[0]!.subtasks![1]!.id).toBe("2");
      expect(mergedTasks[0]!.subtasks![2]!.id).toBe("3");
    });
    it("should remove subtasks duplicates", () => {
      const mergedTasks = mergeTasks([
        {
          id: "1",
          title: "Task 1",
          subtasks: [
            { id: "1", title: "Subtask 1" },
            { id: "2", title: "Subtask 2" },
          ],
        },
        {
          id: "1",
          title: "Task 1",
          subtasks: [{ id: "2", title: "Subtask 2" }],
        },
      ]);
      expect(mergedTasks).toHaveLength(1);
      expect(mergedTasks[0]!.id).toBe("1");
      expect(mergedTasks[0]!.subtasks).toHaveLength(2);
      expect(mergedTasks[0]!.subtasks![0]!.id).toBe("1");
      expect(mergedTasks[0]!.subtasks![1]!.id).toBe("2");
    });
  });

  describe("excludeTask", () => {
    it("should exclude task", () => {
      const result = excludeTask(
        [
          { id: "1", title: "Task 1" },
          {
            id: "2",
            title: "Task 2",
            subtasks: [
              { id: "1", title: "Subtask 1" },
              { id: "2", title: "Subtask 2" },
            ],
          },
        ],
        { taskId: "1" },
      );
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe("2");
      expect(result[0]!.subtasks).toHaveLength(2);
      expect(result[0]!.subtasks![0]!.id).toBe("1");
      expect(result[0]!.subtasks![1]!.id).toBe("2");
    });

    it("should exclude subtasks", () => {
      const result = excludeTask(
        [
          { id: "1", title: "Task 1" },
          {
            id: "2",
            title: "Task 2",
            subtasks: [
              { id: "1", title: "Subtask 1" },
              { id: "2", title: "Subtask 2" },
            ],
          },
        ],
        {
          taskId: "2",
          subtasks: ["2"],
        },
      );
      expect(result).toHaveLength(2);
      expect(result[0]!.id).toBe("1");
      expect(result[0]!.subtasks).toBeUndefined();
      expect(result[1]!.id).toBe("2");
      expect(result[1]!.subtasks).toHaveLength(1);
      expect(result[1]!.subtasks![0]!.id).toBe("1");
    });
  });
});
