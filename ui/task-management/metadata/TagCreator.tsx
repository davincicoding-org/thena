import { Button, Paper, Stack } from "@mantine/core";
import { useForm } from "@tanstack/react-form";

import type { TagInput } from "@/core/task-management";
import { tagInputSchema } from "@/core/task-management";

export interface TagCreatorProps {
  onCreate: (tag: TagInput) => void;
  className?: string;
}

export function TagCreator({ onCreate }: TagCreatorProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    } as TagInput,
    validators: {
      onChange: tagInputSchema,
    },
    onSubmit: ({ value }) => onCreate(value),
  });

  return (
    <Paper p="md" shadow="xs" radius="md" withBorder>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <Stack gap="lg">
          {/* TODO: Disable button if form is not valid */}
          <Button type="submit">Create Tag</Button>
        </Stack>
      </form>
    </Paper>
  );
}
