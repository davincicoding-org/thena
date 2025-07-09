import type { ThemeIconProps } from "@mantine/core";
import type { ReactNode, Ref } from "react";
import { ThemeIcon } from "@mantine/core";
import { IconBrain } from "@tabler/icons-react";

import type { TaskComplexity } from "@/core/task-management";

export interface ComplexityIconProps {
  complexity: TaskComplexity;
  ref?: Ref<HTMLDivElement>;
}

export function ComplexityIcon({
  complexity,
  ...props
}: ComplexityIconProps & ThemeIconProps) {
  if (complexity === "0") return null;

  const { color, variant, icon, radius } = ((): {
    color: ThemeIconProps["color"];
    variant: ThemeIconProps["variant"];
    radius?: ThemeIconProps["radius"];
    icon: ReactNode;
  } => {
    switch (complexity) {
      case "1":
        return {
          color: "primary",
          variant: "transparent",
          radius: "xl",
          icon: <IconBrain size="100%" />,
        };
      case "-1":
        return {
          color: "dark",
          variant: "transparent",
          radius: "xl",
          icon: <IconBrain size="100%" />,
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
