import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";

import { MOCK_PROJECTS, MOCK_TAGS } from "@/core/task-management/mock";

import type { TaskCollectorProps } from "./TaskCollector";
import { TaskCollector } from "./TaskCollector";

const meta = {
  component: TaskCollector,
  parameters: {
    layout: "centered",
  },
  args: {
    items: [
      {
        id: "0",
        title: "Replay to client mail",
      },
      {
        id: "1",
        title: "Build an app",
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
            title: "Setup project",
          },
        ],
      },
      {
        id: "2",
        title: "Do laundry",
      },
    ],
    projects: MOCK_PROJECTS,
    onUpdateTask: fn(),
    onRemoveTask: fn(),
    onAddTask: fn(),
    onRefineTask: fn(),
    onCreateProject: fn(),
    onRequestImport: fn(),
    allowImport: true,
  },
} satisfies Meta<typeof TaskCollector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {
  render: ({
    items,
    onAddTask,
    onUpdateTask,
    onRemoveTask,
    onRefineTask,
    onCreateProject,
    allowImport: allowPullFromBacklog,
    onRequestImport: onRequestToPullFromBacklog,
    projects,
  }) => {
    const [, updateArgs] = useArgs<TaskCollectorProps>();
    return (
      <TaskCollector
        items={items}
        onAddTask={(task) => {
          updateArgs({
            items: [...items, { ...task, id: Date.now().toString() }],
          });
          onAddTask?.(task);
        }}
        onUpdateTask={(id, updates) => {
          updateArgs({
            items: items.map((task) =>
              task.id === id ? { ...task, ...updates } : task,
            ),
          });
          onUpdateTask?.(id, updates);
        }}
        onRemoveTask={(id) => {
          updateArgs({
            items: items.filter((task) => task.id !== id),
          });
          onRemoveTask?.(id);
        }}
        onRefineTask={onRefineTask}
        projects={projects}
        onCreateProject={onCreateProject}
        allowImport={allowPullFromBacklog}
        onRequestImport={onRequestToPullFromBacklog}
      />
    );
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
