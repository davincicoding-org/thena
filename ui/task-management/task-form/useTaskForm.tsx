import { Button, Menu } from "@mantine/core";
import {
  createFormHook,
  createFormHookContexts,
  formOptions,
} from "@tanstack/react-form";

import type { TaskFormValues } from "@/core/task-management";
import {
  taskComplexityEnum,
  taskFormSchema,
  taskPriorityEnum,
} from "@/core/task-management";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm: useTaskForm, withForm: withTaskForm } =
  createFormHook({
    fieldComponents: {
      PriorityPicker: () => {
        const field = useFieldContext<TaskFormValues["priority"]>();
        return (
          <Menu position="bottom-end">
            <Menu.Target>
              <Button
                justify="flex-start"
                fullWidth
                radius={0}
                color="gray"
                variant="subtle"
              >
                Set Priority
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {taskPriorityEnum.options.map((option) => (
                <Menu.Item
                  key={option}
                  color={field.state.value === option ? "primary" : undefined}
                  onClick={() => field.handleChange(option)}
                >
                  {option.toUpperCase()}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        );
      },
      ComplexityPicker: () => {
        const field = useFieldContext<TaskFormValues["complexity"]>();
        return (
          <Menu position="bottom-end">
            <Menu.Target>
              <Button
                justify="flex-start"
                fullWidth
                radius={0}
                color="gray"
                variant="subtle"
              >
                Set Complexity
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {taskComplexityEnum.options.map((option) => (
                <Menu.Item
                  key={option}
                  color={field.state.value === option ? "primary" : undefined}
                  onClick={() => field.handleChange(option)}
                >
                  {option.toUpperCase()}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        );
      },
    },
    formComponents: {},
    fieldContext,
    formContext,
  });

export const taskFormOpts = formOptions({
  defaultValues: {
    title: "",
  } as TaskFormValues,
  validators: {
    onChange: taskFormSchema,
  },
});
