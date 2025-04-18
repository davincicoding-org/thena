import { useEffect, useState } from "react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";

import type { Meta, StoryObj } from "@storybook/react";

import { TaskListEditor, TaskListEditorProps } from "./TaskListEditor";
import { useTaskList } from "./useTaskList";

const meta = {
  component: TaskListEditor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    tasks: [
      {
        id: "1",
        title: "Build a task management app",
        subtasks: [
          { id: "3", title: "Engineer requirements" },
          { id: "1", title: "Define tech stack" },
          { id: "2", title: "Setup codebase" },
        ],
      },
      { id: "2", title: "Reply to client email" },
      { id: "3", title: "Buy groceries" },
    ],
    onAddTask: fn(),
    onUpdateTask: fn(),
    onRemoveTask: fn(),
    onAddSubtask: fn(),
    onUpdateSubtask: fn(),
    onRemoveSubtask: fn(),
    onRefineTask: fn(),
  },
} satisfies Meta<typeof TaskListEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => {
    const [{ tasks }, updateArgs] = useArgs<TaskListEditorProps>();
    const taskList = useTaskList({
      initialTasks: tasks,
      useStateAdapter: () => [
        tasks,
        (updates) =>
          updateArgs({
            tasks: typeof updates === "function" ? updates(tasks) : updates,
          }),
      ],
    });
    return (
      <TaskListEditor
        {...args}
        tasks={taskList.tasks}
        onUpdateTask={taskList.updateTask}
        onAddTask={taskList.addTask}
        onRemoveTask={taskList.removeTask}
        onAddSubtask={taskList.addSubtask}
        onUpdateSubtask={taskList.updateSubtask}
        onRemoveSubtask={taskList.removeSubtask}
      />
    );
  },
};

export const Initial: Story = {
  args: {
    tasks: [],
  },
};

export const SimpleTasks: Story = {
  args: {
    tasks: [
      { id: "1", title: "Build a task management app" },
      { id: "2", title: "Reply to client email" },
      { id: "3", title: "Buy groceries" },
    ],
  },
};
