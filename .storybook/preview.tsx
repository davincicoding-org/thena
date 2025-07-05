import type { Preview } from "@storybook/react";
import { StrictMode } from "react";

import { Motion } from "@/app/motion";

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
    (Story) => (
      <StrictMode>
        <Motion>
          <ThemeProvider>
            <Story />
          </ThemeProvider>
        </Motion>
      </StrictMode>
    ),
  ],
};

export default preview;
