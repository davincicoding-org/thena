import type { DrawerProps } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { Drawer } from "@mantine/core";

export function SidePanel({
  children,
  ...props
}: PropsWithChildren<DrawerProps>) {
  return (
    <Drawer
      position="right"
      withCloseButton={false}
      offset={24}
      radius="md"
      classNames={{
        body: "h-full p-0!",
      }}
      {...props}
    >
      {children}
    </Drawer>
  );
}
