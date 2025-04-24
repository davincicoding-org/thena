import { fn } from "@storybook/test";

import type { Meta, StoryObj } from "@storybook/react";

import { LiveSprint, LiveSprintProps } from "./LiveSprint";
import { useSprint } from "./useSprint";

const meta = {
  component: LiveSprint,
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
  },
} satisfies Meta<typeof LiveSprint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {
  args: {
    status: "idle",
    allowToPause: true,
    tasks: [
      {
        id: "task1",
        title: "Standup meeting",
      },
      {
        id: "task2",
        title: "Code review PR-123",
      },
      {
        id: "app",
        title: "Building an app",
        subtasks: [
          {
            id: "1",
            title: "Gather requirements",
          },
          {
            id: "2",
            title: "Design the UI",
          },
          {
            id: "3",
            title: "Implement the UI",
          },
          {
            id: "4",
            title: "Test the app",
          },
        ],
      },
      {
        id: "dog",
        title: "Walk the dog",
      },
    ],
  },
  render: (args) => {
    const sprint = useSprint(
      {
        id: "demo",
        duration: args.duration,
        tasks: args.tasks,
      },
      {
        onStart: args.onStart,
        // onCompleteTask: args.onCompleteTask,
        // onSkipTask: args.onSkipTask,
        // onRunTaskManually: args.onRunTaskManually,
        onPause: args.onPause,
        onResume: args.onResume,
      },
    );
    return (
      <LiveSprint
        {...args}
        tasks={sprint.tasks}
        status={sprint.status}
        currentTask={sprint.currentTask}
        timeElapsed={sprint.timeElapsed}
        onStart={sprint.start}
        onCompleteTask={sprint.completeTask}
        onSkipTask={sprint.skipTask}
        onRunTaskManually={sprint.runTaskManually}
        onPause={sprint.pause}
        onResume={sprint.resume}
      />
    );
  },
};

export const Idle: Story = {
  args: {
    status: "idle",
    tasks: [
      {
        id: "task1",
        title: "Standup meeting",
      },
      {
        id: "task2",
        title: "Code review PR-123",
      },
      {
        id: "app",
        title: "Building an app",
        subtasks: [
          {
            id: "1",
            title: "Gather requirements",
          },
          {
            id: "2",
            title: "Design the UI",
          },
          {
            id: "3",
            title: "Implement the UI",
          },
          {
            id: "4",
            title: "Test the app",
          },
        ],
      },
      {
        id: "dog",
        title: "Walk the dog",
      },
    ],
  },
};

export const Running: Story = {
  args: {
    status: "running",
    timeElapsed: 10,
    currentTask: { taskId: "task2", subtaskId: undefined },
    tasks: [
      {
        id: "task1",
        title: "Standup meeting",
        completedAt: Date.now(),
      },
      {
        id: "task2",
        title: "Code review PR-123",
      },
      {
        id: "app",
        title: "Building an app",
        subtasks: [
          {
            id: "1",
            title: "Gather requirements",
          },
          {
            id: "2",
            title: "Design the UI",
          },
          {
            id: "3",
            title: "Implement the UI",
          },
          {
            id: "4",
            title: "Test the app",
          },
        ],
      },
      {
        id: "dog",
        title: "Walk the dog",
      },
    ],
  },
};

export const Pausable: Story = {
  args: {
    status: "running",
    timeElapsed: 10,
    allowToPause: true,
    currentTask: { taskId: "task2", subtaskId: undefined },
    tasks: [
      {
        id: "task1",
        title: "Standup meeting",
        completedAt: Date.now(),
      },
      {
        id: "task2",
        title: "Code review PR-123",
      },
      {
        id: "app",
        title: "Building an app",
        subtasks: [
          {
            id: "1",
            title: "Gather requirements",
          },
          {
            id: "2",
            title: "Design the UI",
          },
          {
            id: "3",
            title: "Implement the UI",
          },
          {
            id: "4",
            title: "Test the app",
          },
        ],
      },
      {
        id: "dog",
        title: "Walk the dog",
      },
    ],
  },
};

export const Paused: Story = {
  args: {
    status: "paused",
    timeElapsed: 10,
    allowToPause: true,
    currentTask: { taskId: "task2", subtaskId: undefined },
    tasks: [
      {
        id: "task1",
        title: "Standup meeting",
        completedAt: Date.now(),
      },
      {
        id: "task2",
        title: "Code review PR-123",
      },
      {
        id: "app",
        title: "Building an app",
        subtasks: [
          {
            id: "1",
            title: "Gather requirements",
          },
          {
            id: "2",
            title: "Design the UI",
          },
          {
            id: "3",
            title: "Implement the UI",
          },
          {
            id: "4",
            title: "Test the app",
          },
        ],
      },
      {
        id: "dog",
        title: "Walk the dog",
      },
    ],
  },
};

export const SkippedTask: Story = {
  args: {
    status: "running",
    timeElapsed: 30,
    currentTask: { taskId: "app", subtaskId: "1" },
    tasks: [
      {
        id: "task1",
        title: "Standup meeting",
        completedAt: Date.now(),
      },
      {
        id: "task2",
        title: "Code review PR-123",
        skipped: true,
      },
      {
        id: "app",
        title: "Building an app",
        subtasks: [
          {
            id: "1",
            title: "Gather requirements",
          },
          {
            id: "2",
            title: "Design the UI",
          },
          {
            id: "3",
            title: "Implement the UI",
          },
          {
            id: "4",
            title: "Test the app",
          },
        ],
      },
      {
        id: "dog",
        title: "Walk the dog",
      },
    ],
  },
};

export const RunningOutOfTime: Story = {
  args: {
    status: "running",
    warnBeforeTimeRunsOut: 10,
    timeElapsed: meta.args.duration - 10,
    currentTask: { taskId: "dog", subtaskId: undefined },
    tasks: [
      {
        id: "task1",
        title: "Standup meeting",
        completedAt: Date.now(),
      },
      {
        id: "task2",
        title: "Code review PR-123",
        completedAt: Date.now(),
      },
      {
        id: "app",
        title: "Building an app",
        subtasks: [
          {
            id: "1",
            title: "Gather requirements",
            completedAt: Date.now(),
          },
          {
            id: "2",
            title: "Design the UI",
            completedAt: Date.now(),
          },
          {
            id: "3",
            title: "Implement the UI",
            completedAt: Date.now(),
          },
          {
            id: "4",
            title: "Test the app",
            completedAt: Date.now(),
          },
        ],
      },
      {
        id: "dog",
        title: "Walk the dog",
      },
    ],
  },
};

export const RanOutOfTime: Story = {
  args: {
    status: "running",
    timeElapsed: meta.args.duration,
    currentTask: { taskId: "dog", subtaskId: undefined },
    tasks: [
      {
        id: "task1",
        title: "Standup meeting",
        completedAt: Date.now(),
      },
      {
        id: "task2",
        title: "Code review PR-123",
        completedAt: Date.now(),
      },
      {
        id: "app",
        title: "Building an app",
        subtasks: [
          {
            id: "1",
            title: "Gather requirements",
            completedAt: Date.now(),
          },
          {
            id: "2",
            title: "Design the UI",
            completedAt: Date.now(),
          },
          {
            id: "3",
            title: "Implement the UI",
            completedAt: Date.now(),
          },
          {
            id: "4",
            title: "Test the app",
            completedAt: Date.now(),
          },
        ],
      },
      {
        id: "dog",
        title: "Walk the dog",
      },
    ],
  },
};

export const Completed: Story = {
  args: {
    status: "completed",
    timeElapsed: meta.args.duration,
    tasks: [
      {
        id: "task1",
        title: "Standup meeting",
        completedAt: Date.now(),
      },
      {
        id: "task2",
        title: "Code review PR-123",
        completedAt: Date.now(),
      },
      {
        id: "app",
        title: "Building an app",
        subtasks: [
          {
            id: "1",
            title: "Gather requirements",
            completedAt: Date.now(),
          },
          {
            id: "2",
            title: "Design the UI",
            completedAt: Date.now(),
          },
          {
            id: "3",
            title: "Implement the UI",
            completedAt: Date.now(),
          },
          {
            id: "4",
            title: "Test the app",
            completedAt: Date.now(),
          },
        ],
      },
      {
        id: "dog",
        title: "Walk the dog",
        completedAt: Date.now(),
      },
    ],
  },
};
export const CompletedWithSkips: Story = {
  args: {
    status: "completed",
    timeElapsed: meta.args.duration,
    tasks: [
      {
        id: "task1",
        title: "Standup meeting",
        completedAt: Date.now(),
      },
      {
        id: "task2",
        title: "Code review PR-123",
        skipped: true,
      },
      {
        id: "app",
        title: "Building an app",
        subtasks: [
          {
            id: "1",
            title: "Gather requirements",
            completedAt: Date.now(),
          },
          {
            id: "2",
            title: "Design the UI",
            completedAt: Date.now(),
          },
          {
            id: "3",
            title: "Implement the UI",
            completedAt: Date.now(),
          },
          {
            id: "4",
            title: "Test the app",
            completedAt: Date.now(),
          },
        ],
      },
      {
        id: "dog",
        title: "Walk the dog",
        completedAt: Date.now(),
      },
    ],
  },
};
