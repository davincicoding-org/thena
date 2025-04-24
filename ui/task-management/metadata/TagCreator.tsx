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
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { useForm } from "@tanstack/react-form";

import { colorsEnum, TagInput, tagInputSchema } from "@/core/task-management";
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

  const [isColorPanelOpen, colorPanel] = useDisclosure(false);
  const avatarPanelRef = useClickOutside(() => {});

  return (
    <Paper p="md" shadow="xs" radius="md" withBorder>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Stack gap="lg">
          <Stack>
            <Flex gap="xs">
              <form.Field
                name="color"
                children={(field) => (
                  <Popover
                    opened={isColorPanelOpen}
                    position="bottom-start"
                    onClose={colorPanel.close}
                  >
                    <Popover.Target>
                      <ActionIcon
                        aria-label="Select Color"
                        size={36}
                        variant="transparent"
                        onClick={colorPanel.toggle}
                      >
                        <form.Subscribe
                          selector={(state) => state.values.color}
                        >
                          <Box
                            bg={field.state.value || "gray"}
                            className={cn(
                              "h-6 w-6 cursor-pointer rounded-full",
                            )}
                          />
                        </form.Subscribe>
                      </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown ref={avatarPanelRef} p={0}>
                      <SimpleGrid cols={4} p="xs" className="gap-1!">
                        {colorsEnum.options.map((color) => (
                          <ActionIcon
                            aria-label={`Select "${color}" as color`}
                            size={36}
                            key={color}
                            variant="transparent"
                            onClick={() => {
                              field.handleChange(color);
                              colorPanel.close();
                            }}
                          >
                            <Box
                              bg={color}
                              className={cn(
                                "h-6 w-6 cursor-pointer rounded-full",
                              )}
                            />
                          </ActionIcon>
                        ))}
                      </SimpleGrid>
                    </Popover.Dropdown>
                  </Popover>
                )}
              />

              <form.Field
                name="name"
                children={(field) => (
                  <TextInput
                    placeholder="Tag name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              />
            </Flex>

            <form.Field
              name="description"
              children={(field) => (
                <Textarea
                  placeholder="Description (optional)"
                  rows={3}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </Stack>

          {/* TODO: Disable button if form is not valid */}
          <Button type="submit">Create Tag</Button>
        </Stack>
      </form>
    </Paper>
  );
}
