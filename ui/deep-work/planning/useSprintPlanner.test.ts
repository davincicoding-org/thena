import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createMockTasks } from "@/core/task-management/mock";

import { DEFAULT_OPTIONS, useSessionPlanner } from "./useSprintPlanner";

// ----- Tests -----

describe("useSessionPlanner", () => {
  describe("Initialisation", () => {
    it("should initialize empty sprints", () => {
      const { result } = renderHook(() =>
        useSessionPlanner([], { initialSprints: 3 }),
      );

      expect(result.current.sprints).toHaveLength(3);
      expect(result.current.sprints[0]!.duration).toBe(
        DEFAULT_OPTIONS.sprintDuration,
      );
      expect(result.current.sprints[1]!.duration).toBe(
        DEFAULT_OPTIONS.sprintDuration,
      );
      expect(result.current.sprints[2]!.duration).toBe(
        DEFAULT_OPTIONS.sprintDuration,
      );
      expect(result.current.sprints[0]!.tasks).toEqual([]);
      expect(result.current.sprints[1]!.tasks).toEqual([]);
      expect(result.current.sprints[2]!.tasks).toEqual([]);
    });

    it("should initialize sprints with a custom duration", () => {
      const mockTasks = createMockTasks([0, 2]);
      const customDuration = 45;

      const { result } = renderHook(() =>
        useSessionPlanner(mockTasks, {
          initialSprints: 2,
          sprintDuration: customDuration,
        }),
      );

      expect(result.current.sprints).toHaveLength(2);
      expect(result.current.sprints[0]!.duration).toBe(customDuration);
      expect(result.current.sprints[1]!.duration).toBe(customDuration);
      expect(result.current.sprints[0]!.tasks).toEqual([]);
      expect(result.current.sprints[1]!.tasks).toEqual([]);
      expect(result.current.unassignedTasks).toEqual(mockTasks);
    });
  });

  // describe("initialize", () => {
  //   it("should initialize empty sprints", () => {
  //     const { result } = renderHook(() => useSessionPlanner([]));

  //     // Start with 0 sprints (DEFAULT_OPTIONS.sprintCount is 0)
  //     expect(result.current.sprints).toHaveLength(0);

  //     // Initialize with 3 sprints
  //     act(() => result.current.initialize({ initialSprints: 3 }));

  //     expect(result.current.sprints).toHaveLength(3);
  //     expect(result.current.sprints[0]!.duration).toBe(
  //       DEFAULT_OPTIONS.sprintDuration,
  //     );
  //     expect(result.current.sprints[1]!.duration).toBe(
  //       DEFAULT_OPTIONS.sprintDuration,
  //     );
  //     expect(result.current.sprints[2]!.duration).toBe(
  //       DEFAULT_OPTIONS.sprintDuration,
  //     );
  //     expect(result.current.sprints[0]!.tasks).toEqual([]);
  //     expect(result.current.sprints[1]!.tasks).toEqual([]);
  //     expect(result.current.sprints[2]!.tasks).toEqual([]);
  //   });

  //   it("should initialize sprints with a custom duration", () => {
  //     const mockTasks = createMockTasks([0, 2]);
  //     const customDuration = 45;

  //     const { result } = renderHook(() => useSessionPlanner(mockTasks));

  //     // Start with 0 sprints
  //     expect(result.current.sprints).toHaveLength(0);

  //     // Initialize with 2 sprints and custom duration
  //     act(() =>
  //       result.current.initialize({
  //         initialSprints: 2,
  //         sprintDuration: customDuration,
  //       }),
  //     );

  //     expect(result.current.sprints).toHaveLength(2);
  //     expect(result.current.sprints[0]!.duration).toBe(customDuration);
  //     expect(result.current.sprints[1]!.duration).toBe(customDuration);
  //     expect(result.current.sprints[0]!.tasks).toEqual([]);
  //     expect(result.current.sprints[1]!.tasks).toEqual([]);
  //     expect(result.current.unassignedTasks).toEqual(mockTasks);
  //   });
  // });

  describe("addSprint", () => {
    it("should add a new sprint", () => {
      const { result } = renderHook(() => useSessionPlanner([]));

      expect(result.current.sprints).toHaveLength(0);

      act(() => result.current.addSprint({}));

      expect(result.current.sprints).toHaveLength(1);
      expect(result.current.sprints[0]!.duration).toBe(
        DEFAULT_OPTIONS.sprintDuration,
      );
      expect(result.current.sprints[0]!.tasks).toEqual([]);
    });

    it("should add a sprint with tasks assigned to it", () => {
      const mockTasks = createMockTasks([0, 1, 2]);

      const { result } = renderHook(() => useSessionPlanner(mockTasks));

      expect(result.current.sprints).toHaveLength(0);

      // We know these tasks exist, so we can use non-null assertions
      const taskSelections = [
        { taskId: mockTasks[0]!.id },
        {
          taskId: mockTasks[1]!.id,
          subtasks: mockTasks[1]!.subtasks!.map((s) => s.id),
        },
      ];

      act(() => result.current.addSprint({ tasks: taskSelections }));

      expect(result.current.sprints).toHaveLength(1);
      expect(result.current.sprints[0]!.duration).toBe(
        DEFAULT_OPTIONS.sprintDuration,
      );

      // Verify tasks are assigned correctly
      const sprintTasks = result.current.sprints[0]!.tasks;
      expect(sprintTasks).toHaveLength(2);

      // Check first task matches
      expect(sprintTasks[0]).toEqual(
        expect.objectContaining({
          id: mockTasks[0]!.id,
          title: mockTasks[0]!.title,
        }),
      );

      // Check second task matches and has subtasks
      expect(sprintTasks[1]).toEqual(
        expect.objectContaining({
          id: mockTasks[1]!.id,
          title: mockTasks[1]!.title,
        }),
      );

      if (sprintTasks[1]!.subtasks) {
        expect(sprintTasks[1]!.subtasks).toHaveLength(1);
      }

      // The unassigned tasks should only contain the one task not assigned to the sprint
      expect(result.current.unassignedTasks).toHaveLength(1);

      const remainingTask = result.current.unassignedTasks[0];
      expect(remainingTask).toEqual(
        expect.objectContaining({
          id: mockTasks[2]!.id,
          title: mockTasks[2]!.title,
        }),
      );
    });

    it("should add a new sprint with custom duration", () => {
      const customDuration = 60;
      const { result } = renderHook(() => useSessionPlanner([]));

      expect(result.current.sprints).toHaveLength(0);

      act(() => result.current.addSprint({ duration: customDuration }));

      expect(result.current.sprints).toHaveLength(1);
      expect(result.current.sprints[0]!.duration).toBe(customDuration);
      expect(result.current.sprints[0]!.tasks).toEqual([]);
    });
  });

  describe("addSprints", () => {
    it("should add multiple sprints", () => {
      const { result } = renderHook(() => useSessionPlanner([]));

      expect(result.current.sprints).toHaveLength(0);

      act(() => result.current.addSprints([{}, {}]));

      expect(result.current.sprints).toHaveLength(2);
      expect(result.current.sprints[0]!.duration).toBe(
        DEFAULT_OPTIONS.sprintDuration,
      );
      expect(result.current.sprints[1]!.duration).toBe(
        DEFAULT_OPTIONS.sprintDuration,
      );
      expect(result.current.sprints[0]!.tasks).toEqual([]);
      expect(result.current.sprints[1]!.tasks).toEqual([]);
    });

    it("should add multiple sprints with tasks assigned to them", () => {
      const mockTasks = createMockTasks([0, 1, 2, 3]);

      const { result } = renderHook(() => useSessionPlanner(mockTasks));

      expect(result.current.sprints).toHaveLength(0);

      act(() =>
        result.current.addSprints([
          {
            tasks: [{ taskId: mockTasks[0]!.id }, { taskId: mockTasks[1]!.id }],
          },
          {
            tasks: [{ taskId: mockTasks[2]!.id }],
          },
        ]),
      );

      expect(result.current.sprints).toHaveLength(2);

      // Check first sprint's tasks
      const firstSprintTasks = result.current.sprints[0]!.tasks;
      expect(firstSprintTasks).toHaveLength(2);
      expect(firstSprintTasks[0]).toEqual(
        expect.objectContaining({ id: mockTasks[0]!.id }),
      );
      expect(firstSprintTasks[1]).toEqual(
        expect.objectContaining({ id: mockTasks[1]!.id }),
      );

      // Check second sprint's tasks
      const secondSprintTasks = result.current.sprints[1]!.tasks;
      expect(secondSprintTasks).toHaveLength(1);
      expect(secondSprintTasks[0]).toEqual(
        expect.objectContaining({ id: mockTasks[2]!.id }),
      );

      expect(result.current.unassignedTasks).toHaveLength(1);
      expect(result.current.unassignedTasks[0]).toEqual(
        expect.objectContaining({ id: mockTasks[3]!.id }),
      );
    });

    it("should add multiple sprints with custom durations", () => {
      const { result } = renderHook(() => useSessionPlanner([]));

      expect(result.current.sprints).toHaveLength(0);

      act(() =>
        result.current.addSprints([{ duration: 30 }, { duration: 45 }]),
      );

      expect(result.current.sprints).toHaveLength(2);
      expect(result.current.sprints[0]!.duration).toBe(30);
      expect(result.current.sprints[1]!.duration).toBe(45);
      expect(result.current.sprints[0]!.tasks).toEqual([]);
      expect(result.current.sprints[1]!.tasks).toEqual([]);
    });

    it("should not cause a state update when providing an empty options array", () => {
      const { result } = renderHook(() => useSessionPlanner([]));

      expect(result.current.sprints).toHaveLength(0);

      // Capture the reference to the current sprints array
      const prevSprints = result.current.sprints;

      act(() => result.current.addSprints([]));

      // Check that the sprints array reference hasn't changed
      expect(result.current.sprints).toStrictEqual(prevSprints);
      expect(result.current.sprints).toHaveLength(0);
    });
  });

  describe("updateSprint", () => {
    it("should update a sprint's duration", () => {
      const { result } = renderHook(() =>
        useSessionPlanner([], { initialSprints: 2 }),
      );

      expect(result.current.sprints).toHaveLength(2);

      const sprintId = result.current.sprints[0]!.id;
      expect(sprintId).toBeDefined();

      if (sprintId) {
        const newDuration = 60;

        // Original duration should be the default
        expect(result.current.sprints[0]!.duration).toBe(
          DEFAULT_OPTIONS.sprintDuration,
        );

        // Update the duration
        act(() =>
          result.current.updateSprint(sprintId, { duration: newDuration }),
        );

        // First sprint should have the new duration
        expect(result.current.sprints[0]!.duration).toBe(newDuration);

        // Second sprint's duration should remain unchanged
        expect(result.current.sprints[1]!.duration).toBe(
          DEFAULT_OPTIONS.sprintDuration,
        );
      }
    });

    it("should log an error when providing an inexistent sprint ID", () => {
      const mockOnError = vi.fn();
      const { result } = renderHook(() =>
        useSessionPlanner([], { initialSprints: 1, onError: mockOnError }),
      );

      const nonExistentId = "non-existent-id";

      // Update with a non-existent sprint ID
      act(() => result.current.updateSprint(nonExistentId, { duration: 60 }));

      // Error should be logged
      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: "SPRINT_NOT_FOUND",
          action: "updateSprint",
          details: expect.objectContaining({
            sprintId: nonExistentId,
          }),
        }),
      );
    });

    it("should not update any state when providing an inexistent sprint ID", () => {
      const { result } = renderHook(() =>
        useSessionPlanner([], { initialSprints: 1 }),
      );

      expect(result.current.sprints).toHaveLength(1);

      // Capture references to current state objects
      const prevSprints = result.current.sprints;
      const prevFirstSprint = result.current.sprints[0];

      // Update with a non-existent sprint ID
      act(() =>
        result.current.updateSprint("non-existent-id", { duration: 60 }),
      );

      // State references should remain unchanged
      expect(result.current.sprints).toBe(prevSprints);
      expect(result.current.sprints[0]).toBe(prevFirstSprint);
      expect(result.current.sprints[0]!.duration).toBe(
        DEFAULT_OPTIONS.sprintDuration,
      ); // Value should also be unchanged
    });
  });

  describe("reorderSprints", () => {
    it("should reorder sprints", () => {
      const { result } = renderHook(() =>
        useSessionPlanner([], { initialSprints: 3 }),
      );

      expect(result.current.sprints).toHaveLength(3);

      // Get the actual sprint IDs
      const sprint1Id = result.current.sprints[0]!.id;
      const sprint2Id = result.current.sprints[1]!.id;
      const sprint3Id = result.current.sprints[2]!.id;

      // Reorder sprints (3, 1, 2)
      act(() =>
        result.current.reorderSprints([sprint3Id, sprint1Id, sprint2Id]),
      );

      // Check new order
      expect(result.current.sprints).toHaveLength(3);
      expect(result.current.sprints[0]!.id).toBe(sprint3Id);
      expect(result.current.sprints[1]!.id).toBe(sprint1Id);
      expect(result.current.sprints[2]!.id).toBe(sprint2Id);
    });

    describe("with missing sprint ID", () => {
      it("should log an error", () => {
        const mockOnError = vi.fn();
        const { result } = renderHook(() =>
          useSessionPlanner([], { initialSprints: 3, onError: mockOnError }),
        );

        expect(result.current.sprints).toHaveLength(3);

        // Try to reorder with only some of the sprint IDs (missing one)
        act(() =>
          result.current.reorderSprints([
            result.current.sprints[0]!.id,
            result.current.sprints[1]!.id,
          ]),
        );

        // Error should be logged
        expect(mockOnError).toHaveBeenCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "SPRINT_NOT_PROVIDED",
            action: "reorderSprints",
            details: {
              sprintId: result.current.sprints[2]!.id,
            },
          }),
        );
      });

      it("should log multiple errors", () => {
        const mockOnError = vi.fn();
        const { result } = renderHook(() =>
          useSessionPlanner([], { initialSprints: 4, onError: mockOnError }),
        );

        expect(result.current.sprints).toHaveLength(4);

        // Try to reorder with only some of the sprint IDs (missing one)
        act(() =>
          result.current.reorderSprints([
            result.current.sprints[0]!.id,
            result.current.sprints[1]!.id,
          ]),
        );

        // Error should be logged
        expect(mockOnError).toHaveBeenCalledTimes(2);
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "SPRINT_NOT_PROVIDED",
            action: "reorderSprints",
            details: {
              sprintId: result.current.sprints[2]!.id,
            },
          }),
        );
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "SPRINT_NOT_PROVIDED",
            action: "reorderSprints",
            details: {
              sprintId: result.current.sprints[3]!.id,
            },
          }),
        );
      });

      it("should not update any state", () => {
        const { result } = renderHook(() =>
          useSessionPlanner([], { initialSprints: 3 }),
        );

        expect(result.current.sprints).toHaveLength(3);

        // Capture references to current state
        const prevSprints = result.current.sprints;

        // Try to reorder with only some of the sprint IDs (missing one)
        act(() =>
          result.current.reorderSprints([
            result.current.sprints[0]!.id,
            result.current.sprints[1]!.id,
          ]),
        );

        // State should remain unchanged
        expect(result.current.sprints).toBe(prevSprints);
      });
    });

    describe("with additional sprint IDs", () => {
      it("should not update state if additional IDs are provided", () => {
        const { result } = renderHook(() =>
          useSessionPlanner([], { initialSprints: 2 }),
        );

        expect(result.current.sprints).toHaveLength(2);

        // Get the actual sprint IDs and capture original state
        const sprint1Id = result.current.sprints[0]!.id;
        const sprint2Id = result.current.sprints[1]!.id;
        const prevSprints = result.current.sprints;

        // Try to reorder with an additional ID
        act(() =>
          result.current.reorderSprints([
            sprint2Id,
            sprint1Id,
            "non-existent-id",
          ]),
        );

        // State references should remain unchanged (implementation rejects updates with invalid IDs)
        expect(result.current.sprints).toBe(prevSprints);
        expect(result.current.sprints[0]!.id).toBe(sprint1Id);
        expect(result.current.sprints[1]!.id).toBe(sprint2Id);
      });
    });
  });

  describe("reorderSprintTasks", () => {
    it("should reorder sprint tasks", () => {
      const mockTasks = createMockTasks([0, 2, 1]);
      const { result } = renderHook(() => useSessionPlanner(mockTasks));

      // Initialize a sprint with the tasks
      act(() =>
        result.current.addSprint({
          tasks: mockTasks.map((task) => ({ taskId: task.id })),
        }),
      );

      expect(result.current.sprints[0]!.tasks).toHaveLength(3);
      expect(result.current.sprints[0]!.tasks[0]!.id).toBe(mockTasks[0]!.id);
      expect(result.current.sprints[0]!.tasks[1]!.id).toBe(mockTasks[1]!.id);
      expect(result.current.sprints[0]!.tasks[2]!.id).toBe(mockTasks[2]!.id);

      // Reorder tasks
      act(() =>
        result.current.reorderSprintTasks(result.current.sprints[0]!.id, [
          mockTasks[1]!.id,
          mockTasks[0]!.id,
          mockTasks[2]!.id,
        ]),
      );

      // Check new order
      expect(result.current.sprints[0]!.tasks).toHaveLength(3);
      expect(result.current.sprints[0]!.tasks[0]!.id).toBe(mockTasks[1]!.id);
      expect(result.current.sprints[0]!.tasks[1]!.id).toBe(mockTasks[0]!.id);
      expect(result.current.sprints[0]!.tasks[2]!.id).toBe(mockTasks[2]!.id);
    });

    it("should ignore additional IDs", () => {
      const mockTasks = createMockTasks([0, 2, 1]);
      const { result } = renderHook(() => useSessionPlanner(mockTasks));

      act(() =>
        result.current.addSprint({
          tasks: mockTasks.map((task) => ({ taskId: task.id })),
        }),
      );

      act(() =>
        result.current.reorderSprintTasks(result.current.sprints[0]!.id, [
          mockTasks[2]!.id,
          "non-existent-id",
          mockTasks[1]!.id,
          mockTasks[0]!.id,
        ]),
      );

      expect(result.current.sprints[0]!.tasks).toEqual([
        mockTasks[2],
        mockTasks[1],
        mockTasks[0],
      ]);
    });

    describe("with inexistent sprint ID", () => {
      it("should log an error", () => {
        const mockOnError = vi.fn();
        const mockTasks = createMockTasks([0, 2, 1]);
        const { result } = renderHook(() =>
          useSessionPlanner(mockTasks, {
            initialSprints: 2,
            onError: mockOnError,
          }),
        );

        // Initialize a sprint with the tasks
        act(() =>
          result.current.addSprint({
            tasks: mockTasks.map((task) => ({ taskId: task.id })),
          }),
        );

        // Try to reorder with only some of the sprint IDs (missing one)
        act(() =>
          result.current.reorderSprintTasks("non-existent-id", [
            mockTasks[0]!.id,
            mockTasks[1]!.id,
            mockTasks[2]!.id,
          ]),
        );

        // Error should be logged
        expect(mockOnError).toHaveBeenCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "SPRINT_NOT_FOUND",
            action: "reorderSprintTasks",
            details: {
              sprintId: "non-existent-id",
            },
          }),
        );
      });

      it("should not update any state", () => {
        const mockOnError = vi.fn();
        const mockTasks = createMockTasks([0, 2, 1]);
        const { result } = renderHook(() =>
          useSessionPlanner(mockTasks, { onError: mockOnError }),
        );

        // Initialize a sprint with the tasks
        act(() =>
          result.current.addSprint({
            tasks: mockTasks.map((task) => ({ taskId: task.id })),
          }),
        );

        const prevTasks = result.current.sprints[0]!.tasks;

        // Try to reorder with only some of the sprint IDs (missing one)
        act(() =>
          result.current.reorderSprintTasks("non-existent-id", [
            mockTasks[1]!.id,
            mockTasks[0]!.id,
            mockTasks[2]!.id,
          ]),
        );

        // State should remain unchanged
        expect(result.current.sprints[0]!.tasks).toStrictEqual(prevTasks);
      });
    });

    describe("with missing task IDs", () => {
      it("should log errors", () => {
        const mockOnError = vi.fn();
        const mockTasks = createMockTasks([0, 2, 1]);

        const { result } = renderHook(() =>
          useSessionPlanner(mockTasks, { onError: mockOnError }),
        );

        act(() =>
          result.current.addSprint({
            tasks: mockTasks.map((task) => ({ taskId: task.id })),
          }),
        );

        act(() =>
          result.current.reorderSprintTasks(result.current.sprints[0]!.id, [
            mockTasks[0]!.id,
          ]),
        );

        expect(mockOnError).toHaveBeenCalledTimes(2);
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "TASK_NOT_PROVIDED",
            action: "reorderSprintTasks",
            details: {
              sprintId: result.current.sprints[0]!.id,
              taskId: mockTasks[1]!.id,
            },
          }),
        );
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "TASK_NOT_PROVIDED",
            action: "reorderSprintTasks",
            details: {
              sprintId: result.current.sprints[0]!.id,
              taskId: mockTasks[2]!.id,
            },
          }),
        );
      });

      it("should not update state", () => {
        const mockTasks = createMockTasks([0, 2, 1]);
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        act(() =>
          result.current.addSprint({
            tasks: mockTasks.map((task) => ({ taskId: task.id })),
          }),
        );

        const prevTasks = result.current.sprints[0]!.tasks;

        act(() =>
          result.current.reorderSprintTasks(result.current.sprints[0]!.id, [
            mockTasks[0]!.id,
          ]),
        );

        expect(result.current.sprints[0]!.tasks).toStrictEqual(prevTasks);
      });
    });
  });

  describe("dropSprint", () => {
    it("should remove a sprint", () => {
      const { result } = renderHook(() =>
        useSessionPlanner([], { initialSprints: 3 }),
      );

      expect(result.current.sprints).toHaveLength(3);

      // Get the ID of the sprint to drop
      const sprintIdToDrop = result.current.sprints[1]!.id;

      act(() => result.current.dropSprint(sprintIdToDrop));

      expect(result.current.sprints).toHaveLength(2);

      // The dropped sprint should no longer exist
      const droppedSprint = result.current.sprints.find(
        (sprint) => sprint.id === sprintIdToDrop,
      );
      expect(droppedSprint).toBeUndefined();
    });

    it("should move its tasks to the unassigned tasks", () => {
      const mockTasks = createMockTasks([0, 2, 1]);

      const { result } = renderHook(() => useSessionPlanner(mockTasks));

      act(() =>
        result.current.addSprint({
          tasks: [{ taskId: mockTasks[0]!.id }, { taskId: mockTasks[1]!.id }],
        }),
      );

      // Verify tasks are assigned to the sprint
      expect(result.current.sprints).toHaveLength(1);
      expect(result.current.sprints[0]!.tasks).toHaveLength(2);

      // Initially one task is unassigned
      expect(result.current.unassignedTasks).toHaveLength(1);

      // Get the ID of the sprint to drop
      const sprintIdToDrop = result.current.sprints[0]!.id;

      // Drop the sprint
      act(() => result.current.dropSprint(sprintIdToDrop));

      // Sprint should be removed
      expect(result.current.sprints).toHaveLength(0);

      // All tasks should now be unassigned
      expect(result.current.unassignedTasks).toHaveLength(3);

      // Check all tasks are present in unassigned tasks
      expect(result.current.unassignedTasks.map((task) => task.id)).toEqual(
        expect.arrayContaining([
          mockTasks[0]!.id,
          mockTasks[1]!.id,
          mockTasks[2]!.id,
        ]),
      );
    });

    it("should merge overlapping unassigned tasks", () => {
      // Create mock tasks with subtasks
      const mockTasks = createMockTasks([3, 2]);

      // Initialize sprints and assign tasks to them
      const { result } = renderHook(() => useSessionPlanner(mockTasks));

      // Add a sprint with assigned tasks, including partial subtasks
      act(() =>
        result.current.addSprint({
          tasks: [
            {
              taskId: mockTasks[0]!.id,
              subtasks: [
                mockTasks[0]!.subtasks![0]!.id,
                mockTasks[0]!.subtasks![1]!.id,
              ],
            },
          ],
        }),
      );

      // Verify tasks are assigned to the sprint
      expect(result.current.sprints).toHaveLength(1);
      expect(result.current.sprints[0]!.tasks).toHaveLength(1);

      // Some subtasks of task 0 should still be in unassigned
      const unassignedBeforeDrop = result.current.unassignedTasks;
      expect(unassignedBeforeDrop).toHaveLength(2); // Task 1 and partial Task 0

      // One of the unassigned tasks should be task 0 with remaining subtasks
      const task0InUnassigned = unassignedBeforeDrop.find(
        (task) => task.id === mockTasks[0]!.id,
      );
      expect(task0InUnassigned).toBeDefined();
      if (task0InUnassigned && task0InUnassigned.subtasks) {
        expect(task0InUnassigned.subtasks).toHaveLength(1); // Only one subtask remains unassigned
      }

      // Get the ID of the sprint to drop
      const sprintIdToDrop = result.current.sprints[0]!.id;

      // Drop the sprint
      act(() => result.current.dropSprint(sprintIdToDrop));

      // Sprint should be removed
      expect(result.current.sprints).toHaveLength(0);

      // All tasks should now be unassigned
      expect(result.current.unassignedTasks).toHaveLength(2);

      // Task 0 should now have all its subtasks merged
      const mergedTask0 = result.current.unassignedTasks.find(
        (task) => task.id === mockTasks[0]!.id,
      );
      expect(mergedTask0).toBeDefined();
      if (mergedTask0 && mergedTask0.subtasks) {
        expect(mergedTask0.subtasks).toHaveLength(3); // All 3 subtasks should be present
      }
    });

    describe("with inexistent sprint ID", () => {
      it("should not log an error because dropSprint doesn't validate IDs", () => {
        const mockOnError = vi.fn();
        const { result } = renderHook(() =>
          useSessionPlanner([], { initialSprints: 2, onError: mockOnError }),
        );

        // Drop a non-existent sprint ID
        const nonExistentId = "non-existent-id";
        act(() => result.current.dropSprint(nonExistentId));

        // No error should be logged because dropSprint doesn't validate IDs
        expect(mockOnError).not.toHaveBeenCalled();
      });

      it("should not update state when using an ID that doesn't match any sprint", () => {
        const { result } = renderHook(() =>
          useSessionPlanner([], { initialSprints: 2 }),
        );

        expect(result.current.sprints).toHaveLength(2);

        // Get original sprint IDs for comparison later
        const originalSprintIds = result.current.sprints.map(
          (sprint) => sprint.id,
        );

        // Drop a non-existent sprint ID
        act(() => result.current.dropSprint("non-existent-id"));

        // Length should remain the same
        expect(result.current.sprints).toHaveLength(2);

        // The same sprints should still be there (by ID)
        const remainingSprintIds = result.current.sprints.map(
          (sprint) => sprint.id,
        );
        expect(remainingSprintIds).toEqual(originalSprintIds);
      });
    });
  });

  describe("assignTask", () => {
    describe("without subtasks", () => {
      it("should assign it to a sprint", () => {
        // Create mock tasks without subtasks
        const mockTasks = createMockTasks([0, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));
        expect(result.current.sprints).toHaveLength(1);

        const sprintId = result.current.sprints[0]!.id;
        const taskId = mockTasks[0]!.id;

        // Initially the task is unassigned
        expect(result.current.sprints[0]!.tasks).toHaveLength(0);

        // Assign task to sprint
        act(() => result.current.assignTask({ sprintId, task: { taskId } }));

        // Verify the task is assigned to the sprint
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        expect(result.current.sprints[0]!.tasks![0]).toEqual(
          expect.objectContaining({ id: taskId }),
        );
      });

      it("should remove it from the unassigned tasks", () => {
        // Create mock tasks
        const mockTasks = createMockTasks([0, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        // Initially all tasks are unassigned
        expect(result.current.unassignedTasks).toHaveLength(2);

        const sprintId = result.current.sprints[0]!.id;
        const taskId = mockTasks[0]!.id;

        // Assign task to sprint
        act(() => result.current.assignTask({ sprintId, task: { taskId } }));

        // Verify the task was removed from unassigned tasks
        expect(result.current.unassignedTasks).toHaveLength(1);
        expect(result.current.unassignedTasks[0]!.id).toBe(mockTasks[1]!.id);
      });
    });

    describe("with all subtasks", () => {
      it("should assign it to a sprint", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([2, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;
        const taskId = mockTasks[0]!.id;

        // Assign task with all subtasks
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: [
              {
                taskId,
                subtasks: mockTasks[0]!.subtasks!.map((s) => s.id),
              },
            ],
          }),
        );

        // Verify the task is assigned to the sprint with all subtasks
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        const assignedTask = result.current.sprints[0]!.tasks![0]!;
        expect(assignedTask.id).toBe(mockTasks[0]!.id);
        expect(assignedTask.subtasks).toHaveLength(2);
      });

      it("should remove it from the unassigned tasks", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([2, 1]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        // Initially all tasks are unassigned
        expect(result.current.unassignedTasks).toHaveLength(2);

        const sprintId = result.current.sprints[0]!.id;
        const taskId = mockTasks[0]!.id;

        // Assign task with all subtasks
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: [
              {
                taskId,
                subtasks: mockTasks[0]!.subtasks!.map((s) => s.id),
              },
            ],
          }),
        );

        // Verify the task was removed from unassigned tasks
        expect(result.current.unassignedTasks).toHaveLength(1);
        expect(result.current.unassignedTasks[0]!.id).toBe(mockTasks[1]!.id);
      });
    });

    describe("with some subtasks", () => {
      it("should assign it to a sprint", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([3, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;
        const taskId = mockTasks[0]!.id;

        // Only assign some subtasks (first 2 out of 3)
        const subtasksToAssign = [
          mockTasks[0]!.subtasks![0]!.id,
          mockTasks[0]!.subtasks![1]!.id,
        ];

        // Assign task with selected subtasks
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: [
              {
                taskId,
                subtasks: subtasksToAssign,
              },
            ],
          }),
        );

        // Verify the task is assigned to the sprint with selected subtasks
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        const assignedTask = result.current.sprints[0]!.tasks![0]!;
        expect(assignedTask.id).toBe(mockTasks[0]!.id);
        expect(assignedTask.subtasks).toHaveLength(2);
      });

      it("should merge its subtasks when sprint has overlapping tasks", () => {
        const mockTasks = createMockTasks([3, 0]);
        const { result } = renderHook(() =>
          useSessionPlanner(mockTasks, {
            initialSprints: 1,
          }),
        );
        const sprintId = result.current.sprints[0]!.id;

        // First assign subtask 0
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: [
              {
                taskId: mockTasks[0]!.id,
                subtasks: [mockTasks[0]!.subtasks![0]!.id],
              },
            ],
          }),
        );

        // Verify first assignment
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        expect(result.current.sprints[0]!.tasks![0]!.subtasks).toHaveLength(1);

        // Now assign subtasks 1 and 2
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: [
              {
                taskId: mockTasks[0]!.id,
                subtasks: [
                  mockTasks[0]!.subtasks![1]!.id,
                  mockTasks[0]!.subtasks![2]!.id,
                ],
              },
            ],
          }),
        );

        // Verify subtasks were merged
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        const taskWithMergedSubtasks = result.current.sprints[0]!.tasks![0]!;

        if (taskWithMergedSubtasks?.subtasks) {
          expect(taskWithMergedSubtasks.subtasks).toHaveLength(3);
          // All subtask IDs should be present
          const allSubtaskIds = mockTasks[0]!.subtasks!.map((s) => s.id);
          expect(taskWithMergedSubtasks.subtasks.map((s) => s.id)).toEqual(
            expect.arrayContaining(allSubtaskIds),
          );
        }
      });

      it("should remove its assigned subtasks from the unassigned tasks", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([3, 2, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;

        // Only assign some subtasks from each task
        const tasksToAssign = [
          {
            taskId: mockTasks[0]!.id,
            subtasks: [
              mockTasks[0]!.subtasks![0]!.id,
              mockTasks[0]!.subtasks![1]!.id,
            ],
          },
          {
            taskId: mockTasks[1]!.id,
            subtasks: [mockTasks[1]!.subtasks![0]!.id],
          },
        ];

        // Assign tasks with selected subtasks
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: tasksToAssign,
          }),
        );

        // Unassigned tasks should still have all tasks but with fewer subtasks
        expect(result.current.unassignedTasks).toHaveLength(3);

        // Check first task's remaining subtasks
        const task0InUnassigned = result.current.unassignedTasks.find(
          (t) => t.id === mockTasks[0]!.id,
        );
        expect(task0InUnassigned).toBeDefined();
        if (task0InUnassigned && task0InUnassigned.subtasks) {
          // Should only have the one remaining subtask
          expect(task0InUnassigned.subtasks).toHaveLength(1);
          expect(task0InUnassigned.subtasks[0]!.id).toBe(
            mockTasks[0]!.subtasks![2]!.id,
          );
        }

        // Check second task's remaining subtasks
        const task1InUnassigned = result.current.unassignedTasks.find(
          (t) => t.id === mockTasks[1]!.id,
        );
        expect(task1InUnassigned).toBeDefined();
        if (task1InUnassigned && task1InUnassigned.subtasks) {
          expect(task1InUnassigned.subtasks).toHaveLength(1);
          expect(task1InUnassigned.subtasks[0]!.id).toBe(
            mockTasks[1]!.subtasks![1]!.id,
          );
        }

        // Now unassign the first subtask of task 0
        act(() =>
          result.current.unassignTasks({
            sprintId,
            tasks: [
              {
                taskId: mockTasks[0]!.id,
                subtasks: [mockTasks[0]!.subtasks![0]!.id],
              },
            ],
          }),
        );

        // This should update the task in the sprint by removing the subtask
        const task0InSprint = result.current.sprints[0]!.tasks.find(
          (t) => t.id === mockTasks[0]!.id,
        );
        expect(task0InSprint).toBeDefined();
        if (task0InSprint?.subtasks) {
          expect(task0InSprint.subtasks).toHaveLength(1);
          expect(task0InSprint.subtasks[0]!.id).toBe(
            mockTasks[0]!.subtasks![1]!.id,
          );
        }

        // And it should update the unassigned tasks to include the subtask
        const updatedTask0InUnassigned = result.current.unassignedTasks.find(
          (t) => t.id === mockTasks[0]!.id,
        );
        expect(updatedTask0InUnassigned).toBeDefined();
        if (updatedTask0InUnassigned?.subtasks) {
          expect(updatedTask0InUnassigned.subtasks).toHaveLength(2);
          const subtaskIds = updatedTask0InUnassigned.subtasks.map((s) => s.id);
          expect(subtaskIds).toContain(mockTasks[0]!.subtasks![0]!.id);
          expect(subtaskIds).toContain(mockTasks[0]!.subtasks![2]!.id);
        }
      });

      it("should remove the whole task from the unassigned tasks if no subtasks are remaining", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([2, 1, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;

        // Assign all subtasks from both tasks
        const tasksToAssign = [
          {
            taskId: mockTasks[0]!.id,
            subtasks: mockTasks[0]!.subtasks!.map((s) => s.id),
          },
          {
            taskId: mockTasks[1]!.id,
            subtasks: mockTasks[1]!.subtasks!.map((s) => s.id),
          },
        ];

        // Initially all tasks are unassigned
        expect(result.current.unassignedTasks).toHaveLength(3);

        // Assign tasks with all their subtasks
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: tasksToAssign,
          }),
        );

        // Only the third task should remain unassigned
        expect(result.current.unassignedTasks).toHaveLength(1);
        expect(result.current.unassignedTasks[0]!.id).toBe(mockTasks[2]!.id);

        // The tasks with assigned subtasks should be completely removed
        const task0InUnassigned = result.current.unassignedTasks.find(
          (t) => t.id === mockTasks[0]!.id,
        );
        const task1InUnassigned = result.current.unassignedTasks.find(
          (t) => t.id === mockTasks[1]!.id,
        );

        expect(task0InUnassigned).toBeUndefined();
        expect(task1InUnassigned).toBeUndefined();
      });
    });

    describe("with inexistent sprint ID", () => {
      it("should log an error", () => {
        const mockOnError = vi.fn();
        const mockTasks = createMockTasks([1, 0]);

        const { result } = renderHook(() =>
          useSessionPlanner(mockTasks, { onError: mockOnError }),
        );

        const taskId = mockTasks[0]!.id;
        const nonExistentId = "non-existent-id";

        // Try to assign a task to a non-existent sprint
        act(() =>
          result.current.assignTask({
            sprintId: nonExistentId,
            task: { taskId },
          }),
        );

        // Error should be logged
        expect(mockOnError).toHaveBeenCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "SPRINT_NOT_FOUND",
            action: "assignTask",
            details: expect.objectContaining({
              sprintId: nonExistentId,
            }),
          }),
        );
      });

      it("should not update any state", () => {
        const mockTasks = createMockTasks([1, 0]);

        // Initialize hook with tasks and a sprint
        const { result } = renderHook(() => useSessionPlanner(mockTasks));
        act(() => result.current.addSprint({}));

        // Capture initial state
        const initialSprints = result.current.sprints;
        const initialUnassignedTasks = result.current.unassignedTasks;

        // Try to assign a task to a non-existent sprint
        act(() =>
          result.current.assignTask({
            sprintId: "non-existent-id",
            task: { taskId: mockTasks[0]!.id },
          }),
        );

        // State should not change
        expect(result.current.sprints).toStrictEqual(initialSprints);
        expect(result.current.unassignedTasks).toStrictEqual(
          initialUnassignedTasks,
        );
      });
    });

    describe.skip("with inexistent task ID", () => {
      it("should log an error", () => {
        const mockOnError = vi.fn();
        const mockTasks = createMockTasks([1, 0]);

        const { result } = renderHook(() =>
          useSessionPlanner(mockTasks, { onError: mockOnError }),
        );

        // Add a sprint
        act(() => result.current.addSprint({}));
        const sprintId = result.current.sprints[0]!.id;

        const nonExistentTaskId = "non-existent-task-id";

        // Try to assign a non-existent task
        act(() =>
          result.current.assignTask({
            sprintId,
            task: { taskId: nonExistentTaskId },
          }),
        );

        // Error should be logged
        expect(mockOnError).toHaveBeenCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "TASK_NOT_FOUND",
            action: "assignTask",
            details: expect.objectContaining({
              taskId: nonExistentTaskId,
            }),
          }),
        );
      });

      it("should not update any state", () => {
        const mockTasks = createMockTasks([1, 0]);

        // Initialize hook with tasks and a sprint
        const { result } = renderHook(() => useSessionPlanner(mockTasks));
        act(() => result.current.addSprint({}));

        // Capture initial state
        const initialSprints = result.current.sprints;
        const initialUnassignedTasks = result.current.unassignedTasks;

        // Try to assign a non-existent task
        act(() =>
          result.current.assignTask({
            sprintId: result.current.sprints[0]!.id,
            task: { taskId: "non-existent-task-id" },
          }),
        );

        // State should not change
        expect(result.current.sprints).toStrictEqual(initialSprints);
        expect(result.current.unassignedTasks).toStrictEqual(
          initialUnassignedTasks,
        );
      });
    });

    describe.skip("with inexistent subtask ID", () => {
      it("should log an error", () => {
        const mockOnError = vi.fn();
        const mockTasks = createMockTasks([2, 0]);

        const { result } = renderHook(() =>
          useSessionPlanner(mockTasks, { onError: mockOnError }),
        );

        // Add a sprint
        act(() => result.current.addSprint({}));
        const sprintId = result.current.sprints[0]!.id;

        const taskId = mockTasks[0]!.id;
        const nonExistentSubtaskId = "non-existent-subtask-id";

        // Try to assign a task with a non-existent subtask
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: [
              {
                taskId,
                subtasks: [nonExistentSubtaskId],
              },
            ],
          }),
        );

        // Error should be logged
        expect(mockOnError).toHaveBeenCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "SUBTASK_NOT_FOUND",
            action: "assignTasks",
            details: expect.objectContaining({
              subtaskId: nonExistentSubtaskId,
            }),
          }),
        );
      });

      it("should not update any state", () => {
        const mockTasks = createMockTasks([2, 0]);

        // Initialize hook with tasks and a sprint
        const { result } = renderHook(() => useSessionPlanner(mockTasks));
        act(() => result.current.addSprint({}));

        // Capture initial state
        const initialSprints = result.current.sprints;
        const initialUnassignedTasks = result.current.unassignedTasks;

        // Try to assign a task with a non-existent subtask
        act(() =>
          result.current.assignTasks({
            sprintId: result.current.sprints[0]!.id,
            tasks: [
              {
                taskId: mockTasks[0]!.id,
                subtasks: ["non-existent-subtask-id"],
              },
            ],
          }),
        );

        // State should not change
        expect(result.current.sprints).toStrictEqual(initialSprints);
        expect(result.current.unassignedTasks).toStrictEqual(
          initialUnassignedTasks,
        );
      });
    });
  });

  describe("assignTasks", () => {
    describe("without subtask", () => {
      it("should assign them to a sprint", () => {
        // Create mock tasks without subtasks
        const mockTasks = createMockTasks([0, 0, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));
        expect(result.current.sprints).toHaveLength(1);

        const sprintId = result.current.sprints[0]!.id;

        // Select two tasks to assign
        const tasksToAssign = [
          { taskId: mockTasks[0]!.id },
          { taskId: mockTasks[1]!.id },
        ];

        // Initially the sprint has no tasks
        expect(result.current.sprints[0]!.tasks).toHaveLength(0);

        // Assign multiple tasks to sprint
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: tasksToAssign,
          }),
        );

        // Verify the tasks are assigned to the sprint
        expect(result.current.sprints[0]!.tasks).toHaveLength(2);
        expect(
          result.current.sprints[0]!.tasks!.map((task) => task.id),
        ).toEqual(expect.arrayContaining([mockTasks[0]!.id, mockTasks[1]!.id]));
      });

      it("should remove them from the unassigned tasks", () => {
        // Create mock tasks without subtasks
        const mockTasks = createMockTasks([0, 0, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;

        // Initially all tasks are unassigned
        expect(result.current.unassignedTasks).toHaveLength(3);

        // Select two tasks to assign
        const tasksToAssign = [
          { taskId: mockTasks[0]!.id },
          { taskId: mockTasks[1]!.id },
        ];

        // Assign multiple tasks to sprint
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: tasksToAssign,
          }),
        );

        // Verify only one task remains unassigned
        expect(result.current.unassignedTasks).toHaveLength(1);
        expect(result.current.unassignedTasks[0]!.id).toBe(mockTasks[2]!.id);
      });
    });

    describe("with all subtask", () => {
      it("should assign them to a sprint", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([2, 3, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;

        // Select two tasks with all their subtasks
        const tasksToAssign = [
          {
            taskId: mockTasks[0]!.id,
            subtasks: mockTasks[0]!.subtasks!.map((s) => s.id),
          },
          {
            taskId: mockTasks[1]!.id,
            subtasks: mockTasks[1]!.subtasks!.map((s) => s.id),
          },
        ];

        // Assign tasks with all subtasks
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: tasksToAssign,
          }),
        );

        // Verify the tasks are assigned to the sprint
        expect(result.current.sprints[0]!.tasks).toHaveLength(2);

        // Check first task
        const firstTask = result.current.sprints[0]!.tasks!.find(
          (t) => t.id === mockTasks[0]!.id,
        );
        expect(firstTask).toBeDefined();
        expect(firstTask?.subtasks).toHaveLength(2);

        // Check second task
        const secondTask = result.current.sprints[0]!.tasks!.find(
          (t) => t.id === mockTasks[1]!.id,
        );
        expect(secondTask).toBeDefined();
        expect(secondTask?.subtasks).toHaveLength(3);
      });

      it("should remove them from the unassigned tasks", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([2, 3, 1]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;

        // Initially all tasks are unassigned
        expect(result.current.unassignedTasks).toHaveLength(3);

        // Select two tasks with all their subtasks
        const tasksToAssign = [
          {
            taskId: mockTasks[0]!.id,
            subtasks: mockTasks[0]!.subtasks!.map((s) => s.id),
          },
          {
            taskId: mockTasks[1]!.id,
            subtasks: mockTasks[1]!.subtasks!.map((s) => s.id),
          },
        ];

        // Assign tasks with all subtasks
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: tasksToAssign,
          }),
        );

        // Verify only one task remains unassigned
        expect(result.current.unassignedTasks).toHaveLength(1);
        expect(result.current.unassignedTasks[0]!.id).toBe(mockTasks[2]!.id);
      });
    });

    describe("with some subtask", () => {
      it("should assign them to a sprint", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([3, 2, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;

        // Select some subtasks from each task
        const tasksToAssign = [
          {
            taskId: mockTasks[0]!.id,
            subtasks: [
              mockTasks[0]!.subtasks![0]!.id,
              mockTasks[0]!.subtasks![1]!.id,
            ],
          },
          {
            taskId: mockTasks[1]!.id,
            subtasks: [mockTasks[1]!.subtasks![0]!.id],
          },
        ];

        // Assign tasks with selected subtasks
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: tasksToAssign,
          }),
        );

        // Verify the tasks are assigned to the sprint
        expect(result.current.sprints[0]!.tasks).toHaveLength(2);

        // Check first task's subtasks
        const firstTask = result.current.sprints[0]!.tasks!.find(
          (t) => t.id === mockTasks[0]!.id,
        );
        expect(firstTask).toBeDefined();
        expect(firstTask?.subtasks).toHaveLength(2);

        // Check second task's subtasks
        const secondTask = result.current.sprints[0]!.tasks!.find(
          (t) => t.id === mockTasks[1]!.id,
        );
        expect(secondTask).toBeDefined();
        expect(secondTask?.subtasks).toHaveLength(1);
      });

      it("should merge their subtasks when sprint has overlapping tasks", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([3, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;
        const taskId = mockTasks[0]!.id;

        // First assign subtask 0
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: [
              {
                taskId,
                subtasks: [mockTasks[0]!.subtasks![0]!.id],
              },
            ],
          }),
        );

        // Verify first assignment
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        expect(result.current.sprints[0]!.tasks![0]!.subtasks).toHaveLength(1);

        // Now assign subtasks 1 and 2
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: [
              {
                taskId,
                subtasks: [
                  mockTasks[0]!.subtasks![1]!.id,
                  mockTasks[0]!.subtasks![2]!.id,
                ],
              },
            ],
          }),
        );

        // Verify subtasks were merged
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        const taskWithMergedSubtasks = result.current.sprints[0]!.tasks![0]!;

        if (taskWithMergedSubtasks?.subtasks) {
          expect(taskWithMergedSubtasks.subtasks).toHaveLength(3);
          // All subtask IDs should be present
          const allSubtaskIds = mockTasks[0]!.subtasks!.map((s) => s.id);
          expect(taskWithMergedSubtasks.subtasks.map((s) => s.id)).toEqual(
            expect.arrayContaining(allSubtaskIds),
          );
        }
      });

      it("should remove its assigned subtasks from the unassigned tasks", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([3, 2, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;

        // Only assign some subtasks from each task
        const tasksToAssign = [
          {
            taskId: mockTasks[0]!.id,
            subtasks: [
              mockTasks[0]!.subtasks![0]!.id,
              mockTasks[0]!.subtasks![1]!.id,
            ],
          },
          {
            taskId: mockTasks[1]!.id,
            subtasks: [mockTasks[1]!.subtasks![0]!.id],
          },
        ];

        // Assign tasks with selected subtasks
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: tasksToAssign,
          }),
        );

        // Unassigned tasks should still have all tasks but with fewer subtasks
        expect(result.current.unassignedTasks).toHaveLength(3);

        // Check first task's remaining subtasks
        const task0InUnassigned = result.current.unassignedTasks.find(
          (t) => t.id === mockTasks[0]!.id,
        );
        expect(task0InUnassigned).toBeDefined();
        if (task0InUnassigned && task0InUnassigned.subtasks) {
          // Should only have the one remaining subtask
          expect(task0InUnassigned.subtasks).toHaveLength(1);
          expect(task0InUnassigned.subtasks[0]!.id).toBe(
            mockTasks[0]!.subtasks![2]!.id,
          );
        }

        // Check second task's remaining subtasks
        const task1InUnassigned = result.current.unassignedTasks.find(
          (t) => t.id === mockTasks[1]!.id,
        );
        expect(task1InUnassigned).toBeDefined();
        if (task1InUnassigned && task1InUnassigned.subtasks) {
          expect(task1InUnassigned.subtasks).toHaveLength(1);
          expect(task1InUnassigned.subtasks[0]!.id).toBe(
            mockTasks[1]!.subtasks![1]!.id,
          );
        }

        // Now unassign the first subtask of task 0
        act(() =>
          result.current.unassignTasks({
            sprintId,
            tasks: [
              {
                taskId: mockTasks[0]!.id,
                subtasks: [mockTasks[0]!.subtasks![0]!.id],
              },
            ],
          }),
        );

        // This should update the task in the sprint by removing the subtask
        const task0InSprint = result.current.sprints[0]!.tasks.find(
          (t) => t.id === mockTasks[0]!.id,
        );
        expect(task0InSprint).toBeDefined();
        if (task0InSprint?.subtasks) {
          expect(task0InSprint.subtasks).toHaveLength(1);
          expect(task0InSprint.subtasks[0]!.id).toBe(
            mockTasks[0]!.subtasks![1]!.id,
          );
        }

        // And it should update the unassigned tasks to include the subtask
        const updatedTask0InUnassigned = result.current.unassignedTasks.find(
          (t) => t.id === mockTasks[0]!.id,
        );
        expect(updatedTask0InUnassigned).toBeDefined();
        if (updatedTask0InUnassigned?.subtasks) {
          expect(updatedTask0InUnassigned.subtasks).toHaveLength(2);
          const subtaskIds = updatedTask0InUnassigned.subtasks.map((s) => s.id);
          expect(subtaskIds).toContain(mockTasks[0]!.subtasks![0]!.id);
          expect(subtaskIds).toContain(mockTasks[0]!.subtasks![2]!.id);
        }
      });

      it("should remove the whole task from the unassigned tasks if no subtasks are remaining", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([2, 1, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;

        // Assign all subtasks from both tasks
        const tasksToAssign = [
          {
            taskId: mockTasks[0]!.id,
            subtasks: mockTasks[0]!.subtasks!.map((s) => s.id),
          },
          {
            taskId: mockTasks[1]!.id,
            subtasks: mockTasks[1]!.subtasks!.map((s) => s.id),
          },
        ];

        // Initially all tasks are unassigned
        expect(result.current.unassignedTasks).toHaveLength(3);

        // Assign tasks with all their subtasks
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: tasksToAssign,
          }),
        );

        // Only the third task should remain unassigned
        expect(result.current.unassignedTasks).toHaveLength(1);
        expect(result.current.unassignedTasks[0]!.id).toBe(mockTasks[2]!.id);

        // The tasks with assigned subtasks should be completely removed
        const task0InUnassigned = result.current.unassignedTasks.find(
          (t) => t.id === mockTasks[0]!.id,
        );
        const task1InUnassigned = result.current.unassignedTasks.find(
          (t) => t.id === mockTasks[1]!.id,
        );

        expect(task0InUnassigned).toBeUndefined();
        expect(task1InUnassigned).toBeUndefined();
      });
    });

    describe("with inexistent sprint ID", () => {
      it("should log an error", () => {
        const mockOnError = vi.fn();
        const mockTasks = createMockTasks([1, 0]);

        const { result } = renderHook(() =>
          useSessionPlanner(mockTasks, { onError: mockOnError }),
        );

        const taskId = mockTasks[0]!.id;
        const nonExistentId = "non-existent-id";

        // Try to assign tasks to a non-existent sprint
        act(() =>
          result.current.assignTasks({
            sprintId: nonExistentId,
            tasks: [{ taskId }],
          }),
        );

        // Error should be logged
        expect(mockOnError).toHaveBeenCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "SPRINT_NOT_FOUND",
            action: "assignTasks",
            details: expect.objectContaining({
              sprintId: nonExistentId,
            }),
          }),
        );
      });

      it("should not update any state", () => {
        const mockTasks = createMockTasks([1, 0]);

        // Initialize hook with tasks and a sprint
        const { result } = renderHook(() => useSessionPlanner(mockTasks));
        act(() => result.current.addSprint({}));

        // Capture initial state
        const initialSprints = result.current.sprints;
        const initialUnassignedTasks = result.current.unassignedTasks;

        // Try to assign tasks to a non-existent sprint
        act(() =>
          result.current.assignTasks({
            sprintId: "non-existent-id",
            tasks: [{ taskId: mockTasks[0]!.id }],
          }),
        );

        // State should not change
        expect(result.current.sprints).toStrictEqual(initialSprints);
        expect(result.current.unassignedTasks).toStrictEqual(
          initialUnassignedTasks,
        );
      });
    });

    describe.skip("with inexistent task ID", () => {
      it("should log an error", () => {
        const mockOnError = vi.fn();
        const mockTasks = createMockTasks([1, 0]);

        const { result } = renderHook(() =>
          useSessionPlanner(mockTasks, { onError: mockOnError }),
        );

        // Add a sprint
        act(() => result.current.addSprint({}));
        const sprintId = result.current.sprints[0]!.id;

        const nonExistentTaskId = "non-existent-task-id";

        // Try to assign a non-existent task
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: [{ taskId: nonExistentTaskId }],
          }),
        );

        // Error should be logged
        expect(mockOnError).toHaveBeenCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "TASK_NOT_FOUND",
            action: "assignTasks",
            details: expect.objectContaining({
              taskId: nonExistentTaskId,
            }),
          }),
        );
      });

      it("should not update any state", () => {
        const mockTasks = createMockTasks([1, 0]);

        // Initialize hook with tasks and a sprint
        const { result } = renderHook(() => useSessionPlanner(mockTasks));
        act(() => result.current.addSprint({}));

        // Capture initial state
        const initialSprints = result.current.sprints;
        const initialUnassignedTasks = result.current.unassignedTasks;

        // Try to assign a non-existent task
        act(() =>
          result.current.assignTasks({
            sprintId: result.current.sprints[0]!.id,
            tasks: [{ taskId: "non-existent-task-id" }],
          }),
        );

        // State should not change
        expect(result.current.sprints).toStrictEqual(initialSprints);
        expect(result.current.unassignedTasks).toStrictEqual(
          initialUnassignedTasks,
        );
      });
    });

    describe.skip("with inexistent subtask ID", () => {
      it("should log an error", () => {
        const mockOnError = vi.fn();
        const mockTasks = createMockTasks([2, 0]);

        const { result } = renderHook(() =>
          useSessionPlanner(mockTasks, { onError: mockOnError }),
        );

        // Add a sprint
        act(() => result.current.addSprint({}));
        const sprintId = result.current.sprints[0]!.id;

        const taskId = mockTasks[0]!.id;
        const nonExistentSubtaskId = "non-existent-subtask-id";

        // Try to assign a task with a non-existent subtask
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: [
              {
                taskId,
                subtasks: [nonExistentSubtaskId],
              },
            ],
          }),
        );

        // Error should be logged
        expect(mockOnError).toHaveBeenCalledTimes(1);
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "SUBTASK_NOT_FOUND",
            action: "assignTasks",
            details: expect.objectContaining({
              subtaskId: nonExistentSubtaskId,
            }),
          }),
        );
      });

      it("should not update any state", () => {
        const mockTasks = createMockTasks([2, 0]);

        // Initialize hook with tasks and a sprint
        const { result } = renderHook(() => useSessionPlanner(mockTasks));
        act(() => result.current.addSprint({}));

        // Capture initial state
        const initialSprints = result.current.sprints;
        const initialUnassignedTasks = result.current.unassignedTasks;

        // Try to assign a task with a non-existent subtask
        act(() =>
          result.current.assignTasks({
            sprintId: result.current.sprints[0]!.id,
            tasks: [
              {
                taskId: mockTasks[0]!.id,
                subtasks: ["non-existent-subtask-id"],
              },
            ],
          }),
        );

        // State should not change
        expect(result.current.sprints).toStrictEqual(initialSprints);
        expect(result.current.unassignedTasks).toStrictEqual(
          initialUnassignedTasks,
        );
      });
    });
  });

  describe("unassignTask", () => {
    describe("without subtasks", () => {
      it("should remove it from the sprint", () => {
        // Create mock tasks without subtasks
        const mockTasks = createMockTasks([0, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint with one task
        act(() =>
          result.current.addSprint({
            tasks: [{ taskId: mockTasks[0]!.id }],
          }),
        );

        // Verify the task is in the sprint
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        expect(result.current.sprints[0]!.tasks![0]!.id).toBe(mockTasks[0]!.id);

        // Unassign the task
        act(() =>
          result.current.unassignTask({
            sprintId: result.current.sprints[0]!.id,
            task: { taskId: mockTasks[0]!.id },
          }),
        );

        // Verify the task is removed from the sprint
        expect(result.current.sprints[0]!.tasks).toHaveLength(0);
      });

      it("should add it to the unassigned tasks", () => {
        // Create mock tasks without subtasks
        const mockTasks = createMockTasks([0, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;

        // Initially all tasks are unassigned
        expect(result.current.unassignedTasks).toHaveLength(2);

        // Select two tasks to assign
        const tasksToAssign = [
          { taskId: mockTasks[0]!.id },
          { taskId: mockTasks[1]!.id },
        ];

        // Assign multiple tasks to sprint
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: tasksToAssign,
          }),
        );

        // Verify tasks are no longer unassigned
        expect(result.current.unassignedTasks).toHaveLength(0);

        // Now unassign one of the tasks
        act(() =>
          result.current.unassignTasks({
            sprintId,
            tasks: [{ taskId: mockTasks[0]!.id }],
          }),
        );

        // Verify one task is now unassigned again
        expect(result.current.unassignedTasks).toHaveLength(1);
        expect(result.current.unassignedTasks[0]!.id).toBe(mockTasks[0]!.id);
      });
    });

    describe("with all its subtasks", () => {
      it("should remove it from the sprint", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([2, 1]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint with one task and all its subtasks
        act(() =>
          result.current.addSprint({
            tasks: [
              {
                taskId: mockTasks[0]!.id,
                subtasks: mockTasks[0]!.subtasks!.map((s) => s.id),
              },
            ],
          }),
        );

        // Verify the task is in the sprint with all subtasks
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        expect(result.current.sprints[0]!.tasks![0]!.id).toBe(mockTasks[0]!.id);
        expect(result.current.sprints[0]!.tasks![0]!.subtasks).toHaveLength(2);

        // Unassign the task
        act(() =>
          result.current.unassignTask({
            sprintId: result.current.sprints[0]!.id,
            task: { taskId: mockTasks[0]!.id },
          }),
        );

        // Verify the task is removed from the sprint
        expect(result.current.sprints[0]!.tasks).toHaveLength(0);
      });

      it("should add it to the unassigned tasks", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([2, 1]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint with one task and all its subtasks
        act(() =>
          result.current.addSprint({
            tasks: [
              {
                taskId: mockTasks[0]!.id,
                subtasks: mockTasks[0]!.subtasks!.map((s) => s.id),
              },
            ],
          }),
        );

        // Initially, only one task is unassigned
        expect(result.current.unassignedTasks).toHaveLength(1);
        expect(result.current.unassignedTasks[0]!.id).toBe(mockTasks[1]!.id);

        // Unassign the task
        act(() =>
          result.current.unassignTask({
            sprintId: result.current.sprints[0]!.id,
            task: { taskId: mockTasks[0]!.id },
          }),
        );

        // Verify both tasks are now unassigned
        expect(result.current.unassignedTasks).toHaveLength(2);

        // Check that the first task is back with all subtasks
        const unassignedTask = result.current.unassignedTasks.find(
          (t) => t.id === mockTasks[0]!.id,
        );
        expect(unassignedTask).toBeDefined();
        expect(unassignedTask?.subtasks).toHaveLength(2);
      });
    });

    describe("with some of its subtasks remaining", () => {
      it("should remove them from the sprint", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([3, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;

        // Assign all subtasks from task 0
        const tasksToAssign = [
          {
            taskId: mockTasks[0]!.id,
            subtasks: mockTasks[0]!.subtasks!.map((s) => s.id),
          },
        ];

        // Assign tasks with selected subtasks
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: tasksToAssign,
          }),
        );

        // Verify the task is assigned to the sprint with all subtasks
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        const assignedTask = result.current.sprints[0]!.tasks[0]!;
        expect(assignedTask.id).toBe(mockTasks[0]!.id);
        expect(assignedTask.subtasks).toHaveLength(3);

        // Now unassign task 0 with just two of its subtasks
        act(() =>
          result.current.unassignTasks({
            sprintId,
            tasks: [
              {
                taskId: mockTasks[0]!.id,
                subtasks: [
                  mockTasks[0]!.subtasks![0]!.id,
                  mockTasks[0]!.subtasks![1]!.id,
                ],
              },
            ],
          }),
        );

        // Verify the task still exists but with only one subtask
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        const taskAfterUnassign = result.current.sprints[0]!.tasks[0]!;
        expect(taskAfterUnassign.id).toBe(mockTasks[0]!.id);
        expect(taskAfterUnassign.subtasks).toHaveLength(1);
        expect(taskAfterUnassign.subtasks![0]!.id).toBe(
          mockTasks[0]!.subtasks![2]!.id,
        );
      });

      it("should keep the other subtasks in the sprint", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([3, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() => result.current.addSprint({}));

        const sprintId = result.current.sprints[0]!.id;
        const taskId = mockTasks[0]!.id;

        // First assign subtask 0
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: [
              {
                taskId,
                subtasks: [mockTasks[0]!.subtasks![0]!.id],
              },
            ],
          }),
        );

        // Verify first assignment
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        expect(result.current.sprints[0]!.tasks![0]!.subtasks).toHaveLength(1);

        // Now assign subtasks 1 and 2
        act(() =>
          result.current.assignTasks({
            sprintId,
            tasks: [
              {
                taskId,
                subtasks: [
                  mockTasks[0]!.subtasks![1]!.id,
                  mockTasks[0]!.subtasks![2]!.id,
                ],
              },
            ],
          }),
        );

        // Verify subtasks were merged
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        const taskWithMergedSubtasks = result.current.sprints[0]!.tasks![0]!;

        if (taskWithMergedSubtasks?.subtasks) {
          expect(taskWithMergedSubtasks.subtasks).toHaveLength(3);
          // All subtask IDs should be present
          const allSubtaskIds = mockTasks[0]!.subtasks!.map((s) => s.id);
          expect(taskWithMergedSubtasks.subtasks.map((s) => s.id)).toEqual(
            expect.arrayContaining(allSubtaskIds),
          );
        }
      });

      it("should unassign a single subtask when a task with all subtasks is assigned", () => {
        // Create mock tasks with subtasks
        const mockTasks = createMockTasks([3, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add a sprint
        act(() =>
          result.current.addSprint({
            tasks: [
              {
                taskId: mockTasks[0]!.id,
                subtasks: mockTasks[0]!.subtasks!.map((s) => s.id),
              },
            ],
          }),
        );

        const sprintId = result.current.sprints[0]!.id;
        const taskId = mockTasks[0]!.id;

        // Verify all subtasks were assigned
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        expect(result.current.sprints[0]!.tasks[0]!.subtasks).toHaveLength(3);

        // Initially, no subtasks should be in unassigned tasks
        const unassignedTaskBefore = result.current.unassignedTasks.find(
          (t) => t.id === taskId,
        );
        expect(unassignedTaskBefore).toBeUndefined();

        // Unassign just one subtask
        const subtaskToUnassign = mockTasks[0]!.subtasks![1]!.id;
        act(() =>
          result.current.unassignTasks({
            sprintId,
            tasks: [
              {
                taskId,
                subtasks: [subtaskToUnassign],
              },
            ],
          }),
        );

        // Sprint should still have the task with two remaining subtasks
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        const taskAfterUnassign = result.current.sprints[0]!.tasks[0]!;
        expect(taskAfterUnassign.id).toBe(taskId);
        expect(taskAfterUnassign.subtasks).toHaveLength(2);

        // The unassigned subtasks should not include the unassigned one
        const remainingSubtaskIds = taskAfterUnassign.subtasks!.map(
          (s) => s.id,
        );
        expect(remainingSubtaskIds).not.toContain(subtaskToUnassign);

        // The unassigned tasks should now contain the task with only the unassigned subtask
        const unassignedTaskAfter = result.current.unassignedTasks.find(
          (t) => t.id === taskId,
        );
        expect(unassignedTaskAfter).toBeDefined();
        if (unassignedTaskAfter?.subtasks) {
          expect(unassignedTaskAfter.subtasks).toHaveLength(1);
          expect(unassignedTaskAfter.subtasks[0]!.id).toBe(subtaskToUnassign);
        }
      });
    });
  });

  describe("moveTasks", () => {
    describe("without subtasks", () => {
      it("should remove them from the source sprint", () => {
        // Create mock tasks without subtasks
        const mockTasks = createMockTasks([0, 0]);

        // Initialize hook with tasks
        const { result } = renderHook(() => useSessionPlanner(mockTasks));

        // Add two sprints
        act(() => result.current.addSprint({}));
        act(() => result.current.addSprint({}));

        const fromSprintId = result.current.sprints[0]!.id;
        const toSprintId = result.current.sprints[1]!.id;

        // Assign first task to source sprint
        act(() =>
          result.current.assignTasks({
            sprintId: fromSprintId,
            tasks: [{ taskId: mockTasks[0]!.id }],
          }),
        );

        // Initially, first task is in source sprint, second task is unassigned
        expect(result.current.sprints[0]!.tasks).toHaveLength(1);
        expect(result.current.sprints[1]!.tasks).toHaveLength(0);
        expect(result.current.unassignedTasks).toHaveLength(1);

        // Move task from first sprint to second sprint
        act(() =>
          result.current.moveTasks({
            fromSprintId,
            toSprintId,
            tasks: [{ taskId: mockTasks[0]!.id }],
          }),
        );

        // Verify task was moved
        expect(result.current.sprints).toHaveLength(2);
        expect(result.current.sprints[0]!.tasks).toHaveLength(0);
        expect(result.current.sprints[1]!.tasks).toHaveLength(1);
        // Second task is still unassigned
        expect(result.current.unassignedTasks).toHaveLength(1);
        expect(result.current.unassignedTasks[0]!.id).toBe(mockTasks[1]!.id);
      });
    });
  });

});
