"use client";

import { domAnimation, LazyMotion } from "motion/react";

export function Motion({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
