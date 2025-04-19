import { Button } from "@mantine/core";
import { action } from "@storybook/addon-actions";
import { fn } from "@storybook/test";

import type { Meta, StoryObj } from "@storybook/react";

import { TaskForm, TaskFormProps } from "./TaskForm";
import { taskFormOpts, TaskFormValues, useTaskForm } from "./useTaskForm";

interface PlaygroundProps extends TaskFormProps {
  initialValues: TaskFormValues;
  onSubmit: (values: TaskFormValues) => void;
}
const Playground = ({ initialValues, onSubmit, ...props }: PlaygroundProps) => {
  const form = useTaskForm({
    ...taskFormOpts,
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });
  return <TaskForm form={form} {...props} />;
};

const meta = {
  component: Playground,
  parameters: {
    layout: "centered",
  },
  args: {
    initialValues: taskFormOpts.defaultValues,
    autoSubmit: "change",
    onSubmit: fn(),
  },
  argTypes: {
    autoSubmit: {
      control: "select",
      options: [undefined, "blur", "change"],
    },
  },
} satisfies Meta<typeof Playground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithSubtasks: Story = {
  args: {
    initialValues: {
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
  },
};

export const WithCustomActions: Story = {
  args: {
    actions: [
      <Button
        key="refine"
        size="compact-sm"
        variant="outline"
        onClick={action("refine")}
      >
        Refine
      </Button>,
    ],
  },
};

export const WithAdditionalActions: Story = {
  args: {
    actions: [
      <Button
        key="refine"
        size="compact-sm"
        variant="outline"
        onClick={action("refine")}
      >
        Refine
      </Button>,
      "add-subtask",
    ],
  },
};
