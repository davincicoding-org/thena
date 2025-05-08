"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppShell, Flex, Text } from "@mantine/core";

import { BugReporter } from "@/ui/components/BugReporter";
import { cn } from "@/ui/utils";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header withBorder={false}>
        <Flex py="xs" px="md" gap={4} align="center" className="h-full">
          <Text
            size="xl"
            component={Link}
            href="/"
            mr="auto"
            className={cn(
              "font-(family-name:--font-logo)",
              "transition-colors select-none hover:text-[var(--mantine-primary-color-filled)]!",
              {
                "pointer-events-none": pathname === "/",
              },
            )}
          >
            THENA
          </Text>

          {/* <SignedIn>
            <UserButton /> */}
          {/* <Popover withArrow arrowPosition="center" radius="md" offset={0}>
              <Popover.Target>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="xl"
                  aria-label="Configuration"
                >
                  <IconAdjustmentsHorizontal size={24} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Configuration className="w-78" />
              </Popover.Dropdown>
            </Popover> */}
          {/* </SignedIn> */}
        </Flex>
      </AppShell.Header>
      <BugReporter
        className="fixed! top-2 right-2 z-[500]"
        variant="subtle"
        color="orange"
        size="xl"
      />
      {children}
    </AppShell>
  );
}

export const Main = AppShell.Main;
