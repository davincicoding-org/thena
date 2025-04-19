import { act, renderHook } from "@testing-library/react";
// We need to import nanoid explicitly to be able to mock it in tests
import { nanoid } from "nanoid";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useProjects } from "./useProjects";

// Mock nanoid to get predictable IDs in tests
vi.mock("nanoid", () => ({
  nanoid: vi.fn().mockReturnValue("test-id"),
}));

describe("useProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(nanoid).mockReset();
    // Set default mock return value to ensure consistency
    vi.mocked(nanoid).mockReturnValue("test-id");
  });

  it("should initialize with empty projects array", () => {
    const { result } = renderHook(() => useProjects());
    expect(result.current.projects).toEqual([]);
  });

  it("should initialize with provided projects", () => {
    const initialProjects = [
      { id: "proj-1", name: "Project 1" },
      { id: "proj-2", name: "Project 2" },
    ];
    const { result } = renderHook(() => useProjects({ initialProjects }));
    expect(result.current.projects).toEqual(initialProjects);
  });

  it("should create a project", () => {
    const { result } = renderHook(() => useProjects());

    act(() => {
      result.current.createProject({ name: "Test Project" });
    });

    expect(result.current.projects).toEqual([
      { id: "test-id", name: "Test Project" },
    ]);
  });

  it("should update a project", () => {
    const { result } = renderHook(() => useProjects());

    act(() => {
      result.current.createProject({ name: "Test Project" });
    });

    act(() => {
      result.current.updateProject("test-id", {
        name: "Updated Project",
        description: "Updated description",
      });
    });

    expect(result.current.projects).toEqual([
      {
        id: "test-id",
        name: "Updated Project",
        description: "Updated description",
      },
    ]);
  });

  it("should delete a project", () => {
    const { result } = renderHook(() => useProjects());

    // First project creation
    vi.mocked(nanoid).mockReturnValueOnce("proj-id-1");
    act(() => {
      result.current.createProject({ name: "Project 1" });
    });

    // Second project creation
    vi.mocked(nanoid).mockReturnValueOnce("proj-id-2");
    act(() => {
      result.current.createProject({ name: "Project 2" });
    });

    // Verify we have two projects before deleting
    expect(result.current.projects).toHaveLength(2);

    // Delete the first project
    act(() => {
      result.current.deleteProject("proj-id-1");
    });

    // Now we should have just the second project left
    expect(result.current.projects).toHaveLength(1);
    const remainingProject = result.current.projects[0];
    expect(remainingProject).toBeDefined();
    expect(remainingProject?.id).toBe("proj-id-2");
    expect(remainingProject?.name).toBe("Project 2");
  });

  it("should use custom state adapter", () => {
    const customState = vi.fn();
    const initialValue = [{ id: "custom-id", name: "Custom Project" }];
    const setState = vi.fn();

    customState.mockReturnValue([initialValue, setState]);

    const { result } = renderHook(() =>
      useProjects({ stateAdapter: customState }),
    );

    expect(customState).toHaveBeenCalledWith(expect.any(Array));
    expect(result.current.projects).toBe(initialValue);
  });
});
