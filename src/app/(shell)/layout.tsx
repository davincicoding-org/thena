import type { PropsWithChildren } from "react";
import { Suspense } from "react";

import { Shell } from "./shell";

export default function ShellLayout({ children }: PropsWithChildren) {
  return (
    <Shell>
      <Suspense>{children}</Suspense>
    </Shell>
  );
}
