import { Badge } from "@mantine/core";

import type { Tag } from "@/core/task-management";
import type { BadgeProps } from "@mantine/core";

export interface TagBadgeProps {
  tag: Tag;
}

export function TagBadge({ tag, ...props }: TagBadgeProps & BadgeProps) {
  return (
    <Badge color={tag.color ?? "gray"} variant="dot" autoContrast {...props}>
      {tag.name}
    </Badge>
  );
}
