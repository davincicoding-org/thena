import { Dispatch, SetStateAction } from "react";
import { act, renderHook } from "@testing-library/react";
import { nanoid } from "nanoid";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  BacklogFilters,
  BacklogSortOptions,
  BacklogTask,
  StateHook,
} from "../types";
import { useBacklog } from "./useBacklog";

// Mock nanoid to get predictable IDs in tests
vi.mock("nanoid", () => ({
  nanoid: vi.fn().mockReturnValue("test-id"),
}));

// Type-safe mock for state hooks
function createMockStateHook<T>(
  initialState: T,
): [StateHook<T>, Dispatch<SetStateAction<T>>] {
  const setState = vi.fn();
  const useStateMock: StateHook<T> = () => [initialState, setState];
  return [useStateMock, setState];
}

describe("useBacklog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(nanoid).mockReset();
    // Set default mock return value to ensure consistency
    vi.mocked(nanoid).mockReturnValue("test-id");

    // Mock Date.now for predictable timestamps
    const mockDateISOString = "2023-01-01T12:00:00.000Z";
    vi.spyOn(Date.prototype, "toISOString").mockReturnValue(mockDateISOString);
  });

  it("should initialize with empty tasks array", () => {
    const { result } = renderHook(() => useBacklog());
    expect(result.current.tasks).toEqual([]);
  });

  it("should initialize with provided tasks", () => {
    const initialTasks: BacklogTask[] = [
      {
        id: "task-1",
        title: "Task 1",
        addedAt: "2022-12-31T12:00:00.000Z",
      },
      {
        id: "task-2",
        title: "Task 2",
        description: "Description 2",
        addedAt: "2022-12-30T12:00:00.000Z",
      },
    ];
    const { result } = renderHook(() => useBacklog({ initialTasks }));
    expect(result.current.tasks).toEqual(initialTasks);
  });

  it("should add a task", () => {
    const { result } = renderHook(() => useBacklog());

    act(() => {
      result.current.addTask({ title: "New Task" });
    });

    expect(result.current.tasks).toEqual([
      {
        id: "test-id",
        title: "New Task",
        addedAt: "2023-01-01T12:00:00.000Z",
      },
    ]);
  });

  it("should add multiple tasks", () => {
    const { result } = renderHook(() => useBacklog());

    act(() => {
      result.current.addTasks([
        { title: "Task 1" },
        { title: "Task 2", description: "Description 2" },
      ]);
    });

    expect(result.current.tasks).toEqual([
      {
        id: "test-id",
        title: "Task 1",
        addedAt: "2023-01-01T12:00:00.000Z",
      },
      {
        id: "test-id",
        title: "Task 2",
        description: "Description 2",
        addedAt: "2023-01-01T12:00:00.000Z",
      },
    ]);
  });

  it("should update a task", () => {
    const initialTasks: BacklogTask[] = [
      {
        id: "task-1",
        title: "Task 1",
        addedAt: "2022-12-31T12:00:00.000Z",
      },
    ];
    const { result } = renderHook(() => useBacklog({ initialTasks }));

    act(() => {
      result.current.updateTask("task-1", {
        title: "Updated Task",
        description: "New description",
        tags: ["tag1", "tag2"],
      });
    });

    expect(result.current.tasks).toEqual([
      {
        id: "task-1",
        title: "Updated Task",
        description: "New description",
        tags: ["tag1", "tag2"],
        addedAt: "2022-12-31T12:00:00.000Z",
      },
    ]);
  });

  it("should remove a task", () => {
    const initialTasks: BacklogTask[] = [
      {
        id: "task-1",
        title: "Task 1",
        addedAt: "2022-12-31T12:00:00.000Z",
      },
      {
        id: "task-2",
        title: "Task 2",
        addedAt: "2022-12-30T12:00:00.000Z",
      },
    ];
    const { result } = renderHook(() => useBacklog({ initialTasks }));

    act(() => {
      result.current.removeTask("task-1");
    });

    expect(result.current.tasks).toEqual([
      {
        id: "task-2",
        title: "Task 2",
        addedAt: "2022-12-30T12:00:00.000Z",
      },
    ]);
  });

  it("should remove multiple tasks", () => {
    const initialTasks: BacklogTask[] = [
      {
        id: "task-1",
        title: "Task 1",
        addedAt: "2022-12-31T12:00:00.000Z",
      },
      {
        id: "task-2",
        title: "Task 2",
        addedAt: "2022-12-30T12:00:00.000Z",
      },
      {
        id: "task-3",
        title: "Task 3",
        addedAt: "2022-12-29T12:00:00.000Z",
      },
    ];
    const { result } = renderHook(() => useBacklog({ initialTasks }));

    act(() => {
      result.current.removeTasks(["task-1", "task-3"]);
    });

    expect(result.current.tasks).toEqual([
      {
        id: "task-2",
        title: "Task 2",
        addedAt: "2022-12-30T12:00:00.000Z",
      },
    ]);
  });

  it("should filter tasks by project IDs", () => {
    const initialTasks: BacklogTask[] = [
      {
        id: "task-1",
        title: "Task 1",
        projectId: "project-1",
        addedAt: "2022-12-31T12:00:00.000Z",
      },
      {
        id: "task-2",
        title: "Task 2",
        projectId: "project-2",
        addedAt: "2022-12-30T12:00:00.000Z",
      },
      {
        id: "task-3",
        title: "Task 3",
        projectId: "project-1",
        addedAt: "2022-12-29T12:00:00.000Z",
      },
    ];
    const { result } = renderHook(() => useBacklog({ initialTasks }));

    act(() => {
      result.current.updateFilters({ projectIds: ["project-1"] });
    });

    expect(result.current.tasks).toHaveLength(2);
    const filteredTasks = result.current.tasks;
    expect(filteredTasks[0]?.id).toBe("task-1");
    expect(filteredTasks[1]?.id).toBe("task-3");
  });

  it("should filter tasks by tags", () => {
    const initialTasks: BacklogTask[] = [
      {
        id: "task-1",
        title: "Task 1",
        tags: ["tag1", "tag2"],
        addedAt: "2022-12-31T12:00:00.000Z",
      },
      {
        id: "task-2",
        title: "Task 2",
        tags: ["tag2", "tag3"],
        addedAt: "2022-12-30T12:00:00.000Z",
      },
      {
        id: "task-3",
        title: "Task 3",
        tags: ["tag3"],
        addedAt: "2022-12-29T12:00:00.000Z",
      },
    ];
    const { result } = renderHook(() => useBacklog({ initialTasks }));

    act(() => {
      result.current.updateFilters({ tags: ["tag1"] });
    });

    expect(result.current.tasks).toHaveLength(1);
    const filteredTasks = result.current.tasks;
    expect(filteredTasks[0]?.id).toBe("task-1");
  });

  it("should filter tasks by search term in title", () => {
    const initialTasks: BacklogTask[] = [
      {
        id: "task-1",
        title: "Implement feature",
        addedAt: "2022-12-31T12:00:00.000Z",
      },
      {
        id: "task-2",
        title: "Fix bug",
        addedAt: "2022-12-30T12:00:00.000Z",
      },
      {
        id: "task-3",
        title: "Update feature",
        addedAt: "2022-12-29T12:00:00.000Z",
      },
    ];
    const { result } = renderHook(() => useBacklog({ initialTasks }));

    act(() => {
      result.current.updateFilters({ search: "feature" });
    });

    expect(result.current.tasks).toHaveLength(2);
    const filteredTasks = result.current.tasks;
    expect(filteredTasks[0]?.id).toBe("task-1");
    expect(filteredTasks[1]?.id).toBe("task-3");
  });

  it("should filter tasks by search term in description", () => {
    const initialTasks: BacklogTask[] = [
      {
        id: "task-1",
        title: "Task 1",
        description: "Implement new feature",
        addedAt: "2022-12-31T12:00:00.000Z",
      },
      {
        id: "task-2",
        title: "Task 2",
        description: "Fix critical bug",
        addedAt: "2022-12-30T12:00:00.000Z",
      },
    ];
    const { result } = renderHook(() => useBacklog({ initialTasks }));

    act(() => {
      result.current.updateFilters({ search: "critical" });
    });

    expect(result.current.tasks).toHaveLength(1);
    const filteredTasks = result.current.tasks;
    expect(filteredTasks[0]?.id).toBe("task-2");
  });

  it("should combine multiple filters", () => {
    const initialTasks: BacklogTask[] = [
      {
        id: "task-1",
        title: "Feature 1",
        projectId: "project-1",
        tags: ["tag1", "tag2"],
        addedAt: "2022-12-31T12:00:00.000Z",
      },
      {
        id: "task-2",
        title: "Feature 2",
        projectId: "project-2",
        tags: ["tag2"],
        addedAt: "2022-12-30T12:00:00.000Z",
      },
      {
        id: "task-3",
        title: "Bug fix",
        projectId: "project-1",
        tags: ["tag1"],
        addedAt: "2022-12-29T12:00:00.000Z",
      },
    ];
    const { result } = renderHook(() => useBacklog({ initialTasks }));

    act(() => {
      result.current.updateFilters({
        projectIds: ["project-1"],
        tags: ["tag1"],
        search: "feature",
      });
    });

    expect(result.current.tasks).toHaveLength(1);
    const filteredTasks = result.current.tasks;
    expect(filteredTasks[0]?.id).toBe("task-1");
  });

  it("should sort tasks by addedAt in descending order by default", () => {
    const initialTasks: BacklogTask[] = [
      {
        id: "task-1",
        title: "Task 1",
        addedAt: "2022-12-29T12:00:00.000Z",
      },
      {
        id: "task-2",
        title: "Task 2",
        addedAt: "2022-12-31T12:00:00.000Z",
      },
      {
        id: "task-3",
        title: "Task 3",
        addedAt: "2022-12-30T12:00:00.000Z",
      },
    ];
    const { result } = renderHook(() => useBacklog({ initialTasks }));

    // Default sort should be by addedAt in descending order
    const sortedTasks = result.current.tasks;
    expect(sortedTasks[0]?.id).toBe("task-2"); // 12-31
    expect(sortedTasks[1]?.id).toBe("task-3"); // 12-30
    expect(sortedTasks[2]?.id).toBe("task-1"); // 12-29
  });

  it("should update sort to title ascending", () => {
    const initialTasks: BacklogTask[] = [
      {
        id: "task-1",
        title: "C Task",
        addedAt: "2022-12-31T12:00:00.000Z",
      },
      {
        id: "task-2",
        title: "A Task",
        addedAt: "2022-12-30T12:00:00.000Z",
      },
      {
        id: "task-3",
        title: "B Task",
        addedAt: "2022-12-29T12:00:00.000Z",
      },
    ];
    const { result } = renderHook(() => useBacklog({ initialTasks }));

    act(() => {
      result.current.updateSort({ sortBy: "title", direction: "asc" });
    });

    const sortedTasks = result.current.tasks;
    expect(sortedTasks[0]?.id).toBe("task-2"); // A
    expect(sortedTasks[1]?.id).toBe("task-3"); // B
    expect(sortedTasks[2]?.id).toBe("task-1"); // C
  });

  it("should initialize with default filters", () => {
    const defaultFilters: BacklogFilters = { tags: ["important"] };
    const { result } = renderHook(() => useBacklog({ defaultFilters }));

    expect(result.current.filters).toEqual(defaultFilters);
  });

  it("should initialize with default sort", () => {
    const defaultSort: BacklogSortOptions = {
      sortBy: "title",
      direction: "asc",
    };
    const { result } = renderHook(() => useBacklog({ defaultSort }));

    expect(result.current.sort).toEqual(defaultSort);
  });
});
