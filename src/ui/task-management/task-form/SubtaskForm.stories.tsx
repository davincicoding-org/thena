import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { fn } from "@storybook/test";

import { Subtask, TaskInput } from "@/core/task-management";
import {
  taskFormOpts,
  useTaskForm,
} from "@/ui/task-management/task-form/useTaskForm";

import type { SubtaskFormProps } from "./SubtaskForm";
import { SubtaskForm } from "./SubtaskForm";

const Playground = ({
  values,
  ...props
}: SubtaskFormProps & { values?: TaskInput }) => {
  const form = useTaskForm({
    ...taskFormOpts,
    defaultValues: values,
  });
  return <SubtaskForm form={form} {...props} />;
};

const meta = {
  component: Playground,
  args: {},
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
