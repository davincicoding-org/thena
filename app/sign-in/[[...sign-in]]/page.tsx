import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

import { Main } from "@/app/(shell)/shell";

export const metadata: Metadata = {
  robots: {
    index: false,
  },
};

export default function Page() {
  return (
    <Main display="grid" className="h-dvh items-center justify-center">
      <SignIn />
    </Main>
  );
}
