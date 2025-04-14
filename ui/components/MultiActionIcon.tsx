import {
  ActionIcon,
  ActionIconProps,
  Flex,
  FlexProps,
  Overlay,
  OverlayProps,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDotsVertical } from "@tabler/icons-react";
import { ReactElement } from "react";

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
          bg="dark.5"
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
