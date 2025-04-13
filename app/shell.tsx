"use client";
import { AppShell } from "@mantine/core";

export default function Shell({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
