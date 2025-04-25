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
    expect(result.current.items).toEqual([]);
  });

  it("should add a task", () => {
    const { result } = renderHook(() => useTaskList());

    act(() => {
      result.current.addTask({ title: "Test Task" });
    });

    expect(result.current.items).toEqual([
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

    expect(result.current.items).toEqual([
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

    expect(result.current.items).toEqual([
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
    expect(result.current.items).toHaveLength(2);
    const firstTask = result.current.items[0];
    const secondTask = result.current.items[1];
    if (firstTask && secondTask) {
      expect(firstTask.id).toBe("test-id-1");
      expect(secondTask.id).toBe("test-id-2");
    }

    // Remove the first task
    act(() => {
      result.current.removeTask("test-id-1");
    });

    // Now we should have just one task (the second one) left
    expect(result.current.items).toHaveLength(1);
    const remainingTask = result.current.items[0];
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
    expect(result.current.items).toHaveLength(3);

    // Remove first and third tasks
    act(() => {
      result.current.removeTasks(["test-id-1", "test-id-3"]);
    });

    // Now we should have just the second task left
    expect(result.current.items).toHaveLength(1);
    const remainingTask = result.current.items[0];
    if (remainingTask) {
      expect(remainingTask.id).toBe("test-id-2");
      expect(remainingTask.title).toBe("Task 2");
    }
  });
});
