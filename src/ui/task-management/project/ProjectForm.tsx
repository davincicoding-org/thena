import type {
  AvatarProps,
  FlexProps,
  TextareaProps,
  TextInputProps,
} from "@mantine/core";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  FileButton,
  Flex,
  Popover,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { IconCube, IconPhoto } from "@tabler/icons-react";

import { colorsEnum } from "@/core/task-management";
import { cn } from "@/ui/utils";

import { projectFormOpts, withProjectForm } from "./useProjectForm";

export type ProjectFormProps = {
  withImage?: boolean;
  disabled?: boolean;
  NameFieldProps?: TextInputProps;
  DescriptionFieldProps?: TextareaProps;
  ImageFieldProps?: AvatarProps;
} & FlexProps &
  Record<string, unknown>;

export const ProjectForm = withProjectForm({
  ...projectFormOpts,
  props: {} as ProjectFormProps,
  render: ({
    form,
    disabled,
    NameFieldProps,
    DescriptionFieldProps,
    ImageFieldProps,
    withImage = true,
    gap = "md" as FlexProps["gap"],
    ...flexProps
  }) => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const [isAvatarPanelOpen, avatarPanel] = useDisclosure(false);
    const avatarPanelRef = useClickOutside(() => avatarPanel.close());
    /* eslint-enable react-hooks/rules-of-hooks */

    return (
      <Flex gap={gap} {...flexProps}>
        {withImage && (
          <Popover
            opened={isAvatarPanelOpen}
            position="bottom-start"
            onClose={avatarPanel.close}
            disabled={disabled}
          >
            <form.Subscribe
              selector={(state) => state.values}
              children={({ title, image, color }) => (
                <Popover.Target>
                  <Avatar
                    className="cursor-pointer"
                    size={136}
                    src={(() => {
                      if (image === null) return null;
                      if (typeof image === "object") {
                        return `data:${image.contentType};base64,${image.base64}`;
                      }
                      return image;
                    })()}
                    radius="md"
                    color={color ?? "gray"}
                    name={title}
                    onClick={avatarPanel.toggle}
                    {...ImageFieldProps}
                  >
                    {title ? null : <IconCube size={64} />}
                  </Avatar>
                </Popover.Target>
              )}
            />

            <Popover.Dropdown ref={avatarPanelRef} p={0}>
              <form.Field
                name="image"
                children={(field) => {
                  const handleImageUpload = (file: File | null) => {
                    if (!file) return;

                    // field.handleChange(file);
                    avatarPanel.close();
                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = reader.result as string;
                      const [meta, data] = result.split(";");
                      if (meta && data) {
                        field.handleChange({
                          contentType: meta.replace(/^data:/, ""),
                          base64: data.replace(/^base64,/, ""),
                        });
                      }
                    };
                    reader.readAsDataURL(file);
                  };

                  return (
                    <>
                      <FileButton onChange={handleImageUpload} accept="image/*">
                        {(props) => (
                          <Button
                            {...props}
                            fullWidth
                            size="md"
                            leftSection={<IconPhoto size={20} />}
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
                          className={cn("h-6 w-6 cursor-pointer rounded-full")}
                        />
                      </ActionIcon>
                    ))}
                  </SimpleGrid>
                )}
              />
            </Popover.Dropdown>
          </Popover>
        )}
        {/* @ts-expect-error - poorly typed */}
        <Stack flex={1} gap={gap}>
          <form.Field
            name="title"
            children={(field) => (
              <TextInput
                placeholder="Project title"
                value={field.state.value}
                size="md"
                disabled={disabled}
                onChange={(e) => field.handleChange(e.target.value)}
                {...NameFieldProps}
              />
            )}
          />

          <form.Field
            name="description"
            children={(field) => (
              <Textarea
                placeholder="Description (optional)"
                rows={3}
                value={field.state.value ?? ""}
                disabled={disabled}
                onChange={(e) => field.handleChange(e.target.value)}
                {...DescriptionFieldProps}
              />
            )}
          />
        </Stack>
      </Flex>
    );
  },
});
