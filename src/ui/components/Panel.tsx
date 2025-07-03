import type { CardProps, PaperProps } from "@mantine/core";
import type { ReactNode, Ref } from "react";
import { Card, Divider, Paper } from "@mantine/core";

import { cn } from "@/ui/utils";

export interface PanelProps {
  header: ReactNode;
  headerProps?: CardProps;
  ref?: Ref<HTMLDivElement>;
  children: ReactNode;
}

export function Panel({
  header,
  children,
  className,
  headerProps,
  ...paperProps
}: PanelProps & PaperProps) {
  return (
    <Paper
      withBorder
      radius="md"
      shadow="xs"
      display="grid"
      className={cn("grid-rows-[auto_auto_1fr] overflow-clip", className)}
      {...paperProps}
    >
      <Card
        radius={0}
        p={0}
        bg="neutral.5"
        {...headerProps}
        className={cn("shrink-0", headerProps?.className)}
      >
        {header}
      </Card>
      <Divider />
      {children}
    </Paper>
  );
}
