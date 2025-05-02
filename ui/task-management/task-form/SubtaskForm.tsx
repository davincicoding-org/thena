import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Popover,
  TextInput,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { IconDotsVertical, IconX } from "@tabler/icons-react";

import { cn } from "@/ui/utils";

import { ComplexityBadge } from "../metadata/ComplexityBadge";
import { PriorityBadge } from "../metadata/PriorityBadge";
import { taskFormOpts, withTaskForm } from "./useTaskForm";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type SubtaskFormProps = {
  readOnly?: boolean;
  index: number;
  onRemove: () => void;
};

export const SubtaskForm = withTaskForm({
  ...taskFormOpts,
  props: {} as SubtaskFormProps,
  render: ({ form, readOnly, index, onRemove }) => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const [isActionsPanelOpen, actionsPanel] = useDisclosure(false);
    const actionsPanelRef = useClickOutside(() => actionsPanel.close());
    /* eslint-enable react-hooks/rules-of-hooks */

    return (
      <Popover
        position="bottom-end"
        offset={{ mainAxis: 4, crossAxis: 12 }}
        opened={isActionsPanelOpen}
        onClose={actionsPanel.close}
      >
        <Flex p={4} gap={4} className="group" align="center">
          <form.Field
            name={`subtasks[${index}].title`}
            children={(subField) => (
              <TextInput
                placeholder="Subtask"
                size="md"
                flex={1}
                classNames={{
                  input: cn(
                    "h-8! min-h-0! truncate bg-transparent! px-1.5! not-focus:border-transparent! read-only:border-transparent!",
                  ),
                }}
                value={subField.state.value ?? ""}
                readOnly={readOnly}
                onChange={(e) => subField.handleChange(e.target.value)}
                error={subField.state.meta.errors.length > 0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void form.handleSubmit();
                    e.currentTarget.blur();
                  }
                }}
              />
            )}
          />

          <form.Field
            name={`subtasks[${index}].priority`}
            children={(priorityField) => {
              if (!priorityField.state.value) return null;
              if (priorityField.state.value === "default") return null;

              return (
                <PriorityBadge
                  priority={priorityField.state.value}
                  className="cursor-pointer!"
                  size="xs"
                />
              );
            }}
          />
          <form.Field
            name={`subtasks[${index}].complexity`}
            children={(complexityField) => {
              if (!complexityField.state.value) return null;
              if (complexityField.state.value === "default") return null;

              return (
                <ComplexityBadge
                  className="cursor-pointer!"
                  complexity={complexityField.state.value}
                  size="xs"
                />
              );
            }}
          />
          {!readOnly && (
            <Popover.Target>
              <ActionIcon
                aria-label="Subtask Actions"
                variant="transparent"
                color="gray"
                onClick={actionsPanel.open}
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Popover.Target>
          )}
        </Flex>

        <Popover.Dropdown p={0} ref={actionsPanelRef}>
          <form.AppField
            name={`subtasks[${index}].priority`}
            children={(field) => <field.PriorityPicker />}
          />
          <form.AppField
            name={`subtasks[${index}].complexity`}
            children={(field) => <field.ComplexityPicker />}
          />
          <Divider />
          <Button
            color="red"
            justify="flex-start"
            fullWidth
            variant="subtle"
            leftSection={<IconX size={16} />}
            onClick={onRemove}
          >
            Remove
          </Button>
        </Popover.Dropdown>
      </Popover>
    );
  },
});
