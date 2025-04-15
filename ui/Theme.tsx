import "./globals.css";
import { Notifications } from "@mantine/notifications";

import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  primaryColor: "cyan",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} forceColorScheme="dark">
      {children}
      <Notifications />
    </MantineProvider>
  );
}
