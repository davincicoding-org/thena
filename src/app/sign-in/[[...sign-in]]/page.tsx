import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { Center } from "@mantine/core";

export const metadata: Metadata = {
  robots: {
    index: false,
  },
};

export default function Page() {
  return (
    <Center className="h-dvh">
      <SignIn />
    </Center>
  );
}
