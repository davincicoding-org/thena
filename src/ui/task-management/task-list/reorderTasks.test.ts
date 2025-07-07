import { describe, expect, it } from "vitest";

import { reorderTasks } from "./reorderTasks";

describe("reorderTasks", () => {
  describe("initial reordering", () => {
    it("should handle moving a task to the first position", () => {
      const tasks = [
        { id: 1, customSortOrder: null },
        { id: 2, customSortOrder: null },
        { id: 3, customSortOrder: null },
        { id: 4, customSortOrder: null },
        { id: 5, customSortOrder: null },
      ];

      const { reorderedItems, updates } = reorderTasks(tasks, 2, 0);

      expect(reorderedItems).toEqual([
        { id: 3, customSortOrder: null },
        { id: 1, customSortOrder: null },
        { id: 2, customSortOrder: null },
        { id: 4, customSortOrder: null },
        { id: 5, customSortOrder: null },
      ]);

      expect(updates).toHaveLength(1);
      expect(updates).toContainEqual({ id: 3, customSortOrder: 0.5 });
    });

    it("should handle moving a task to the last position", () => {
      const tasks = [
        { id: 1, customSortOrder: null },
        { id: 2, customSortOrder: null },
        { id: 3, customSortOrder: null },
        { id: 4, customSortOrder: null },
        { id: 5, customSortOrder: null },
      ];

      const { reorderedItems, updates } = reorderTasks(tasks, 2, 4);

      expect(reorderedItems).toEqual([
        { id: 1, customSortOrder: null },
        { id: 2, customSortOrder: null },
        { id: 4, customSortOrder: null },
        { id: 5, customSortOrder: null },
        { id: 3, customSortOrder: null },
      ]);

      expect(updates).toHaveLength(1);
      expect(updates).toContainEqual({ id: 3, customSortOrder: 5.5 });
    });

    it("should handle moving a task from the first position", () => {
      const tasks = [
        { id: 1, customSortOrder: null },
        { id: 2, customSortOrder: null },
        { id: 3, customSortOrder: null },
        { id: 4, customSortOrder: null },
        { id: 5, customSortOrder: null },
      ];

      const { reorderedItems, updates } = reorderTasks(tasks, 0, 2);

      expect(reorderedItems).toEqual([
        { id: 2, customSortOrder: null },
        { id: 3, customSortOrder: null },
        { id: 1, customSortOrder: null },
        { id: 4, customSortOrder: null },
        { id: 5, customSortOrder: null },
      ]);

      expect(updates).toHaveLength(1);
      expect(updates).toContainEqual({ id: 1, customSortOrder: 3.5 });
    });

    it("should handle moving a task from the last position", () => {
      const tasks = [
        { id: 1, customSortOrder: null },
        { id: 2, customSortOrder: null },
        { id: 3, customSortOrder: null },
        { id: 4, customSortOrder: null },
        { id: 5, customSortOrder: null },
      ];

      const { reorderedItems, updates } = reorderTasks(tasks, 4, 1);

      expect(reorderedItems).toEqual([
        { id: 1, customSortOrder: null },
        { id: 5, customSortOrder: null },
        { id: 2, customSortOrder: null },
        { id: 3, customSortOrder: null },
        { id: 4, customSortOrder: null },
      ]);

      expect(updates).toHaveLength(1);
      expect(updates).toContainEqual({ id: 5, customSortOrder: 1.5 });
    });
  });

  describe("subsequent reordering", () => {
    it("should handle moving a task to its natural position (first)", () => {
      const tasks = [
        { id: 2, customSortOrder: null },
        { id: 1, customSortOrder: 1.5 },
        { id: 3, customSortOrder: null },
        { id: 4, customSortOrder: null },
        { id: 5, customSortOrder: null },
      ];

      const { reorderedItems, updates } = reorderTasks(tasks, 1, 0);

      expect(reorderedItems).toEqual([
        { id: 1, customSortOrder: 1.5 },
        { id: 2, customSortOrder: null },
        { id: 3, customSortOrder: null },
        { id: 4, customSortOrder: null },
        { id: 5, customSortOrder: null },
      ]);

      expect(updates).toHaveLength(1);
      expect(updates).toContainEqual({ id: 1, customSortOrder: null });
    });

    it("should handle moving a task to its natural position (last)", () => {
      const tasks = [
        { id: 1, customSortOrder: null },
        { id: 2, customSortOrder: null },
        { id: 5, customSortOrder: 2.5 },
        { id: 3, customSortOrder: null },
        { id: 4, customSortOrder: null },
      ];

      const { reorderedItems, updates } = reorderTasks(tasks, 2, 4);

      expect(reorderedItems).toEqual([
        { id: 1, customSortOrder: null },
        { id: 2, customSortOrder: null },
        { id: 3, customSortOrder: null },
        { id: 4, customSortOrder: null },
        { id: 5, customSortOrder: 2.5 },
      ]);

      expect(updates).toHaveLength(1);
      expect(updates).toContainEqual({ id: 5, customSortOrder: null });
    });

    it("should handle moving a task to its natural position (middle)", () => {
      const tasks = [
        { id: 4, customSortOrder: 0.5 },
        { id: 1, customSortOrder: null },
        { id: 2, customSortOrder: null },
        { id: 3, customSortOrder: null },
        { id: 5, customSortOrder: null },
      ];

      const { reorderedItems, updates } = reorderTasks(tasks, 0, 3);

      expect(reorderedItems).toEqual([
        { id: 1, customSortOrder: null },
        { id: 2, customSortOrder: null },
        { id: 3, customSortOrder: null },
        { id: 4, customSortOrder: 0.5 },
        { id: 5, customSortOrder: null },
      ]);

      expect(updates).toHaveLength(1);
      expect(updates).toContainEqual({ id: 4, customSortOrder: null });
    });

    it("should remove redundant customSortOrder", () => {
      const tasks = [
        { id: 1, customSortOrder: null },
        { id: 2, customSortOrder: null },
        { id: 3, customSortOrder: null },
        { id: 4, customSortOrder: 4.5 },
        { id: 5, customSortOrder: null },
      ];

      const { reorderedItems, updates } = reorderTasks(tasks, 0, 2);

      expect(reorderedItems).toEqual([
        { id: 2, customSortOrder: null },
        { id: 3, customSortOrder: null },
        { id: 1, customSortOrder: null },
        { id: 4, customSortOrder: 4.5 },
        { id: 5, customSortOrder: null },
      ]);

      expect(updates).toHaveLength(2);
      expect(updates).toContainEqual({ id: 1, customSortOrder: 3.5 });
      expect(updates).toContainEqual({ id: 4, customSortOrder: null });
    });
  });
});
