import { act, renderHook } from "@testing-library/react";
// We need to import nanoid explicitly to be able to mock it in tests
import { nanoid } from "nanoid";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTags } from "./useTags";

// Mock nanoid to get predictable IDs in tests
vi.mock("nanoid", () => ({
  nanoid: vi.fn().mockReturnValue("test-id"),
}));

describe("useTags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(nanoid).mockReset();
    // Set default mock return value to ensure consistency
    vi.mocked(nanoid).mockReturnValue("test-id");
  });

  it("should initialize with empty tags array", () => {
    const { result } = renderHook(() => useTags());
    expect(result.current.tags).toEqual([]);
  });

  it("should initialize with provided tags", () => {
    const initialTags = [
      { id: "tag-1", name: "Tag 1" },
      { id: "tag-2", name: "Tag 2", color: "green" },
    ];
    const { result } = renderHook(() => useTags({ initialTags }));
    expect(result.current.tags).toEqual(initialTags);
  });

  it("should create a tag", () => {
    const { result } = renderHook(() => useTags());

    act(() => {
      result.current.createTag({ name: "Test Tag" });
    });

    expect(result.current.tags).toEqual([{ id: "test-id", name: "Test Tag" }]);
  });

  it("should create a tag with color", () => {
    const { result } = renderHook(() => useTags());

    act(() => {
      result.current.createTag({ name: "Colored Tag", color: "blue" });
    });

    expect(result.current.tags).toEqual([
      { id: "test-id", name: "Colored Tag", color: "blue" },
    ]);
  });

  it("should update a tag", () => {
    const { result } = renderHook(() => useTags());

    act(() => {
      result.current.createTag({ name: "Test Tag" });
    });

    act(() => {
      result.current.updateTag("test-id", {
        name: "Updated Tag",
        description: "Updated description",
        color: "yellow",
      });
    });

    expect(result.current.tags).toEqual([
      {
        id: "test-id",
        name: "Updated Tag",
        description: "Updated description",
        color: "yellow",
      },
    ]);
  });

  it("should delete a tag", () => {
    const { result } = renderHook(() => useTags());

    // First tag creation
    vi.mocked(nanoid).mockReturnValueOnce("tag-id-1");
    act(() => {
      result.current.createTag({ name: "Tag 1" });
    });

    // Second tag creation
    vi.mocked(nanoid).mockReturnValueOnce("tag-id-2");
    act(() => {
      result.current.createTag({ name: "Tag 2", color: "green" });
    });

    // Verify we have two tags before deleting
    expect(result.current.tags).toHaveLength(2);

    // Delete the first tag
    act(() => {
      result.current.deleteTag("tag-id-1");
    });

    // Now we should have just the second tag left
    expect(result.current.tags).toHaveLength(1);
    const remainingTag = result.current.tags[0];
    expect(remainingTag).toBeDefined();
    expect(remainingTag?.id).toBe("tag-id-2");
    expect(remainingTag?.name).toBe("Tag 2");
    expect(remainingTag?.color).toBe("green");
  });

  it("should use custom state adapter", () => {
    const customState = vi.fn();
    const initialValue = [{ id: "custom-id", name: "Custom Tag" }];
    const setState = vi.fn();

    customState.mockReturnValue([initialValue, setState]);

    const { result } = renderHook(() => useTags({ stateAdapter: customState }));

    expect(customState).toHaveBeenCalledWith(expect.any(Array));
    expect(result.current.tags).toBe(initialValue);
  });
});
