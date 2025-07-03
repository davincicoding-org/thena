import type { PropsWithChildren } from "react";

import { Shell } from "./shell";

export default function ShellLayout({ children }: PropsWithChildren) {
  return <Shell>{children}</Shell>;
}
