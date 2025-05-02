import type { Updater } from "@tanstack/react-form";
import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  NavLink,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { IconChevronLeft, IconX } from "@tabler/icons-react";

import type { Tag, TagInput, TaskInput } from "@/core/task-management";
import { cn } from "@/ui/utils";

import { TagForm } from "../tags/TagForm";
import { tagFormOpts, useTagForm } from "../tags/useTagForm";

export interface TagsPickerProps {
  value: TaskInput["tags"];
  tags: Tag[];
  onClose: () => void;
  onChange: (updater: Updater<TaskInput["tags"]>) => void;
  onCreate?: (input: TagInput, callback: (tag: Tag) => void) => void;
}

export function TagsPicker({
  value,
  tags,
  onClose,
  onChange,
  onCreate,
}: TagsPickerProps) {
  const [isCreating, createPanel] = useDisclosure(false);
  const [search, setSearch] = useInputState("");

  const handleValueSelect = (val: string) => {
    onChange((current = []) => {
      const next = current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val];
      // if (next.length === 0) return undefined;
      return next;
    });
  };

  const form = useTagForm({
    ...tagFormOpts,
    onSubmit: ({ value }) => {
      createPanel.close();
      onCreate?.(value, (tag) => {
        form.reset();
        handleValueSelect(tag.id);
      });
    },
  });

  const orderedOptions = [...tags].sort((a, b) => {
    if (value?.includes(a.id)) return -1;
    if (value?.includes(b.id)) return 1;
    return a.name.localeCompare(b.name);
  });

  const trimmedSearch = search.trim();
  const filteredOptions = orderedOptions.filter((tag) => {
    if (!trimmedSearch) return true;

    return tag.name.toLowerCase().includes(trimmedSearch.toLowerCase());
  });

  return (
    <Box className="w-48">
      <Collapse in={!isCreating}>
        <Divider />
        <ScrollArea
          scrollbars="y"
          className="h-32"
          classNames={{
            scrollbar: cn("pt-10!"),
          }}
        >
          <Box className="sticky top-0 backdrop-blur-xs">
            <Flex align="center">
              <ActionIcon
                radius={0}
                variant="subtle"
                color="gray"
                h={38}
                onClick={onClose}
              >
                <IconChevronLeft size={16} />
              </ActionIcon>
              <TextInput
                placeholder="Search Tag"
                className="m-1"
                autoFocus
                value={search}
                size="xs"
                onChange={setSearch}
                rightSection={
                  <ActionIcon
                    className={cn("transition-opacity", {
                      "opacity-0": !trimmedSearch,
                    })}
                    variant="subtle"
                    color="gray"
                    size="xs"
                    onClick={() => setSearch("")}
                  >
                    <IconX size={12} />
                  </ActionIcon>
                }
              />
            </Flex>
            <Divider />
          </Box>

          {filteredOptions.map((tag) => (
            <NavLink
              key={tag.id}
              component="button"
              className="py-1!"
              active={value?.includes(tag.id)}
              color="gray"
              onClick={() => handleValueSelect(tag.id)}
              label={tag.name}
            />
          ))}
        </ScrollArea>
        <Divider />

        <Button
          variant="light"
          size="xs"
          radius={0}
          fullWidth
          onClick={createPanel.open}
        >
          Create New Tag
        </Button>
      </Collapse>
      <Divider />
      <Collapse in={isCreating}>
        <Flex gap={4} align="center" pr="md">
          <ActionIcon
            radius={0}
            variant="subtle"
            color="gray"
            onClick={createPanel.close}
          >
            <IconChevronLeft size={16} />
          </ActionIcon>
          New Tag
        </Flex>
        <Divider />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <TagForm
            form={form}
            p="xs"
            gap="xs"
            NameFieldProps={{ size: "xs" }}
            DescriptionFieldProps={{ size: "xs", rows: 2 }}
          />
          <Divider />
          <form.Subscribe
            selector={(state) => state.isValid && state.isDirty}
            children={(isValid) => (
              <Button
                radius={0}
                size="xs"
                className="transition-colors"
                fullWidth
                type="submit"
                disabled={!isValid}
              >
                Create Tag
              </Button>
            )}
          />
        </form>
      </Collapse>
    </Box>
  );
}
