import { Button } from "@mantine/core";
import { action } from "@storybook/addon-actions";
import { fn } from "@storybook/test";

import type { Meta, StoryObj } from "@storybook/react";
import { MOCK_PROJECTS, MOCK_TAGS } from "@/core/task-management/mock";

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
    projects: MOCK_PROJECTS,
    tags: MOCK_TAGS,
    onSubmit: fn(),
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

export const ReadOnly: Story = {
  args: {
    readOnly: true,
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

export const WithProject: Story = {
  args: {
    initialValues: {
      title: "Building an app",
      projectId: "con",
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

export const WithTags: Story = {
  args: {
    initialValues: {
      title: "Building an app",
      tags: ["man", "des"],
      subtasks: [
        {
          id: "1",
          title: "Gather requirements",
          tags: ["res"],
        },
        {
          id: "2",
          title: "Design the UI",
          tags: ["des"],
        },
        {
          id: "3",
          title: "Implement the UI",
          tags: ["dev"],
        },
        {
          id: "4",
          title: "Test the app",
        },
      ],
    },
  },
};

export const WithEverything: Story = {
  args: {
    initialValues: {
      title: "Building an app",
      tags: ["des", "man"],
      projectId: "con",
      subtasks: [
        {
          id: "1",
          title: "Gather requirements",
          tags: ["res"],
        },
        {
          id: "2",
          title: "Design the UI",
          tags: ["des"],
        },
        {
          id: "3",
          title: "Implement the UI",
          tags: ["dev"],
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
      {
        label: "Refine",
        onClick: action("refine"),
      },
    ],
  },
};

export const WithAdditionalActions: Story = {
  args: {
    actions: [
      {
        label: "Refine",
        onClick: action("refine"),
      },
      "-",
      "subtasks",
      "-",
      "project",
      "tags",
    ],
  },
};
