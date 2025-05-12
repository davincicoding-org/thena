import type { Meta, StoryObj } from "@storybook/react";
import { Fragment } from "react";
import { Button, Divider } from "@mantine/core";
import { action } from "@storybook/addon-actions";
import { fn } from "@storybook/test";

import type { TaskInput } from "@/core/task-management";
import { MOCK_PROJECTS } from "@/core/task-management/mock";

import type { TaskFormProps } from "./TaskForm";
import { TaskForm } from "./TaskForm";
import { taskFormOpts, useTaskForm } from "./useTaskForm";

interface PlaygroundProps extends TaskFormProps {
  initialValues: TaskInput;
  onSubmit: (values: TaskInput) => void;
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
    projects: MOCK_PROJECTS,
    onSubmit: fn(),
    onCreateProject: fn(),
  },
} satisfies Meta<typeof Playground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithSubtasks: Story = {
  args: {
    initialValues: {
      title: "Building an app",
    },
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    initialValues: {
      title: "Building an app",
    },
  },
};

export const WithProject: Story = {
  args: {
    initialValues: {
      title: "Building an app",
      projectId: "con",
    },
  },
};

export const WithEverything: Story = {
  args: {
    initialValues: {
      title: "Building an app",
      projectId: "con",
    },
  },
};

export const WithCustomActions: Story = {
  args: {
    TaskActions: () => (
      <Button fullWidth variant="subtle" onClick={action("refine")}>
        Refine
      </Button>
    ),
  },
};

export const WithAdditionalActions: Story = {
  args: {
    TaskActions: ({ defaultActions }) => {
      return (
        <Fragment>
          <Button fullWidth variant="subtle" onClick={action("refine")}>
            Refine
          </Button>
          <Divider />
          {defaultActions}
        </Fragment>
      );
    },
  },
};
