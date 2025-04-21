import {
  createFormHook,
  createFormHookContexts,
  formOptions,
} from "@tanstack/react-form";
import { z } from "zod";

import { taskSchema } from "@/core/task-management";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm: useTaskForm, withForm: withTaskForm } =
  createFormHook({
    fieldComponents: {},
    formComponents: {},
    fieldContext,
    formContext,
  });

const taskFormValuesSchema = taskSchema.extend({
  id: z.string().optional(),
});
export type TaskFormValues = z.infer<typeof taskFormValuesSchema>;

export const taskFormOpts = formOptions({
  defaultValues: {
    title: "",
  } as TaskFormValues,
  validators: {
    onChange: taskFormValuesSchema,
  },
});
