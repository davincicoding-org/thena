import type { ThemeIconProps } from "@mantine/core";
import type { ReactNode, Ref } from "react";
import { ThemeIcon } from "@mantine/core";
import {
  IconArrowBigDownLineFilled,
  IconArrowBigUpLineFilled,
  IconExclamationMark,
} from "@tabler/icons-react";

import type { TaskPriority } from "@/core/task-management";

export interface PriorityIconProps {
  priority: TaskPriority;
  ref?: Ref<HTMLDivElement>;
}

export function PriorityIcon({
  priority,
  ...props
}: PriorityIconProps & ThemeIconProps) {
  if (priority === "0") return null;

  const { color, variant, icon, radius } = ((): {
    color: ThemeIconProps["color"];
    variant: ThemeIconProps["variant"];
    radius?: ThemeIconProps["radius"];
    icon: ReactNode;
  } => {
    switch (priority) {
      case "2":
        return {
          color: "orange",
          variant: "filled",
          icon: <IconExclamationMark size="100%" />,
        };
      case "1":
        return {
          color: "orange",
          variant: "outline",
          radius: "xl",
          icon: <IconArrowBigUpLineFilled size="70%" />,
        };
      case "-1":
        return {
          color: "dark",
          variant: "outline",
          radius: "xl",
          icon: <IconArrowBigDownLineFilled size="70%" />,
        };
    }
  })();

  return (
    <ThemeIcon
      size="xs"
      color={color}
      variant={variant}
      radius={radius}
      {...props}
    >
      {icon}
    </ThemeIcon>
  );
}
