import MarkdownView from "react-markdown";
import { TypographyStylesProvider } from "@mantine/core";

export function Markdown({ content }: { content: string }) {
  return (
    <TypographyStylesProvider>
      <MarkdownView>{content}</MarkdownView>
    </TypographyStylesProvider>
  );
}
