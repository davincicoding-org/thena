import type { PopoverProps } from "@mantine/core";
import type { OS } from "@mantine/hooks";
import type { PropsWithChildren, ReactNode } from "react";
import { useState } from "react";
import { Alert, Popover, Text } from "@mantine/core";
import { useDisclosure, useOs } from "@mantine/hooks";
import { motion } from "motion/react";

import { cn } from "@/ui/utils";

export interface HotKeyHintProps extends PopoverProps {
  isExecuted?: boolean;
  message: ReactNode;
}

export function HotKeyHint({
  opened,
  isExecuted,
  message,
  onClose,
  children,
}: PropsWithChildren<HotKeyHintProps>) {
  const os = useOs();
  return (
    <Popover
      position="bottom"
      radius="md"
      opened={opened}
      onClose={onClose}
      disabled={!(["macos", "linux", "windows"] as OS[]).includes(os)}
    >
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown className="max-w-64 overflow-clip" p={0}>
        {isExecuted && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Text
              component={motion.p}
              size="xl"
              fw={700}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              WHAT A PRO!
            </Text>
          </motion.div>
        )}
        <Alert
          color="primary"
          title="Pro Tip"
          p="xs"
          radius={0}
          classNames={{
            body: cn("gap-1!"),
            message: cn("[&>kbd]:align-middle"),
          }}
        >
          {message}
        </Alert>
      </Popover.Dropdown>
    </Popover>
  );
}

export const useHotKeyHint = () => {
  const [isExecuted, setIsExecuted] = useState(false);
  const [opened, tooltip] = useDisclosure(false);

  const markAsExecuted = () => {
    setIsExecuted(true);
    setTimeout(() => {
      tooltip.close();
      setTimeout(() => {
        setIsExecuted(false);
      }, 500);
    }, 2000);
  };

  return {
    opened,
    isExecuted,
    ...tooltip,
    markAsExecuted,
  };
};
