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
import { z } from "zod";

import { colorsEnum, projectSchema } from "@/core/task-management";
import { cn } from "@/ui/utils";

const projectFormValueSchema = projectSchema.omit({ id: true });

type ProjectFormValues = z.infer<typeof projectFormValueSchema>;

export interface ProjectCreatorProps {
  onCreate: (project: ProjectFormValues) => void;
  fileUploader: (file: File) => Promise<string>;
  className?: string;
}

export function ProjectCreator({
  onCreate,
  fileUploader,
}: ProjectCreatorProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    } as ProjectFormValues,
    validators: {
      onChange: projectFormValueSchema,
    },
    onSubmit: ({ value }) => onCreate(value),
  });

  const [isAvatarPanelOpen, avatarPanel] = useDisclosure(false);
  const avatarPanelRef = useClickOutside(() => avatarPanel.close());

  const [isImageUploading, setIsImageUploading] = useState(false);

  return (
    <Paper p="md" shadow="xs" radius="md" withBorder>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Stack gap="lg">
          <Flex gap="md">
            <Popover
              opened={isAvatarPanelOpen}
              position="bottom-start"
              onClose={avatarPanel.close}
            >
              <Popover.Target>
                <form.Subscribe
                  selector={(state) => state.values}
                  children={({ image, color, name }) => (
                    <Avatar
                      className="cursor-pointer"
                      size={130}
                      src={image}
                      radius="md"
                      color={color}
                      name={name || "P"}
                      onClick={avatarPanel.toggle}
                    />
                  )}
                />
              </Popover.Target>
              <Popover.Dropdown ref={avatarPanelRef} p={0}>
                <form.Field
                  name="image"
                  children={(field) => {
                    const handleImageUpload = async (file: File | null) => {
                      if (!file) return;
                      setIsImageUploading(true);
                      const imageUrl = await fileUploader(file);
                      field.handleChange(imageUrl);
                      setIsImageUploading(false);
                      avatarPanel.close();
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
                              loading={isImageUploading}
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
                        {field.state.value && (
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
                      </>
                    );
                  }}
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
                            className={cn(
                              "h-6 w-6 cursor-pointer rounded-full",
                            )}
                          />
                        </ActionIcon>
                      ))}
                    </SimpleGrid>
                  )}
                />
              </Popover.Dropdown>
            </Popover>
            <Stack>
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
          {/* TODO: Disable button if form is not valid */}
          <Button type="submit">Create Project</Button>
        </Stack>
      </form>
    </Paper>
  );
}
