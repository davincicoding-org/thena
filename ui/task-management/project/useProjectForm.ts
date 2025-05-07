import {
  createFormHook,
  createFormHookContexts,
  formOptions,
} from "@tanstack/react-form";

import type { ProjectInput } from "@/core/task-management";
import { projectInputSchema } from "@/core/task-management";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm: useProjectForm, withForm: withProjectForm } =
  createFormHook({
    fieldComponents: {},
    formComponents: {},
    fieldContext,
    formContext,
  });

export const projectFormOpts = formOptions({
  defaultValues: {
    title: "",
    description: "",
  } as ProjectInput,
  validators: {
    onChange: projectInputSchema,
  },
});
