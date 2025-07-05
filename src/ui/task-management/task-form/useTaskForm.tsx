import { Button, Menu } from "@mantine/core";
import {
  createFormHook,
  createFormHookContexts,
  formOptions,
} from "@tanstack/react-form";
import { useTranslations } from "next-intl";

import type { TaskFormValues } from "@/core/task-management";
import { taskFormSchema } from "@/core/task-management";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm: useTaskForm, withForm: withTaskForm } =
  createFormHook({
    fieldComponents: {
      PriorityPicker: () => {
        const field = useFieldContext<TaskFormValues["priority"]>();
        const t = useTranslations("task");

        return (
          <Menu
            position="right-start"
            withArrow
            arrowPosition="center"
            classNames={{ itemLabel: "font-medium" }}
          >
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
              <Menu.Item
                color={field.state.value === "URGENT" ? "primary" : undefined}
                onClick={() => field.handleChange("URGENT")}
              >
                {t("priority.options.URGENT")}
              </Menu.Item>
              <Menu.Item
                color={field.state.value === "HIGH" ? "primary" : undefined}
                onClick={() => field.handleChange("HIGH")}
              >
                {t("priority.options.HIGH")}
              </Menu.Item>
              <Menu.Item
                color={field.state.value === null ? "primary" : undefined}
                onClick={() => field.handleChange(null)}
              >
                {t("priority.options.DEFAULT")}
              </Menu.Item>
              <Menu.Item
                color={field.state.value === "LOW" ? "primary" : undefined}
                onClick={() => field.handleChange("LOW")}
              >
                {t("priority.options.LOW")}
              </Menu.Item>
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
