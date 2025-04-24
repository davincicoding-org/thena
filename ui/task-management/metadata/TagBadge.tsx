import { Badge, BadgeProps } from "@mantine/core";

import { Tag } from "@/core/task-management";

export interface TagBadgeProps {
  tag: Tag;
}

export function TagBadge({ tag, ...props }: TagBadgeProps & BadgeProps) {
  return (
    <Badge color={tag.color || "gray"} variant="dot" autoContrast {...props}>
      {tag.name}
    </Badge>
  );
}
