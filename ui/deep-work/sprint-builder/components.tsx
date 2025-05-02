import type { HTMLAttributes, ReactNode, Ref } from "react";
import { NavLink, Paper } from "@mantine/core";

import type { FlatTask } from "@/core/task-management";
import { cn } from "@/ui/utils";

export function StandaloneTaskItemBase({
  item,
  rightSection,
  className,
  active,
  clickable,
  ...props
}: {
  item: FlatTask;
  ref?: Ref<HTMLDivElement>;
  rightSection?: ReactNode;
  clickable?: boolean;
  active?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <Paper withBorder className={cn("overflow-clip")} {...props}>
      <NavLink
        component="button"
        description={item.parentTitle}
        label={item.title}
        className={className}
        classNames={{
          root: cn({
            "cursor-default! hover:bg-[unset]!": !clickable,
          }),
          body: cn("flex flex-col-reverse"),
          label: cn("truncate text-nowrap"),
          description: cn("truncate text-nowrap"),
        }}
        rightSection={rightSection}
        active={active}
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
  active,
  ...props
}: {
  label: string;
  ref?: Ref<HTMLButtonElement>;
  rightSection?: ReactNode;
  active?: boolean;
} & HTMLAttributes<HTMLButtonElement>) {
  return (
    // @ts-expect-error - Poorly typed
    <NavLink
      component="button"
      classNames={{
        root: cn("py-1!"),
        description: cn("truncate text-nowrap"),
      }}
      description={label}
      rightSection={rightSection}
      active={active}
      {...props}
    />
  );
}

export function NestedTaskItemBase({
  item,
  rightSection,
  active,
  ...props
}: {
  item: FlatTask;
  ref?: Ref<HTMLButtonElement>;
  active?: boolean;
  rightSection?: ReactNode;
} & HTMLAttributes<HTMLButtonElement>) {
  return (
    // @ts-expect-error - Poorly typed
    <NavLink
      component="button"
      classNames={{
        root: cn("border-t! border-t-(--paper-border-color)! py-1!"),
        label: cn("truncate text-nowrap"),
      }}
      label={item.title}
      rightSection={rightSection}
      active={active}
      {...props}
    />
  );
}
