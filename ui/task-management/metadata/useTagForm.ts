import {
  createFormHook,
  createFormHookContexts,
  formOptions,
} from "@tanstack/react-form";

import type { TagInput } from "@/core/task-management";
import { tagInputSchema } from "@/core/task-management";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm: useTagForm, withForm: withTagForm } = createFormHook(
  {
    fieldComponents: {},
    formComponents: {},
    fieldContext,
    formContext,
  },
);

export const tagFormOpts = formOptions({
  defaultValues: {
    name: "",
    description: "",
  } as TagInput,
  validators: {
    onChange: tagInputSchema,
  },
});
