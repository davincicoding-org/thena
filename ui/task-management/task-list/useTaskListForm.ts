import {
  createFormHook,
  createFormHookContexts,
  formOptions,
} from "@tanstack/react-form";
import { z } from "zod";

import { Task, taskSchema } from "../../../core/task-management/types";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm: useTaskListForm, withForm: withTaskListForm } =
  createFormHook({
    fieldComponents: {},
    formComponents: {},
    fieldContext,
    formContext,
  });

const taskFormListValuesSchema = taskSchema.extend({
  items: z.array(taskSchema),
});
export type TaskFormListValues = z.infer<typeof taskFormListValuesSchema>;

export const taskListFormOpts = formOptions({
  defaultValues: {
    items: new Array<Task>(),
  } as TaskFormListValues,
  validators: {
    onChange: taskFormListValuesSchema,
  },
});
