import type { Ref } from "react";
import { Button, Menu } from "@mantine/core";
import { IconArrowBigUpLinesFilled } from "@tabler/icons-react";
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
      PriorityPicker: ({
        ref,
        onClick,
      }: {
        ref: Ref<HTMLDivElement>;
        onClick: () => void;
      }) => {
        const field = useFieldContext<TaskFormValues["priority"]>();
        const t = useTranslations("task");

        const handleClickOption = (value: TaskFormValues["priority"]) => {
          onClick();
          field.handleChange(value);
        };

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
                leftSection={<IconArrowBigUpLinesFilled size={16} />}
                fullWidth
                radius={0}
                color="gray"
                variant="subtle"
              >
                Set Priority
              </Button>
            </Menu.Target>
            <Menu.Dropdown ref={ref}>
              <Menu.Item
                color={field.state.value === "2" ? "primary" : undefined}
                onClick={() => handleClickOption("2")}
              >
                {t("priority.options.2")}
              </Menu.Item>
              <Menu.Item
                color={field.state.value === "1" ? "primary" : undefined}
                onClick={() => handleClickOption("1")}
              >
                {t("priority.options.1")}
              </Menu.Item>
              <Menu.Item
                color={field.state.value === "0" ? "primary" : undefined}
                onClick={() => handleClickOption("0")}
              >
                {t("priority.options.0")}
              </Menu.Item>
              <Menu.Item
                color={field.state.value === "-1" ? "primary" : undefined}
                onClick={() => handleClickOption("-1")}
              >
                {t("priority.options.-1")}
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
