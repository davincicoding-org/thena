import {
  cloneElement,
  createContext,
  ReactElement,
  ReactNode,
  useContext,
} from "react";
import {
  Box,
  BoxProps,
  Overlay,
  OverlayProps,
  Transition,
  TransitionProps,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const Context = createContext<{
  isOpen: boolean;
  disabled: boolean;
  open: () => void;
  close: () => void;
}>({
  isOpen: false,
  disabled: false,
  open: () => {},
  close: () => {},
});

export interface BoundOverlayProps {
  children: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  closeOnClick?: boolean;
  overlayProps?: OverlayProps;
  transitionProps?: TransitionProps;
}

export function BoundOverlay({
  children,
  content,
  disabled = false,
  overlayProps,
  transitionProps,
  closeOnClick,
  ...boxProps
}: BoundOverlayProps & BoxProps) {
  const [isOpen, { open, close }] = useDisclosure(false);
  return (
    <Box pos="relative" {...boxProps}>
      <Context.Provider value={{ isOpen, open, close, disabled }}>
        {children}
        <Transition
          mounted={isOpen}
          transition="fade"
          duration={400}
          {...transitionProps}
          timingFunction="ease"
        >
          {(styles) => (
            <Overlay
              onMouseLeave={close}
              onClick={closeOnClick ? close : undefined}
              style={styles}
              {...overlayProps}
            >
              {content}
            </Overlay>
          )}
        </Transition>
      </Context.Provider>
    </Box>
  );
}

function BoundOverlayTrigger({
  children,
  trigger,
}: {
  trigger: "enter" | "click";
  children: ReactElement<{
    onMouseEnter?: () => void;
    onClick?: () => void;
  }>;
}) {
  const { open, disabled } = useContext(Context);
  if (disabled) return null;
  return cloneElement(children, {
    onMouseEnter: trigger === "enter" ? open : undefined,
    onClick: trigger === "click" ? open : undefined,
  });
}

BoundOverlay.Trigger = BoundOverlayTrigger;
