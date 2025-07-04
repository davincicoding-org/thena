import type { NavLinkProps } from "@mantine/core";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { ActionIcon, Button, Flex, NavLink, Tooltip } from "@mantine/core";
import { IconArrowDownDashed, IconCheck } from "@tabler/icons-react";

import { BoundOverlay } from "@/ui/components/BoundOverlay";
import { cn } from "@/ui/utils";

export interface QueueTaskProps {
  label: string;
  group?: string;
  active?: boolean;
  status: "completed" | "skipped" | "todo";
  readOnly?: boolean;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  onComplete?: () => void;
  onSkip?: () => void;
  onUnskip?: () => void;
  onActivate?: (el: HTMLDivElement) => void;
}

export function QueueTask({
  label,
  group,
  status,
  active,
  readOnly,
  leftSection,
  rightSection = null,
  onComplete,
  onSkip,
  onUnskip,
  onActivate,
}: QueueTaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active) return;
    if (!ref.current) return;
    onActivate?.(ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const color = ((): NavLinkProps["color"] => {
    if (active) return undefined;
    switch (status) {
      case "completed":
        return "green";
      case "skipped":
        return "yellow";
      default:
        return "gray";
    }
  })();

  return (
    <BoundOverlay
      isTrigger
      disabled={!active || readOnly}
      content={
        <Flex
          className="h-full"
          justify="flex-end"
          align="center"
          px="xs"
          gap={4}
        >
          <Button
            color="green"
            size="compact-sm"
            variant="outline"
            flex={1}
            leftSection={<IconCheck size={16} />}
            onClick={onComplete}
          >
            Complete
          </Button>
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
          </Tooltip>
        </Flex>
      }
      overlayProps={{ blur: 2 }}
    >
      <NavLink
        label={label}
        description={group}
        component="div"
        ref={ref}
        py={active ? undefined : 4}
        disabled={(status === "todo" && !active) || readOnly}
        active={!active}
        color={color}
        leftSection={leftSection}
        classNames={{
          root: cn("min-w-48 opacity-100! transition-all", {
            "pointer-events-none": status !== "skipped",
          }),
          body: cn("flex flex-col-reverse", {
            "line-through": status === "completed",
            "opacity-30":
              status === "skipped" || (status === "todo" && !active),
          }),
        }}
        rightSection={rightSection}
        onClick={() => {
          if (status !== "skipped") return;
          onUnskip?.();
        }}
      />
    </BoundOverlay>
  );
}
