import "./globals.css";

import {
  createTheme,
  DEFAULT_THEME,
  MantineProvider,
  virtualColor,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  colors: {
    primary: DEFAULT_THEME.colors.cyan,
    light: [
      DEFAULT_THEME.colors.dark[9],
      DEFAULT_THEME.colors.dark[8],
      DEFAULT_THEME.colors.dark[7],
      DEFAULT_THEME.colors.dark[6],
      DEFAULT_THEME.colors.dark[5],
      DEFAULT_THEME.colors.dark[4],
      DEFAULT_THEME.colors.dark[3],
      DEFAULT_THEME.colors.dark[2],
      DEFAULT_THEME.colors.dark[1],
      DEFAULT_THEME.colors.dark[0],
    ],
    // TODO: replace with a virtual color
    neutral: DEFAULT_THEME.colors.dark,
    // neutral: virtualColor({
    //   name: "neutral",
    //   dark: "primary",
    //   light: "primary",
    // }),
  },
  primaryColor: "primary",
  primaryShade: 7,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} forceColorScheme="dark">
      {children}
      <Notifications />
    </MantineProvider>
  );
}
