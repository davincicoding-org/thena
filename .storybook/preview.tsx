import { ReactNode, StrictMode } from "react";

import type { Preview } from "@storybook/react";

import { ThemeProvider } from "../ui/Theme";

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
