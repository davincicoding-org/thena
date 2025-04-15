import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";

import type { Meta, StoryObj } from "@storybook/react";

import { TasksEditor, TasksEditorProps } from "./TasksEditor";

const meta = {
  component: TasksEditor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onRefineTask: fn(),
    onChange: fn(),
  },
  render: (args) => {
    const [{ items }, updateArgs] = useArgs<TasksEditorProps>();
    const handleChange = (items: TasksEditorProps["items"]) => {
      updateArgs({ items });
    };
    return <TasksEditor {...args} items={items} onChange={handleChange} />;
  },
} satisfies Meta<typeof TasksEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {
  args: {
    ...meta.args,
    items: [
      {
        name: "1",
        label: "Build a task management app",
        tasks: [
          { name: "3", label: "Engineer requirements" },
          { name: "1", label: "Define tech stack" },
          { name: "2", label: "Setup codebase" },
        ],
      },
      { name: "2", label: "Reply to client email" },
      { name: "3", label: "Buy groceries" },
    ],
  },
};

export const Initial: Story = {
  args: {
    ...meta.args,
    items: [],
    onChange: fn(),
    onRefineTask: fn(),
  },
};
