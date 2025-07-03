import type { DefaultMantineColor, Tuple } from "@mantine/core";

type ExtendedCustomColors =
  | "primary"
  | "light"
  | "neutral"
  | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}
