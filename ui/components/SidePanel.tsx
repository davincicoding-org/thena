import { PropsWithChildren } from "react";
import { Drawer, DrawerProps } from "@mantine/core";

export interface SidePanelProps {}

export function SidePanel({
  children,
  ...props
}: PropsWithChildren<SidePanelProps> & DrawerProps) {
  return (
    <Drawer
      position="right"
      withCloseButton={false}
      offset={24}
      radius="md"
      classNames={{
        body: "h-full",
      }}
      {...props}
    >
      {children}
    </Drawer>
  );
}
