import type { ReactElement } from "react";
import type {
  ActionIconProps,
  FlexProps,
  OverlayProps} from "@mantine/core";
import {
  ActionIcon,
  Flex,
  Overlay
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDotsVertical } from "@tabler/icons-react";

export interface MultiActionIconProps extends ActionIconProps {
  actions: ReactElement[];
  icon?: ReactElement;
  overlayProps?: OverlayProps;
  flexProps?: FlexProps;
}
export function MultiActionIcon({
  actions,
  icon = <IconDotsVertical size={16} />,
  overlayProps,
  flexProps,
  ...props
}: MultiActionIconProps) {
  const [isOpen, { open, close }] = useDisclosure(false);

  return (
    <>
      <ActionIcon
        variant="transparent"
        color="gray"
        onMouseEnter={open}
        {...props}
      >
        {icon}
      </ActionIcon>
      {isOpen && (
        <Overlay
          display="flex"
          blur={1}
          bg="neutral.5"
          backgroundOpacity={0.35}
          onMouseLeave={close}
          left="unset"
          {...overlayProps}
        >
          <Flex align="center" ml="auto" h="100%" px="xs" {...flexProps}>
            {actions}
          </Flex>
        </Overlay>
      )}
    </>
  );
}
