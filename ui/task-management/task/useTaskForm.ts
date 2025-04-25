import {
  createFormHook,
  createFormHookContexts,
  formOptions,
} from "@tanstack/react-form";

import { TaskInput, taskInputSchema } from "@/core/task-management";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm: useTaskForm, withForm: withTaskForm } =
  createFormHook({
    fieldComponents: {},
    formComponents: {},
    fieldContext,
    formContext,
  });

export const taskFormOpts = formOptions({
  defaultValues: {
    title: "",
  } as TaskInput,
  validators: {
    onChange: taskInputSchema,
  },
});
