"use client";

import { SignIn } from "@clerk/nextjs";
import { AppShell } from "@mantine/core";

export default function Page() {
  return (
    <AppShell.Main display="grid" className="h-dvh items-center justify-center">
      <SignIn />
    </AppShell.Main>
  );
}
