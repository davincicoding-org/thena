import type { PaperProps } from "@mantine/core";
import { useRef } from "react";
import {
  ActionIcon,
  Flex,
  Menu,
  NumberInput,
  ScrollArea,
  Text,
} from "@mantine/core";
import {
  IconArrowBarToLeft,
  IconArrowBarToRight,
  IconArrowLeft,
  IconArrowRight,
  IconClock,
  IconDotsVertical,
  IconGripVertical,
  IconX,
} from "@tabler/icons-react";

import type { Duration, SprintPlan } from "@/core/deep-work";
import type { FlatTask, TaskId } from "@/core/task-management";
import { resolveDuration } from "@/core/deep-work";
import { Panel } from "@/ui/components/Panel";
import { cn } from "@/ui/utils";

import { FlatTaskBase } from "./components";
import { SortableTasksContainer, useSortableTask } from "./dnd";

export interface SprintPanelProps {
  sprintId: SprintPlan["id"];
  duration: Duration;
  tasks: FlatTask[];
  dndEnabled: boolean;
  moveOptions: {
    start: boolean;
    left: boolean;
    right: boolean;
    end: boolean;
  };
  onMove: (direction: "start" | "left" | "right" | "end") => void;
  onDrop: () => void;
  onDurationChange: (duration: Duration) => void;
  onUnassignTasks: (tasks: TaskId[]) => void;
}

export function SprintPanel({
  sprintId,
  duration,
  tasks,
  dndEnabled,
  moveOptions,
  onMove,
  onDrop,
  onDurationChange,
  onUnassignTasks,
  className,
  ...props
}: SprintPanelProps & PaperProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const durationMinutes = resolveDuration(duration).asMinutes();

  return (
    <Panel
      ref={panelRef}
      header={
        <Menu position="bottom-end">
          <Flex
            align="center"
            justify="space-between"
            gap={4}
            pl="xs"
            pr={4}
            py={4}
          >
            <NumberInput
              className="-my-1 -mr-1 shrink-0 not-focus-within:cursor-pointer"
              classNames={{
                input: cn("not-focus:cursor-pointer!"),
              }}
              hideControls
              leftSection={<IconClock size={16} />}
              radius="xl"
              size="xs"
              ff="monospace"
              value={durationMinutes}
              w={40 + durationMinutes.toString().length * 8}
              min={5}
              max={90}
              step={5}
              styles={{
                input: {
                  fontFamily: "inherit",
                  textAlign: "center",
                },
              }}
              onChange={(value) => {
                if (typeof value !== "number") return;
                onDurationChange({ minutes: Math.min(value, 90) });
              }}
            />

            <Menu.Target>
              <ActionIcon
                className="ml-1"
                aria-label="Sprint Options"
                variant="subtle"
                color="gray"
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
          </Flex>
          <Menu.Dropdown>
            {moveOptions.start && (
              <Menu.Item
                leftSection={<IconArrowBarToLeft size={16} />}
                onClick={() => onMove("start")}
              >
                Move to Start
              </Menu.Item>
            )}
            {moveOptions.left && (
              <Menu.Item
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => onMove("left")}
              >
                Move to Left
              </Menu.Item>
            )}
            {moveOptions.right && (
              <Menu.Item
                leftSection={<IconArrowRight size={16} />}
                onClick={() => onMove("right")}
              >
                Move to Right
              </Menu.Item>
            )}
            {moveOptions.end && (
              <Menu.Item
                leftSection={<IconArrowBarToRight size={16} />}
                onClick={() => onMove("end")}
              >
                Move to End
              </Menu.Item>
            )}
            <Menu.Divider className="nth-[2]:hidden" />
            <Menu.Item
              color="red"
              leftSection={<IconX size={16} />}
              onClick={onDrop}
            >
              Drop Sprint
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      }
      className={cn(
        "min-w-64 transition-opacity",

        className,
      )}
      {...props}
    >
      <ScrollArea scrollbars="y" scrollHideDelay={300} type="never">
        <SortableTasksContainer
          id={sprintId}
          items={tasks.map((task) => task.uid)}
          enabled
        >
          {tasks.map((task) => (
            <FlatTaskItem
              key={task.uid}
              item={task}
              dndEnabled={dndEnabled}
              onUnassignTasks={onUnassignTasks}
            />
          ))}
        </SortableTasksContainer>
      </ScrollArea>
    </Panel>
  );
}

// MARK: Items

interface FlatTaskItemProps extends Pick<SprintPanelProps, "onUnassignTasks"> {
  item: FlatTask;
  dndEnabled: boolean;
}

function FlatTaskItem({
  item,
  dndEnabled,
  onUnassignTasks,
}: FlatTaskItemProps) {
  const { attributes, listeners, setNodeRef, style, isDragging, active } =
    useSortableTask(item, dndEnabled);

  return (
    <Menu
      position="bottom-end"
      disabled={dndEnabled}
      offset={{
        mainAxis: 0,
      }}
    >
      <Menu.Target>
        <FlatTaskBase
          group={"parent" in item ? item.parent.title : undefined}
          label={item.title}
          className={cn("w-xs transition-opacity", {
            "*:cursor-grab!": dndEnabled,
            "pointer-events-none opacity-30": isDragging,
          })}
          rightSection={
            active && dndEnabled ? null : dndEnabled ? (
              <IconGripVertical size={12} />
            ) : (
              <IconDotsVertical size={12} />
            )
          }
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
        />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          color="red"
          leftSection={<IconX size={16} />}
          onClick={() => onUnassignTasks([item.uid])}
        >
          Unassign
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
