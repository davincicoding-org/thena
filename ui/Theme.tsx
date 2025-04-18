import "./globals.css";

import { createTheme, DEFAULT_THEME, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  colors: {
    primary: DEFAULT_THEME.colors.teal,
  },
  primaryColor: "primary",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} forceColorScheme="dark">
      {children}
      <Notifications />
    </MantineProvider>
  );
}
