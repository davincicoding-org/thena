import type { BoxProps, OverlayProps, TransitionProps } from "@mantine/core";
import type { ReactElement, ReactNode } from "react";
import { cloneElement, createContext, useContext, useEffect } from "react";
import { Box, Overlay, Transition } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const Context = createContext<{
  isOpen: boolean;
  disabled: boolean;
  trigger: "enter" | "click";
  open: () => void;
  close: () => void;
}>({
  isOpen: false,
  disabled: false,
  trigger: "enter",
  open: () => void 0,
  close: () => void 0,
});

export interface BoundOverlayProps {
  children: ReactNode;
  content: ReactNode;
  trigger?: "enter" | "click";
  isTrigger?: boolean;
  disabled?: boolean;
  closeOnClick?: boolean;
  overlayProps?: OverlayProps;
  transitionProps?: TransitionProps;
}

export function BoundOverlay({
  children,
  content,
  disabled = false,
  trigger = "enter",
  isTrigger,
  overlayProps,
  transitionProps,
  closeOnClick,
  ...boxProps
}: BoundOverlayProps & BoxProps) {
  const [isOpen, { open, close }] = useDisclosure(false);
  useEffect(() => {
    if (!disabled) return;
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  return (
    <Box
      pos="relative"
      {...boxProps}
      onMouseLeave={close}
      onClick={isTrigger && trigger === "click" && !disabled ? open : undefined}
      onMouseEnter={
        isTrigger && trigger === "enter" && !disabled ? open : undefined
      }
    >
      <Context.Provider value={{ isOpen, open, close, disabled, trigger }}>
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
}: {
  children: ReactElement<{
    onMouseEnter?: () => void;
    onClick?: () => void;
  }>;
}) {
  const { open, disabled, trigger } = useContext(Context);
  if (disabled) return null;
  return cloneElement(children, {
    onMouseEnter: trigger === "enter" ? open : undefined,
    onClick: trigger === "click" ? open : undefined,
  });
}

BoundOverlay.Trigger = BoundOverlayTrigger;
