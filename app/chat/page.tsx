"use client";

import { useChat } from "@ai-sdk/react";
import { AppShell, Button, Center, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useInstructionsConfigStore } from "@/core/config/instructions";
import { useMessagesConfigStore } from "@/core/config/messages";
import { useModelsConfigStore } from "@/core/config/models";
import { useSpeechConfigStore } from "@/core/config/speech";
import { Chat } from "@/ui/Chat";
import { useSpeechSynthesis } from "@/ui/speech/useSpeechSynthesis";

export default function ChatPage() {
  const [hasStarted, { open: startChat }] = useDisclosure(false);

  const { instructions } = useInstructionsConfigStore();
  const { llm } = useModelsConfigStore();
  const { messages } = useMessagesConfigStore();

  const chat = useChat({
    initialMessages: [
      {
        id: "agent-instructions",
        role: "system",
        content: instructions.agent,
      },
    ],
    body: {
      llm,
    },
  });

  const handleStartConversation = () => {
    startChat();
    const message = messages.intro;
    chat.setMessages((prev) => [
      ...prev,
      {
        id: "assistant-intro",
        role: "assistant",
        content: message,
      },
    ]);
  };

  return (
    <AppShell.Main className="grid">
      <Center>
        {!hasStarted ? (
          <Button onClick={handleStartConversation}>Start</Button>
        ) : (
          <Container size="md">
            <Chat
              h="70dvh"
              messages={chat.messages}
              status={chat.status}
              onSend={(message) => {
                chat.append({
                  id: `manual-input-${Date.now()}`,
                  role: "user",
                  content: message,
                });
              }}
            />
          </Container>
        )}
      </Center>
    </AppShell.Main>
  );
}
