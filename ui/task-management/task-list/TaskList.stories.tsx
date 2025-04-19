import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";

import type { Meta, StoryObj } from "@storybook/react";

import { TaskList, TaskListProps } from "./TaskList";

const meta = {
  component: TaskList,
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
    onUpdateTask: fn(),
    onRemoveTask: fn(),
    onAddTask: fn(),
    onRefineTask: fn(),
  },
} satisfies Meta<typeof TaskList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {
  render: ({ items, onAddTask, onUpdateTask, onRemoveTask, onRefineTask }) => {
    const [, updateArgs] = useArgs<TaskListProps>();
    return (
      <TaskList
        items={items}
        onAddTask={(task) => {
          updateArgs({
            items: [...items, { ...task, id: Date.now().toString() }],
          });
          onAddTask(task);
        }}
        onUpdateTask={(id, updates) => {
          updateArgs({
            items: items.map((task) =>
              task.id === id ? { ...task, ...updates } : task,
            ),
          });
          onUpdateTask(id, updates);
        }}
        onRemoveTask={(id) => {
          updateArgs({
            items: items.filter((task) => task.id !== id),
          });
          onRemoveTask(id);
        }}
        onRefineTask={onRefineTask}
      />
    );
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
