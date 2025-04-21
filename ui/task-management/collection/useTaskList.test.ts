import { act, renderHook } from "@testing-library/react";
import { nanoid } from "nanoid";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTaskList } from "./useTaskList";

// Mock nanoid to get predictable IDs in tests
vi.mock("nanoid", () => ({
  nanoid: vi.fn().mockReturnValue("test-id"),
}));

describe("useTaskList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(nanoid).mockReset();
    // Set default mock return value to ensure consistency
    vi.mocked(nanoid).mockReturnValue("test-id");
  });

  it("should initialize with empty tasks array", () => {
    const { result } = renderHook(() => useTaskList());
    expect(result.current.tasks).toEqual([]);
  });

  describe("task operations", () => {
    it("should add a task", () => {
      const { result } = renderHook(() => useTaskList());

      act(() => {
        result.current.addTask({ title: "Test Task" });
      });

      expect(result.current.tasks).toEqual([
        { id: "test-id", title: "Test Task" },
      ]);
    });

    it("should add multiple tasks", () => {
      const { result } = renderHook(() => useTaskList());
      const tasks = [{ title: "Task 1" }, { title: "Task 2" }];

      // Set up sequential IDs
      vi.mocked(nanoid)
        .mockReturnValueOnce("test-id-1")
        .mockReturnValueOnce("test-id-2");

      act(() => {
        result.current.addTasks(tasks);
      });

      expect(result.current.tasks).toEqual([
        { id: "test-id-1", title: "Task 1" },
        { id: "test-id-2", title: "Task 2" },
      ]);
    });

    it("should update a task", () => {
      const { result } = renderHook(() => useTaskList());

      act(() => {
        result.current.addTask({ title: "Test Task" });
      });

      act(() => {
        result.current.updateTask("test-id", { title: "Updated Task" });
      });

      expect(result.current.tasks).toEqual([
        { id: "test-id", title: "Updated Task" },
      ]);
    });

    it("should remove a task", () => {
      const { result } = renderHook(() => useTaskList());

      // First task creation
      vi.mocked(nanoid).mockReturnValueOnce("test-id-1");
      act(() => {
        result.current.addTask({ title: "Task 1" });
      });

      // Second task creation
      vi.mocked(nanoid).mockReturnValueOnce("test-id-2");
      act(() => {
        result.current.addTask({ title: "Task 2" });
      });

      // Verify we have two tasks before removing
      expect(result.current.tasks).toHaveLength(2);
      const firstTask = result.current.tasks[0];
      const secondTask = result.current.tasks[1];
      if (firstTask && secondTask) {
        expect(firstTask.id).toBe("test-id-1");
        expect(secondTask.id).toBe("test-id-2");
      }

      // Remove the first task
      act(() => {
        result.current.removeTask("test-id-1");
      });

      // Now we should have just one task (the second one) left
      expect(result.current.tasks).toHaveLength(1);
      const remainingTask = result.current.tasks[0];
      if (remainingTask) {
        expect(remainingTask.id).toBe("test-id-2");
      }
    });

    it("should remove multiple tasks", () => {
      const { result } = renderHook(() => useTaskList());

      // First task creation
      vi.mocked(nanoid).mockReturnValueOnce("test-id-1");
      act(() => {
        result.current.addTask({ title: "Task 1" });
      });

      // Second task creation
      vi.mocked(nanoid).mockReturnValueOnce("test-id-2");
      act(() => {
        result.current.addTask({ title: "Task 2" });
      });

      // Third task creation
      vi.mocked(nanoid).mockReturnValueOnce("test-id-3");
      act(() => {
        result.current.addTask({ title: "Task 3" });
      });

      // Verify we have three tasks before removing
      expect(result.current.tasks).toHaveLength(3);

      // Remove first and third tasks
      act(() => {
        result.current.removeTasks(["test-id-1", "test-id-3"]);
      });

      // Now we should have just the second task left
      expect(result.current.tasks).toHaveLength(1);
      const remainingTask = result.current.tasks[0];
      if (remainingTask) {
        expect(remainingTask.id).toBe("test-id-2");
        expect(remainingTask.title).toBe("Task 2");
      }
    });
  });

  describe("subtask operations", () => {
    it("should add a subtask to a task", () => {
      const { result } = renderHook(() => useTaskList());

      // Task ID first, then subtask ID
      vi.mocked(nanoid)
        .mockReturnValueOnce("parent-id")
        .mockReturnValueOnce("subtask-id");

      act(() => {
        result.current.addTask({ title: "Parent Task" });
      });

      act(() => {
        result.current.addSubtask("parent-id", { title: "Subtask" });
      });

      // Verify both task and subtask exist
      expect(result.current.tasks).toHaveLength(1);
      const task = result.current.tasks[0];
      if (task && task.subtasks) {
        expect(task.subtasks).toEqual([{ id: "subtask-id", title: "Subtask" }]);
      }
    });

    it("should add multiple subtasks to a task", () => {
      const { result } = renderHook(() => useTaskList());

      // Task ID first, then subtask IDs
      vi.mocked(nanoid)
        .mockReturnValueOnce("parent-id")
        .mockReturnValueOnce("subtask-id-1")
        .mockReturnValueOnce("subtask-id-2");

      act(() => {
        result.current.addTask({ title: "Parent Task" });
      });

      act(() => {
        result.current.addSubtasks("parent-id", [
          { title: "Subtask 1" },
          { title: "Subtask 2" },
        ]);
      });

      // Verify both task and subtasks exist
      expect(result.current.tasks).toHaveLength(1);
      const task = result.current.tasks[0];
      expect(task).toBeDefined();
      if (task) {
        expect(task.subtasks).toBeDefined();
        expect(task.subtasks).toEqual([
          { id: "subtask-id-1", title: "Subtask 1" },
          { id: "subtask-id-2", title: "Subtask 2" },
        ]);
      }
    });

    it("should update a subtask", () => {
      const { result } = renderHook(() => useTaskList());

      // Task ID for parent
      vi.mocked(nanoid).mockReturnValueOnce("parent-id");

      // Add a parent task
      act(() => {
        result.current.addTask({ title: "Parent Task" });
      });

      // Subtask ID
      vi.mocked(nanoid).mockReturnValueOnce("subtask-id");

      // Add a subtask to the parent
      act(() => {
        result.current.addSubtask("parent-id", { title: "Subtask" });
      });

      // Update the subtask
      act(() => {
        result.current.updateSubtask("parent-id", "subtask-id", {
          title: "Updated Subtask",
        });
      });

      // Verify the update occurred
      expect(result.current.tasks).toHaveLength(1);
      const task = result.current.tasks[0];
      if (task && task.subtasks && task.subtasks.length > 0) {
        const subtask = task.subtasks[0];
        expect(subtask).toEqual({
          id: "subtask-id",
          title: "Updated Subtask",
        });
      }
    });

    it("should remove a subtask", () => {
      const { result } = renderHook(() => useTaskList());

      // Task ID creation
      vi.mocked(nanoid).mockReturnValueOnce("parent-id");
      act(() => {
        result.current.addTask({ title: "Parent Task" });
      });

      // First subtask
      vi.mocked(nanoid).mockReturnValueOnce("subtask-id-1");
      act(() => {
        result.current.addSubtask("parent-id", { title: "Subtask 1" });
      });

      // Second subtask
      vi.mocked(nanoid).mockReturnValueOnce("subtask-id-2");
      act(() => {
        result.current.addSubtask("parent-id", { title: "Subtask 2" });
      });

      // Verify the initial state
      expect(result.current.tasks).toHaveLength(1);
      const initialTask = result.current.tasks[0];
      if (initialTask && initialTask.subtasks) {
        expect(initialTask.subtasks.length).toBe(2);
      }

      // Remove the first subtask
      act(() => {
        result.current.removeSubtask("parent-id", "subtask-id-1");
      });

      // Verify the removal
      expect(result.current.tasks).toHaveLength(1);
      const task = result.current.tasks[0];
      if (task && task.subtasks) {
        expect(task.subtasks).toEqual([
          { id: "subtask-id-2", title: "Subtask 2" },
        ]);
      }
    });

    it("should remove multiple subtasks", () => {
      const { result } = renderHook(() => useTaskList());

      // Task ID creation
      vi.mocked(nanoid).mockReturnValueOnce("parent-id");
      act(() => {
        result.current.addTask({ title: "Parent Task" });
      });

      // First subtask
      vi.mocked(nanoid).mockReturnValueOnce("subtask-id-1");
      act(() => {
        result.current.addSubtask("parent-id", { title: "Subtask 1" });
      });

      // Second subtask
      vi.mocked(nanoid).mockReturnValueOnce("subtask-id-2");
      act(() => {
        result.current.addSubtask("parent-id", { title: "Subtask 2" });
      });

      // Third subtask
      vi.mocked(nanoid).mockReturnValueOnce("subtask-id-3");
      act(() => {
        result.current.addSubtask("parent-id", { title: "Subtask 3" });
      });

      // Verify the initial state
      expect(result.current.tasks).toHaveLength(1);
      const initialTask = result.current.tasks[0];
      if (initialTask && initialTask.subtasks) {
        expect(initialTask.subtasks.length).toBe(3);

        // Check the subtask IDs to confirm they're what we expect
        expect(initialTask.subtasks.map((st) => st.id)).toEqual([
          "subtask-id-1",
          "subtask-id-2",
          "subtask-id-3",
        ]);
      }

      // Remove first and third subtasks
      act(() => {
        result.current.removeSubtasks("parent-id", [
          "subtask-id-1",
          "subtask-id-3",
        ]);
      });

      // Verify the removal
      expect(result.current.tasks).toHaveLength(1);
      const task = result.current.tasks[0];
      if (task && task.subtasks) {
        expect(task.subtasks).toEqual([
          { id: "subtask-id-2", title: "Subtask 2" },
        ]);
      }
    });
  });
});
