import type { Preview } from "@storybook/react";
import type { ReactNode } from "react";
import { StrictMode } from "react";

import { ThemeProvider } from "../src/ui/Theme";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on.*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story: () => ReactNode) => (
      <StrictMode>
        <Story />
      </StrictMode>
    ),
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
