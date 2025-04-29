import type { NavLinkProps } from "@mantine/core";
import type { ReactElement } from "react";
import { ActionIcon, Button, Flex, NavLink, Tooltip } from "@mantine/core";
import { IconArrowDownDashed, IconCheck } from "@tabler/icons-react";

import { BoundOverlay } from "@/ui/components/BoundOverlay";
import { cn } from "@/ui/utils";

type TaskStatus = "completed" | "skipped" | "active" | "upcoming";

export interface QueueTaskProps {
  label: string;
  group?: string;
  status: TaskStatus;
  readOnly?: boolean;
  onComplete: () => void;
  onSkip: () => void;
  onRunManually: () => void;
}

export function QueueTask({
  label,
  group,
  status,
  readOnly,
  onComplete,
  onSkip,
  onRunManually,
}: QueueTaskProps) {
  const color = ((): NavLinkProps["color"] => {
    switch (status) {
      case "completed":
        return "green";
      case "skipped":
        return "yellow";
      case "active":
        return undefined;
      default:
        return "gray";
    }
  })();

  const actions = ((): ReactElement[] => {
    switch (status) {
      case "skipped":
        return [
          <Button
            key="resume"
            size="compact-xs"
            variant="outline"
            color="gray"
            fullWidth
            onClick={onRunManually}
          >
            Resume Task
          </Button>,
        ];
      case "active":
        return [
          <Button
            key="complete"
            color="green"
            size="compact-sm"
            variant="outline"
            flex={1}
            leftSection={<IconCheck size={16} />}
            onClick={onComplete}
          >
            Complete
          </Button>,
          <Tooltip label="Skip Task" key="skip">
            <ActionIcon
              aria-label="Skip Task"
              variant="subtle"
              size="md"
              color="yellow"
              onClick={onSkip}
            >
              <IconArrowDownDashed size={16} />
            </ActionIcon>
          </Tooltip>,
        ];
      case "upcoming":
        return [
          <Button
            key="jump-to"
            size="compact-xs"
            variant="outline"
            color="gray"
            fullWidth
            onClick={onRunManually}
          >
            Jump to Task
          </Button>,
        ];
      default:
        return [];
    }
  })();

  return (
    <BoundOverlay
      isTrigger
      disabled={actions.length === 0 || readOnly}
      content={
        <Flex
          className="h-full"
          justify="flex-end"
          align="center"
          px="xs"
          gap={4}
        >
          {actions}
        </Flex>
      }
      overlayProps={{ blur: 2 }}
    >
      <NavLink
        label={label}
        description={group}
        component="div"
        py={status === "active" ? undefined : 4}
        disabled={actions.length === 0 || status === "upcoming" || readOnly}
        active={status !== "active"}
        color={color}
        classNames={{
          root: "min-w-48 transition-all opacity-100!",
          label: cn({
            "line-through": status === "completed",
            "opacity-30": status === "skipped",
          }),
          body: "flex flex-col-reverse",
        }}
        rightSection={null}
      />
    </BoundOverlay>
  );
}
