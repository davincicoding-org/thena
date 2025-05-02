import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Paper,
  Popover,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@tanstack/react-form";

import type { TagInput } from "@/core/task-management";
import { colorsEnum, tagInputSchema } from "@/core/task-management";
import { cn } from "@/ui/utils";

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
