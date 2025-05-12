import type {
  AvatarProps,
  FlexProps,
  TextareaProps,
  TextInputProps,
} from "@mantine/core";
import {
  Avatar,
  Button,
  FileButton,
  Flex,
  Popover,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { IconUpload } from "@tabler/icons-react";

import { projectFormOpts, withProjectForm } from "./useProjectForm";

export type ProjectFormProps = {
  withImage?: boolean;
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
    NameFieldProps,
    DescriptionFieldProps,
    ImageFieldProps,
    withImage = true,
    gap = "md" as FlexProps["gap"],
    ...flexProps
  }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isAvatarPanelOpen, avatarPanel] = useDisclosure(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const avatarPanelRef = useClickOutside(() => avatarPanel.close());

    return (
      <Flex gap={gap} p="lg" {...flexProps}>
        {withImage && (
          <Popover
            opened={isAvatarPanelOpen}
            position="bottom-start"
            onClose={avatarPanel.close}
          >
            <form.Subscribe
              selector={(state) => state.values}
              children={({ title, image }) => (
                <Popover.Target>
                  <Avatar
                    className="cursor-pointer"
                    size={130}
                    src={(() => {
                      if (image === null) return null;
                      if (typeof image === "object") {
                        return `data:${image.contentType};base64,${image.base64}`;
                      }
                      return image;
                    })()}
                    radius="md"
                    // color={color}
                    name={title || "P"}
                    onClick={avatarPanel.toggle}
                    {...ImageFieldProps}
                  />
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

              {/* <Divider /> */}
              {/* <form.Field
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
              /> */}
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
