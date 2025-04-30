import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { SprintPanel } from "./SprintPanel";

const meta = {
  component: SprintPanel,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Sprint 1",
    duration: { minutes: 25 },
    tasks: [
      {
        taskId: "task1",
        subtaskId: null,
        title: "Standup meeting",
      },
      {
        taskId: "task2",
        subtaskId: null,
        title: "Code review PR-123",
      },
      {
        taskId: "app",
        subtaskId: "1",
        parentTitle: "Build an app",
        title: "Gather requirements",
      },
      {
        taskId: "app",
        subtaskId: "2",
        parentTitle: "Build an app",
        title: "Design the UI",
      },
      {
        taskId: "app",
        subtaskId: "3",
        parentTitle: "Build an app",
        title: "Implement the UI",
      },
      {
        taskId: "app",
        subtaskId: "4",
        parentTitle: "Build an app",
        title: "Test the app",
      },
    ],
    disabled: false,
    canAddTasks: true,
    otherSprints: [
      { id: "2", title: "Sprint 2" },
      { id: "2", title: "Sprint 2" },
    ],
    onDrop: fn(),
    onDurationChange: fn(),
    onAddTasks: fn(),
    onUnassignTasks: fn(),
    onMoveTasks: fn(),
  },
} satisfies Meta<typeof SprintPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};

export const Empty: Story = {
  args: {
    tasks: [],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
export const EmptyAndDisabled: Story = {
  args: {
    disabled: true,
    tasks: [],
  },
};

export const NoAddTasks: Story = {
  args: {
    canAddTasks: false,
  },
};

export const NoAddTasksAndEmpty: Story = {
  args: {
    canAddTasks: false,
    tasks: [],
  },
};
