import type { Message, UseChatHelpers } from "@ai-sdk/react";
import type {
  BoxProps} from "@mantine/core";
import {
  ActionIcon,
  Box,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  TextInput,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconMicrophone, IconPlayerPause } from "@tabler/icons-react";

import { useSpeechConfigStore, useSpeechRecognition } from "@/ui/assistant";
import { Markdown } from "@/ui/components/Markdown";

export interface ChatProps extends BoxProps {
  messages: Message[];
  status: UseChatHelpers["status"];
  verbose?: boolean;
  onSend: (message: string) => void;
}

export function Chat({
  messages,
  verbose,
  status,
  onSend,
  ...boxProps
}: ChatProps) {
  const [input, setInput] = useInputState("");
  const { speech } = useSpeechConfigStore();
  const { startListening, stopListening, isListening } = useSpeechRecognition({
    lang: speech.lang,
    onResult: ({ results }) => {
      setInput(
        Array.from(results)
          .map((result) => result.item(0).transcript.trim())
          .join(" "),
      );
    },
  });

  return (
    <Box {...boxProps}>
      <ScrollArea scrollbars="y" {...boxProps}>
        <Stack gap="md" px="md">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} verbose={verbose} />
          ))}
          {status === "submitted" && <Loader size="sm" />}
        </Stack>
      </ScrollArea>
      <TextInput
        disabled={isListening}
        value={isListening ? "Listening..." : input}
        size="lg"
        pos="sticky"
        placeholder="Type a message..."
        bottom={0}
        leftSection={isListening ? <Loader size="sm" /> : null}
        rightSection={
          <ActionIcon
            aria-label={isListening ? "Stop Listening" : "Start Listening"}
            size="lg"
            radius="sm"
            color={isListening ? "red" : "gray"}
            variant={isListening ? "filled" : "transparent"}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? <IconPlayerPause /> : <IconMicrophone />}
          </ActionIcon>
        }
        onChange={setInput}
        onKeyDown={(e) => {
          if (e.currentTarget.value.length === 0 && e.code === "Space")
            return e.preventDefault();
          if (e.code === "Space") e.stopPropagation();
          if (e.code === "Enter") {
            onSend(e.currentTarget.value);
            setInput("");
          }
        }}
      />
    </Box>
  );
}

function ChatMessage({
  message,
  verbose,
}: {
  message: Message;
  verbose?: boolean;
}) {
  switch (message.role) {
    case "user":
      return (
        <Paper maw="70%" p={4} px="xs" ml="auto" radius="md" bg="gray.8">
          {message.content}
        </Paper>
      );
    case "assistant":
      return (
        <Paper>
          <Markdown content={message.content} />
        </Paper>
      );
    case "system":
      if (!verbose) return null;
      return (
        <Paper
          maw="70%"
          p={4}
          px="xs"
          mr="auto"
          radius="md"
          bg="gray.8"
          style={{ fontStyle: "italic" }}
        >
          {message.content}
        </Paper>
      );
    default:
      return null;
  }
}
