"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActionIcon, AppShell, Flex, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";

import { Configuration } from "@/ui/misc/Configuration";
import { cn } from "@/ui/utils";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isConfigOpen, configModal] = useDisclosure(false);

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header withBorder={false}>
        <Flex py="xs" px="md" gap="sm" align="center" className="h-full">
          <Text
            size="xl"
            component={Link}
            href="/"
            className={cn("select-none", {
              "pointer-events-none": pathname === "/",
            })}
          >
            ConcentrAID
          </Text>

          <ActionIcon
            variant="subtle"
            color="gray"
            size="xl"
            ml="auto"
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
        transitionProps={{ transition: "slide-down", duration: 300 }}
        onClose={configModal.close}
      >
        <Configuration />
      </Modal>

      {children}
    </AppShell>
  );
}
