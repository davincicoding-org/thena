import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { SprintWidget } from "./SprintWidget";

const meta = {
  component: SprintWidget,
  parameters: {
    layout: "centered",
  },
  args: {
    duration: { seconds: 60 },
    warnBeforeTimeRunsOut: 10,

    onStart: fn(),
    onCompleteTask: fn(),
    onSkipTask: fn(),
    onJumpToTask: fn(),
    onPause: fn(),
    onResume: fn(),
    onFinish: fn(),
  },
} satisfies Meta<typeof SprintWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

// export const Showcase: Story = {
//   args: {
//     tasks: [
//       {
//         taskId: "task1",
//         subtaskId: null,
//         title: "Standup meeting",
//       },
//       {
//         taskId: "task2",
//         subtaskId: null,
//         title: "Code review PR-123",
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "1",
//         title: "Gather requirements",
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "2",
//         title: "Design the UI",
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "3",
//         title: "Implement the UI",
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "4",
//         title: "Test the app",
//       },
//       {
//         taskId: "dog",
//         subtaskId: null,
//         title: "Walk the dog",
//       },
//     ],
//   },
//   render: (args) => {
//     const [, updateArgs] = useArgs<ComponentProps<typeof SprintWidget>>();

//     useEffect(() => {
//       if (args.timeElapsed === 0) return;
//       if (args?.paused) return;
//       const interval = setTimeout(() => {
//         updateArgs({ timeElapsed: args.timeElapsed + 0.1 });
//       }, 100);
//       return () => clearInterval(interval);
//     }, [args?.paused, args.timeElapsed]);

//     return (
//       <SprintWidget
//         {...args}
//         tasks={args.tasks}
//         currentTask={args.currentTask}
//         onStart={() => {
//           updateArgs({ timeElapsed: 0.1, currentTask: args.tasks[0] });
//         }}
//         onPause={() => updateArgs({ paused: true })}
//         onResume={() => updateArgs({ paused: false })}
//         onCompleteTask={(completedTask) => {
//           const taskIndex = args.tasks.findIndex(
//             (task) =>
//               task.taskId === completedTask.taskId &&
//               task.subtaskId === completedTask.subtaskId,
//           );
//           updateArgs({
//             tasks: args.tasks.map((task, index) => {
//               if (index !== taskIndex) return task;
//               return { ...task, completedAt: Date.now() };
//             }),
//             currentTask: args.tasks[taskIndex + 1],
//           });
//         }}
//         onSkipTask={(skippedTask) => {
//           const taskIndex = args.tasks.findIndex(
//             (task) =>
//               task.taskId === skippedTask.taskId &&
//               task.subtaskId === skippedTask.subtaskId,
//           );
//           updateArgs({
//             tasks: args.tasks.map((task, index) => {
//               if (index !== taskIndex) return task;
//               return { ...task, skipped: true };
//             }),
//             currentTask: args.tasks[taskIndex + 1],
//           });
//         }}
//         onRunTaskManually={(taskToRun) => {
//           updateArgs({
//             currentTask: taskToRun,
//           });
//         }}
//       />
//     );
//   },
// };

export const Idle: Story = {
  args: {
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
        parentTitle: "Build an app",
        subtaskId: "1",
        title: "Gather requirements",
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "2",
        title: "Design the UI",
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "3",
        title: "Implement the UI",
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "4",
        title: "Test the app",
      },
      {
        taskId: "dog",
        subtaskId: null,
        title: "Walk the dog",
      },
    ],
  },
};
export const ViewOnly: Story = {
  args: {
    viewOnly: true,
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
        parentTitle: "Build an app",
        subtaskId: "1",
        title: "Gather requirements",
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "2",
        title: "Design the UI",
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "3",
        title: "Implement the UI",
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "4",
        title: "Test the app",
      },
      {
        taskId: "dog",
        subtaskId: null,
        title: "Walk the dog",
      },
    ],
  },
};

// export const Running: Story = {
//   args: {
//     tasks: [
//       {
//         taskId: "task1",
//         subtaskId: null,
//         title: "Standup meeting",
//         completedAt: Date.now(),
//       },
//       {
//         taskId: "task2",
//         subtaskId: null,
//         title: "Code review PR-123",
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "1",
//         title: "Gather requirements",
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "2",
//         title: "Design the UI",
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "3",
//         title: "Implement the UI",
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "4",
//         title: "Test the app",
//       },
//       {
//         taskId: "dog",
//         subtaskId: null,
//         title: "Walk the dog",
//       },
//     ],
//   },
// };

export const Pausable: Story = {
  args: {
    allowToPause: true,
    tasks: [
      {
        taskId: "task1",
        subtaskId: null,
        title: "Standup meeting",
        completedAt: Date.now(),
      },
      {
        taskId: "task2",
        subtaskId: null,
        title: "Code review PR-123",
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "1",
        title: "Gather requirements",
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "2",
        title: "Design the UI",
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "3",
        title: "Implement the UI",
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "4",
        title: "Test the app",
      },
      {
        taskId: "dog",
        subtaskId: null,
        title: "Walk the dog",
      },
    ],
  },
};

export const SkippedTask: Story = {
  args: {
    tasks: [
      {
        taskId: "task1",
        subtaskId: null,
        title: "Standup meeting",
        completedAt: Date.now(),
      },
      {
        taskId: "task2",
        subtaskId: null,
        title: "Code review PR-123",
        skipped: true,
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "1",
        title: "Gather requirements",
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "2",
        title: "Design the UI",
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "3",
        title: "Implement the UI",
      },
      {
        taskId: "app",
        parentTitle: "Build an app",
        subtaskId: "4",
        title: "Test the app",
      },
      {
        taskId: "dog",
        subtaskId: null,
        title: "Walk the dog",
      },
    ],
  },
};

// export const RunningOutOfTime: Story = {
//   args: {
//     tasks: [
//       {
//         taskId: "task1",
//         subtaskId: null,
//         title: "Standup meeting",
//         completedAt: Date.now(),
//       },
//       {
//         taskId: "task2",
//         subtaskId: null,
//         title: "Code review PR-123",
//         completedAt: Date.now(),
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "1",
//         title: "Gather requirements",
//         completedAt: Date.now(),
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "2",
//         title: "Design the UI",
//         completedAt: Date.now(),
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "3",
//         title: "Implement the UI",
//         completedAt: Date.now(),
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "4",
//         title: "Test the app",
//         completedAt: Date.now(),
//       },
//       {
//         taskId: "dog",
//         subtaskId: null,
//         title: "Walk the dog",
//       },
//     ],
//   },
// };

// export const RanOutOfTime: Story = {
//   args: {
//     tasks: [
//       {
//         taskId: "task1",
//         subtaskId: null,
//         title: "Standup meeting",
//         completedAt: Date.now(),
//       },
//       {
//         taskId: "task2",
//         subtaskId: null,
//         title: "Code review PR-123",
//         completedAt: Date.now(),
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "1",
//         title: "Gather requirements",
//         completedAt: Date.now(),
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "2",
//         title: "Design the UI",
//         completedAt: Date.now(),
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "3",
//         title: "Implement the UI",
//         completedAt: Date.now(),
//       },
//       {
//         taskId: "app",
//         parentTitle: "Build an app",
//         subtaskId: "4",
//         title: "Test the app",
//         completedAt: Date.now(),
//       },
//       {
//         taskId: "dog",
//         subtaskId: null,
//         title: "Walk the dog",
//       },
//     ],
//   },
// };
