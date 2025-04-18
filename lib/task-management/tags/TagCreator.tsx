import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";

import { cn } from "@/ui/utils";

import type { Project } from "../types";
import { colorsEnum, projectSchema } from "../types";

type TagFormValues = Omit<Project, "id">;

export interface TagCreatorProps {
  onCreate: (tag: TagFormValues) => void;
  className?: string;
}

export function TagCreator({ onCreate }: TagCreatorProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<TagFormValues>({
    resolver: zodResolver(projectSchema.omit({ id: true })),
  });

  const [isColorPanelOpen, colorPanel] = useDisclosure(false);
  const avatarPanelRef = useClickOutside(() => {});

  const [isImageUploading, setIsImageUploading] = useState(false);

  const projectName = watch("name");
  const selectedColor = watch("color");
  const uploadedImage = watch("image");

  const onSubmit = (data: TagFormValues) => {
    onCreate(data);
    reset();
  };

  return (
    <Paper p="md" shadow="xs" radius="md" withBorder>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="lg">
          <Stack>
            <Flex gap="xs">
              <Popover
                opened={isColorPanelOpen}
                position="bottom-start"
                onClose={colorPanel.close}
              >
                <Popover.Target>
                  <ActionIcon
                    size={36}
                    variant="transparent"
                    onClick={colorPanel.toggle}
                  >
                    <Box
                      bg={selectedColor || "gray"}
                      className={cn("h-6 w-6 cursor-pointer rounded-full")}
                    />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown ref={avatarPanelRef} p={0}>
                  <SimpleGrid cols={4} p="xs" className="gap-1!">
                    {colorsEnum.options.map((color) => (
                      <ActionIcon
                        size={36}
                        key={color}
                        variant="transparent"
                        onClick={() => {
                          setValue("color", color);
                          colorPanel.close();
                        }}
                      >
                        <Box
                          bg={color}
                          className={cn("h-6 w-6 cursor-pointer rounded-full")}
                        />
                      </ActionIcon>
                    ))}
                  </SimpleGrid>
                </Popover.Dropdown>
              </Popover>
              <TextInput
                placeholder="Tag name*"
                error={errors.name?.message}
                {...register("name", {
                  required: true,
                })}
                required
              />
            </Flex>

            <Textarea
              placeholder="Description"
              rows={3}
              {...register("description")}
            />
          </Stack>

          {/* TODO: Disable button if form is not valid */}
          <Button type="submit">Create Tag</Button>
        </Stack>
      </form>
    </Paper>
  );
}
