import type { BadgeProps } from "@mantine/core";
import { Badge } from "@mantine/core";

import type { TaskComplexity } from "@/core/task-management";

export interface ComplexityBadgeProps {
  complexity: TaskComplexity;
}

export function ComplexityBadge({
  complexity,
  ...props
}: ComplexityBadgeProps & BadgeProps) {
  const { color, variant } = ((): Pick<
    Required<BadgeProps>,
    "color" | "variant"
  > => {
    switch (complexity) {
      case "trivial":
        return { color: "green", variant: "light" };
      case "simple":
        return { color: "green", variant: "outline" };
      case "default":
        return { color: "gray", variant: "outline" };
      case "complex":
        return { color: "red", variant: "outline" };
    }
  })();

  return (
    <Badge size="xs" color={color} variant={variant} {...props}>
      {complexity}
    </Badge>
  );
}
