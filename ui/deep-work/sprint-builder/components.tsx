import type { HTMLAttributes, ReactNode, Ref } from "react";
import { NavLink, Paper } from "@mantine/core";

import { cn } from "@/ui/utils";

export function FlatTaskBase({
  label,
  group,
  rightSection,
  className,
  active,
  clickable,
  ...props
}: {
  label: string;
  group?: string;
  ref?: Ref<HTMLDivElement>;
  rightSection?: ReactNode;
  clickable?: boolean;
  active?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <Paper withBorder className={cn("overflow-clip")} {...props}>
      <NavLink
        component="button"
        description={group}
        label={label}
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

export function TaskTreeWrapper({
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

export function TaskTreeHeader({
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

export function NestedSubtaskBase({
  label,
  rightSection,
  active,
  ...props
}: {
  label: string;
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
      label={label}
      rightSection={rightSection}
      active={active}
      {...props}
    />
  );
}
