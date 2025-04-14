import "./globals.css";

import { MantineProvider } from "@mantine/core";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <MantineProvider forceColorScheme="dark">{children}</MantineProvider>;
}
