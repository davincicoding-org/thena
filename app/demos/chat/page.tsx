"use client";

import { useChat } from "@ai-sdk/react";
import { AppShell, Center, Container } from "@mantine/core";

import { useModelsConfigStore } from "@/core/config/models";
import { Chat } from "@/ui/misc/Chat";

export default function ChatPage() {
  const { llm } = useModelsConfigStore();

  const chat = useChat({
    initialMessages: [
      {
        id: "assistant-intro",
        role: "assistant",
        content:
          "Hello and welcome to Thena! I will help you to plan your tasks. What do you want to achieve today?",
      },
    ],
    body: {
      llm,
    },
  });

  return (
    <AppShell.Main className="grid">
      <Center>
        <Container size="md">
          <Chat
            h="70dvh"
            messages={chat.messages}
            status={chat.status}
            onSend={(message) =>
              chat.append({
                id: `manual-input-${Date.now()}`,
                role: "user",
                content: message,
              })
            }
          />
        </Container>
      </Center>
    </AppShell.Main>
  );
}
