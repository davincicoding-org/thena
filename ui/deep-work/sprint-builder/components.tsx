import type { HTMLAttributes, ReactNode, Ref } from "react";
import { NavLink, Paper } from "@mantine/core";

import type { FlatTask } from "@/core/task-management";
import { cn } from "@/ui/utils";

export function StandaloneTaskItemBase({
  item,
  rightSection,
  className,
  ...props
}: {
  item: FlatTask;
  ref?: Ref<HTMLDivElement>;
  rightSection?: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <Paper withBorder className={cn("overflow-clip", className)} {...props}>
      <NavLink
        component="button"
        description={item.parentTitle}
        label={item.title}
        classNames={{
          body: cn("flex flex-col-reverse"),
        }}
        rightSection={rightSection}
      />
    </Paper>
  );
}

export function TaskItemsGroupContainer({
  children,
  className,
  ...props
}: {
  ref?: Ref<HTMLDivElement>;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <Paper withBorder className={cn("overflow-clip", className)} {...props}>
      {children}
    </Paper>
  );
}

export function TaskItemsGroupHeader({
  label,
  rightSection,
  className,
  ...props
}: {
  label: string;
  ref?: Ref<HTMLButtonElement>;
  rightSection?: ReactNode;
} & HTMLAttributes<HTMLButtonElement>) {
  return (
    // @ts-expect-error - Poorly typed
    <NavLink
      component="button"
      className={cn("px-1.5! py-1!", className)}
      description={label}
      rightSection={rightSection}
      {...props}
    />
  );
}

export function NestedTaskItemBase({
  item,
  rightSection,
  className,
  ...props
}: {
  item: FlatTask;
  ref?: Ref<HTMLButtonElement>;
  rightSection?: ReactNode;
} & HTMLAttributes<HTMLButtonElement>) {
  return (
    // @ts-expect-error - Poorly typed
    <NavLink
      component="button"
      className={cn(
        "border-t! border-t-(--paper-border-color)! px-2! py-1!",
        className,
      )}
      label={item.title}
      rightSection={rightSection}
      {...props}
    />
  );
}
