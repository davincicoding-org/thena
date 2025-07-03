import type { BadgeProps } from "@mantine/core";
import { Badge } from "@mantine/core";

import type { TaskPriority } from "@/core/task-management";

export interface PriorityBadgeProps {
  priority: TaskPriority;
}

export function PriorityBadge({
  priority,
  ...props
}: PriorityBadgeProps & BadgeProps) {
  const { color, variant } = ((): Pick<
    Required<BadgeProps>,
    "color" | "variant"
  > => {
    switch (priority) {
      case "critical":
        return { color: "red", variant: "filled" };
      case "urgent":
        return { color: "orange", variant: "filled" };
      case "default":
        return { color: "gray", variant: "filled" };
      case "deferred":
        return { color: "gray", variant: "outline" };
      case "optional":
        return { color: "gray", variant: "light" };
    }
  })();

  return (
    <Badge size="xs" color={color} variant={variant} {...props}>
      {priority}
    </Badge>
  );
}
