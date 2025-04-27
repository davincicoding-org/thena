"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActionIcon, AppShell, Flex, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustmentsHorizontal, IconBug } from "@tabler/icons-react";

import { Configuration } from "@/ui/misc/Configuration";
import { cn } from "@/ui/utils";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isConfigOpen, configModal] = useDisclosure(false);

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header withBorder={false}>
        <Flex py="xs" px="md" align="center" className="h-full">
          <Text
            size="xl"
            component={Link}
            href="/"
            className={cn(
              "transition-colors select-none hover:text-[var(--mantine-primary-color-filled)]!",
              {
                "pointer-events-none": pathname === "/",
              },
            )}
          >
            ConcentrAID
          </Text>

          <ActionIcon
            variant="subtle"
            color="gray"
            size="xl"
            ml="auto"
            aria-label="Known Issues"
            component={Link}
            target="_blank"
            href="https://app.gitbook.com/o/kPy0ezRDHB6tfpc9Csxy/s/dmh3WVogFloLqlQiuGx7/dev/known-issues"
          >
            <IconBug size={24} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="xl"
            // ml="auto"
            aria-label="Configuration"
            onClick={configModal.open}
          >
            <IconAdjustmentsHorizontal size={24} />
          </ActionIcon>
        </Flex>
      </AppShell.Header>

      <Modal
        title={<Text size="xl">Configuration</Text>}
        opened={isConfigOpen}
        centered
        transitionProps={{ transition: "pop" }}
        onClose={configModal.close}
      >
        <Configuration />
      </Modal>

      {children}
    </AppShell>
  );
}
