import { Flex, Loader, Paper, Stack, TextInput } from "@mantine/core";
import { Message, UseChatHelpers } from "@ai-sdk/react";
import { useInputState } from "@mantine/hooks";

export function Chat({
  messages,
  verbose,
  status,
  onSend,
}: {
  messages: Message[];
  status: UseChatHelpers["status"];
  verbose?: boolean;
  onSend: (message: string) => void;
}) {
  const [input, setInput] = useInputState("");

  return (
    <Stack gap="md">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} verbose={verbose} />
      ))}
      {status === "submitted" && <Loader size="sm" />}
      <TextInput
        value={input}
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
    </Stack>
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
        <Paper style={{ whiteSpace: "pre-wrap" }}>{message.content}</Paper>
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
