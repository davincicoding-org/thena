import { useState } from "react";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  FileButton,
  Flex,
  Paper,
  Popover,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { IconUpload } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";

import {
  colorsEnum,
  ProjectInput,
  projectInputSchema,
} from "@/core/task-management";
import { cn } from "@/ui/utils";

export interface ProjectCreatorProps {
  onCreate: (project: ProjectInput) => void;
  className?: string;
}

export function ProjectCreator({ onCreate }: ProjectCreatorProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    } as ProjectInput,
    validators: {
      onChange: projectInputSchema,
    },
    onSubmit: ({ value }) => {
      onCreate(value);
      form.reset();
    },
  });

  const [isAvatarPanelOpen, avatarPanel] = useDisclosure(false);
  const avatarPanelRef = useClickOutside(() => avatarPanel.close());

  const [imagePreview, setImagePreview] = useState<string>();

  return (
    <Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Flex gap="md" p="lg">
          <Popover
            opened={isAvatarPanelOpen}
            position="bottom-start"
            onClose={avatarPanel.close}
          >
            <form.Subscribe
              selector={(state) => state.values}
              children={({ color, name }) => (
                <Popover.Target>
                  <Avatar
                    className="cursor-pointer"
                    size={130}
                    src={imagePreview}
                    radius="md"
                    color={color}
                    name={name || "P"}
                    onClick={avatarPanel.toggle}
                  />
                </Popover.Target>
              )}
            />

            <Popover.Dropdown ref={avatarPanelRef} p={0}>
              <form.Field
                name="imageFile"
                children={(field) => {
                  const handleImageUpload = async (file: File | null) => {
                    if (!file) return;
                    field.handleChange(file);
                    avatarPanel.close();
                    const reader = new FileReader();
                    reader.onload = () =>
                      setImagePreview(reader.result as string);
                    reader.readAsDataURL(file);
                  };

                  return (
                    <>
                      <FileButton
                        onChange={handleImageUpload}
                        accept="image/png,image/jpeg"
                      >
                        {(props) => (
                          <Button
                            {...props}
                            fullWidth
                            size="md"
                            leftSection={<IconUpload size={20} />}
                            variant="subtle"
                            color="gray"
                          >
                            {field.state.value
                              ? "Change image"
                              : "Upload image"}
                          </Button>
                        )}
                      </FileButton>
                    </>
                  );
                }}
              />
              <form.Field
                name="image"
                children={(field) => (
                  <Button
                    fullWidth
                    size="md"
                    variant="subtle"
                    color="red"
                    onClick={() => {
                      field.handleChange(undefined);
                      avatarPanel.close();
                    }}
                  >
                    Remove image
                  </Button>
                )}
              />

              <Divider />
              <form.Field
                name="color"
                children={(field) => (
                  <SimpleGrid cols={4} p="xs" className="gap-1!">
                    {colorsEnum.options.map((color) => (
                      <ActionIcon
                        aria-label={`Select "${color}" as color`}
                        size={36}
                        key={color}
                        variant="transparent"
                        onClick={() => {
                          field.handleChange(color);
                          avatarPanel.close();
                        }}
                      >
                        <Box
                          bg={color}
                          className={cn("h-6 w-6 cursor-pointer rounded-full")}
                        />
                      </ActionIcon>
                    ))}
                  </SimpleGrid>
                )}
              />
            </Popover.Dropdown>
          </Popover>
          <Stack flex={1}>
            <form.Field
              name="name"
              children={(field) => (
                <TextInput
                  placeholder="Project name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />

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
        </Flex>
        <Divider />
        <form.Subscribe
          selector={(state) => state.isValid && state.isDirty}
          children={(isValid) => (
            <Button
              fullWidth
              radius={0}
              size="md"
              type="submit"
              disabled={!isValid}
            >
              Create Project
            </Button>
          )}
        />
      </form>
    </Box>
  );
}
