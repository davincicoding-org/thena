import { TypographyStylesProvider } from "@mantine/core";
import MarkdownView from "react-markdown";

export function Markdown({ content }: { content: string }) {
  return (
    <TypographyStylesProvider>
      <MarkdownView>{content}</MarkdownView>
    </TypographyStylesProvider>
  );
}
