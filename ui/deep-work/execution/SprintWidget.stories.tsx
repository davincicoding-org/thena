import type { Meta, StoryObj } from "@storybook/react";
import { ComponentProps, useEffect } from "react";
import { useArgs, useState } from "@storybook/preview-api";
import { fn } from "@storybook/test";

import { SprintWidget } from "./SprintWidget";
import { useSprint } from "./useSprint";

const meta = {
  component: SprintWidget,
  parameters: {
    layout: "centered",
  },
  args: {
    duration: 60,
    warnBeforeTimeRunsOut: 10,
    timeElapsed: 0,

    onStart: fn(),
    onCompleteTask: fn(),
    onSkipTask: fn(),
    onRunTaskManually: fn(),
    onPause: fn(),
    onResume: fn(),
    onFinish: fn(),
  },
} satisfies Meta<typeof SprintWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {
  args: {
    allowToPause: true,
    tasks: [
      {
        taskId: "task1",
        subtaskId: null,
        label: "Standup meeting",
        group: undefined,
      },
      {
        taskId: "task2",
        subtaskId: null,
        label: "Code review PR-123",
        group: undefined,
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "1",
        label: "Gather requirements",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "2",
        label: "Design the UI",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "3",
        label: "Implement the UI",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "4",
        label: "Test the app",
      },
      {
        taskId: "dog",
        subtaskId: null,
        label: "Walk the dog",
        group: undefined,
      },
    ],
  },
  render: (args) => {
    const [, updateArgs] = useArgs<ComponentProps<typeof SprintWidget>>();

    useEffect(() => {
      if (args.timeElapsed === 0) return;
      if (args?.paused) return;
      const interval = setTimeout(() => {
        updateArgs({ timeElapsed: args.timeElapsed + 0.1 });
      }, 100);
      return () => clearInterval(interval);
    }, [args?.paused, args.timeElapsed]);

    return (
      <SprintWidget
        {...args}
        tasks={args.tasks}
        currentTask={args.currentTask}
        onStart={() => {
          updateArgs({ timeElapsed: 0.1, currentTask: args.tasks[0] });
        }}
        onPause={() => updateArgs({ paused: true })}
        onResume={() => updateArgs({ paused: false })}
        onCompleteTask={(completedTask) => {
          const taskIndex = args.tasks.findIndex(
            (task) =>
              task.taskId === completedTask.taskId &&
              task.subtaskId === completedTask.subtaskId,
          );
          updateArgs({
            tasks: args.tasks.map((task, index) => {
              if (index !== taskIndex) return task;
              return { ...task, completedAt: Date.now() };
            }),
            currentTask: args.tasks[taskIndex + 1],
          });
        }}
        onSkipTask={(skippedTask) => {
          const taskIndex = args.tasks.findIndex(
            (task) =>
              task.taskId === skippedTask.taskId &&
              task.subtaskId === skippedTask.subtaskId,
          );
          updateArgs({
            tasks: args.tasks.map((task, index) => {
              if (index !== taskIndex) return task;
              return { ...task, skipped: true };
            }),
            currentTask: args.tasks[taskIndex + 1],
          });
        }}
        onRunTaskManually={(taskToRun) => {
          updateArgs({
            currentTask: taskToRun,
          });
        }}
      />
    );
  },
};

export const Idle: Story = {
  args: {
    tasks: [
      {
        taskId: "task1",
        subtaskId: null,
        label: "Standup meeting",
        group: undefined,
      },
      {
        taskId: "task2",
        subtaskId: null,
        label: "Code review PR-123",
        group: undefined,
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "1",
        label: "Gather requirements",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "2",
        label: "Design the UI",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "3",
        label: "Implement the UI",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "4",
        label: "Test the app",
      },
      {
        taskId: "dog",
        subtaskId: null,
        label: "Walk the dog",
        group: undefined,
      },
    ],
  },
};

export const Running: Story = {
  args: {
    timeElapsed: 10,
    currentTask: { taskId: "task2", subtaskId: null },
    tasks: [
      {
        taskId: "task1",
        subtaskId: null,
        label: "Standup meeting",
        group: undefined,
        completedAt: Date.now(),
      },
      {
        taskId: "task2",
        subtaskId: null,
        label: "Code review PR-123",
        group: undefined,
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "1",
        label: "Gather requirements",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "2",
        label: "Design the UI",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "3",
        label: "Implement the UI",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "4",
        label: "Test the app",
      },
      {
        taskId: "dog",
        subtaskId: null,
        label: "Walk the dog",
        group: undefined,
      },
    ],
  },
};

export const Pausable: Story = {
  args: {
    timeElapsed: 10,
    allowToPause: true,
    currentTask: { taskId: "task2", subtaskId: null },
    tasks: [
      {
        taskId: "task1",
        subtaskId: null,
        label: "Standup meeting",
        group: undefined,
        completedAt: Date.now(),
      },
      {
        taskId: "task2",
        subtaskId: null,
        label: "Code review PR-123",
        group: undefined,
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "1",
        label: "Gather requirements",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "2",
        label: "Design the UI",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "3",
        label: "Implement the UI",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "4",
        label: "Test the app",
      },
      {
        taskId: "dog",
        subtaskId: null,
        label: "Walk the dog",
        group: undefined,
      },
    ],
  },
};

export const Paused: Story = {
  args: {
    paused: true,
    timeElapsed: 10,
    allowToPause: true,
    currentTask: { taskId: "task2", subtaskId: null },
    tasks: [
      {
        taskId: "task1",
        subtaskId: null,
        label: "Standup meeting",
        group: undefined,
        completedAt: Date.now(),
      },
      {
        taskId: "task2",
        subtaskId: null,
        label: "Code review PR-123",
        group: undefined,
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "1",
        label: "Gather requirements",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "2",
        label: "Design the UI",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "3",
        label: "Implement the UI",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "4",
        label: "Test the app",
      },
      {
        taskId: "dog",
        subtaskId: null,
        label: "Walk the dog",
        group: undefined,
      },
    ],
  },
};

export const SkippedTask: Story = {
  args: {
    timeElapsed: 30,
    currentTask: { taskId: "app", subtaskId: "1" },
    tasks: [
      {
        taskId: "task1",
        subtaskId: null,
        label: "Standup meeting",
        group: undefined,
        completedAt: Date.now(),
      },
      {
        taskId: "task2",
        subtaskId: null,
        label: "Code review PR-123",
        group: undefined,
        skipped: true,
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "1",
        label: "Gather requirements",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "2",
        label: "Design the UI",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "3",
        label: "Implement the UI",
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "4",
        label: "Test the app",
      },
      {
        taskId: "dog",
        subtaskId: null,
        label: "Walk the dog",
        group: undefined,
      },
    ],
  },
};

export const RunningOutOfTime: Story = {
  args: {
    warnBeforeTimeRunsOut: 10,
    timeElapsed: meta.args.duration - 10,
    currentTask: { taskId: "dog", subtaskId: null },
    tasks: [
      {
        taskId: "task1",
        subtaskId: null,
        label: "Standup meeting",
        group: undefined,
        completedAt: Date.now(),
      },
      {
        taskId: "task2",
        subtaskId: null,
        label: "Code review PR-123",
        group: undefined,
        completedAt: Date.now(),
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "1",
        label: "Gather requirements",
        completedAt: Date.now(),
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "2",
        label: "Design the UI",
        completedAt: Date.now(),
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "3",
        label: "Implement the UI",
        completedAt: Date.now(),
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "4",
        label: "Test the app",
        completedAt: Date.now(),
      },
      {
        taskId: "dog",
        subtaskId: null,
        label: "Walk the dog",
        group: undefined,
      },
    ],
  },
};

export const RanOutOfTime: Story = {
  args: {
    timeElapsed: meta.args.duration,
    currentTask: { taskId: "dog", subtaskId: null },
    tasks: [
      {
        taskId: "task1",
        subtaskId: null,
        label: "Standup meeting",
        group: undefined,
        completedAt: Date.now(),
      },
      {
        taskId: "task2",
        subtaskId: null,
        label: "Code review PR-123",
        group: undefined,
        completedAt: Date.now(),
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "1",
        label: "Gather requirements",
        completedAt: Date.now(),
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "2",
        label: "Design the UI",
        completedAt: Date.now(),
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "3",
        label: "Implement the UI",
        completedAt: Date.now(),
      },
      {
        taskId: "app",
        group: "Build an app",
        subtaskId: "4",
        label: "Test the app",
        completedAt: Date.now(),
      },
      {
        taskId: "dog",
        subtaskId: null,
        label: "Walk the dog",
        group: undefined,
      },
    ],
  },
};
