import type { StackProps, TextareaProps, TextInputProps } from "@mantine/core";
import {
  ActionIcon,
  Box,
  Flex,
  Overlay,
  ScrollArea,
  Stack,
  Textarea,
  TextInput,
  Transition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { colorsEnum } from "@/core/task-management";
import { cn } from "@/ui/utils";

import { tagFormOpts, withTagForm } from "./useTagForm";

export type TagFormProps = {
  NameFieldProps?: TextInputProps;
  DescriptionFieldProps?: TextareaProps;
} & StackProps &
  Record<string, unknown>;

export const TagForm = withTagForm({
  ...tagFormOpts,
  props: {} as TagFormProps,
  render: ({ form, NameFieldProps, DescriptionFieldProps, ...stackProps }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isColorPanelOpen, colorPanel] = useDisclosure(false);

    return (
      <Stack {...stackProps}>
        <Box>
          <Flex gap={4} pos="relative">
            <form.Field
              name="color"
              children={(field) => (
                <>
                  <ActionIcon
                    aria-label="Select Color"
                    size={
                      NameFieldProps?.size
                        ? `input-${NameFieldProps.size}`
                        : "input-sm"
                    }
                    className="group"
                    variant="transparent"
                    color="gray"
                    onClick={colorPanel.toggle}
                  >
                    <form.Subscribe selector={(state) => state.values.color}>
                      <Box
                        bg={field.state.value ?? "gray"}
                        className={cn(
                          "h-2/3 w-2/3 cursor-pointer rounded-full transition-transform group-hover:scale-110",
                        )}
                      />
                    </form.Subscribe>
                  </ActionIcon>
                  <Transition
                    mounted={isColorPanelOpen}
                    transition="fade"
                    duration={200}
                  >
                    {(styles) => (
                      <Overlay
                        radius="sm"
                        style={styles}
                        backgroundOpacity={0.9}
                        onPointerLeave={colorPanel.close}
                      >
                        <ScrollArea
                          scrollbars="x"
                          type="never"
                          className="h-full"
                          classNames={{
                            viewport: cn("*:h-full"),
                          }}
                        >
                          <Flex gap={4} className="h-full" align="center">
                            {colorsEnum.options.map((color) => (
                              <ActionIcon
                                aria-label={`Select "${color}" as color`}
                                size="md"
                                key={color}
                                variant="transparent"
                                className="group"
                                onClick={() => {
                                  field.handleChange(color);
                                  colorPanel.close();
                                }}
                              >
                                <Box
                                  bg={color}
                                  className={cn(
                                    "h-2/3 w-2/3 cursor-pointer rounded-full transition-transform group-hover:scale-110",
                                  )}
                                />
                              </ActionIcon>
                            ))}
                          </Flex>
                        </ScrollArea>
                      </Overlay>
                    )}
                  </Transition>
                </>
              )}
            />

            <form.Field
              name="name"
              children={(field) => (
                <TextInput
                  placeholder="Tag name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  {...NameFieldProps}
                />
              )}
            />
          </Flex>
        </Box>
        <form.Field
          name="description"
          children={(field) => (
            <Textarea
              placeholder="Description (optional)"
              rows={3}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              {...DescriptionFieldProps}
            />
          )}
        />
      </Stack>
    );
  },
});
