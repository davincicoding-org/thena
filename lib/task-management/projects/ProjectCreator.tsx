import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";

import { cn } from "@/ui/utils";

import type { Project } from "../types";
import { colorsEnum, projectSchema } from "../types";

type ProjectFormValues = Omit<Project, "id">;

export interface ProjectCreatorProps {
  onCreate: (project: ProjectFormValues) => void;
  fileUploader: (file: File) => Promise<string>;
  className?: string;
}

export function ProjectCreator({
  onCreate,
  fileUploader,
}: ProjectCreatorProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema.omit({ id: true })),
  });

  const [isAvatarPanelOpen, avatarPanel] = useDisclosure(false);
  const avatarPanelRef = useClickOutside(() => avatarPanel.close());

  const [isImageUploading, setIsImageUploading] = useState(false);

  const projectName = watch("name");
  const selectedColor = watch("color");
  const uploadedImage = watch("image");

  const onSubmit = (data: ProjectFormValues) => {
    onCreate(data);
    reset();
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    setIsImageUploading(true);
    const imageUrl = await fileUploader(file);
    setValue("image", imageUrl);
    setIsImageUploading(false);
    avatarPanel.close();
  };

  return (
    <Paper p="md" shadow="xs" radius="md" withBorder>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="lg">
          <Flex gap="md">
            <Popover
              opened={isAvatarPanelOpen}
              position="bottom-start"
              onClose={avatarPanel.close}
            >
              <Popover.Target>
                <Avatar
                  className="cursor-pointer"
                  size={130}
                  src={uploadedImage}
                  radius="md"
                  color={selectedColor}
                  name={projectName || "P"}
                  onClick={avatarPanel.toggle}
                />
              </Popover.Target>
              <Popover.Dropdown ref={avatarPanelRef} p={0}>
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
                      {uploadedImage ? "Change image" : "Upload image"}
                    </Button>
                  )}
                </FileButton>
                {uploadedImage && (
                  <Button
                    fullWidth
                    size="md"
                    variant="subtle"
                    color="red"
                    onClick={() => {
                      setValue("image", undefined);
                      avatarPanel.close();
                    }}
                  >
                    Remove image
                  </Button>
                )}
                <Divider />
                <SimpleGrid cols={4} p="sm">
                  {colorsEnum.options.map((color) => (
                    <SimpleGrid cols={4} p="xs" className="gap-1!">
                      {colorsEnum.options.map((color) => (
                        <ActionIcon
                          size={36}
                          key={color}
                          variant="transparent"
                          onClick={() => {
                            setValue("color", color);
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
                  ))}
                </SimpleGrid>
              </Popover.Dropdown>
            </Popover>
            <Stack>
              <TextInput
                placeholder="Project name*"
                error={errors.name?.message}
                {...register("name", {
                  required: true,
                })}
                required
              />

              <Textarea
                placeholder="Description"
                rows={3}
                {...register("description")}
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
