import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { TaskInput } from "@/core/task-management";

import type { TaskFormProps } from "./TaskForm";
import { TaskForm } from "./TaskForm";
import { taskFormOpts, useTaskForm } from "./useTaskForm";

const Playground = ({
  values,
  ...props
}: TaskFormProps & { values?: TaskInput }) => {
  const form = useTaskForm({
    ...taskFormOpts,
    defaultValues: values,
  });
  return <TaskForm form={form} {...props} />;
};

const meta = {
  component: Playground,
  args: {
    projects: [],
    onAddSubtask: fn(),
    onCreateProject: fn(),
  },
} satisfies Meta<typeof Playground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};

export const Prefilled: Story = {
  args: {
    values: {
      title: "Build a new feature",
      description: "This is a description",
      complexity: "trivial",
      priority: "critical",
    },
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    values: {
      title: "Build a new feature",
      description: "This is a description",
      complexity: "trivial",
      priority: "critical",
    },
  },
};
