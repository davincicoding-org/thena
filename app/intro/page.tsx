"use client";

import { useInstructionsConfigStore } from "@/core/config/instructions";
import { useSpeechConfigStore } from "@/core/config/speech";
import { useMessagesConfigStore } from "@/core/config/messages";
import { useModelsConfigStore } from "@/core/config/models";
import { Chat } from "@/ui/Chat";
import { useKeyHold } from "@/ui/useKeyHold";
import { useVoiceAssistant } from "@/ui/useVoiceAssistant";
import { useChat } from "@ai-sdk/react";
import { Button, LoadingOverlay, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function IntroPage() {
  const [hasStarted, { open: startChat }] = useDisclosure(false);

  const { instructions } = useInstructionsConfigStore();
  const { speech } = useSpeechConfigStore();
  const { llm } = useModelsConfigStore();
  const { messages } = useMessagesConfigStore();
  const { speak, startListening, stopListening, listening, voices } =
    useVoiceAssistant({
      lang: speech.lang,
      voiceURI: speech.synthesis.voice,
      rate: speech.synthesis.rate,
    });

  const chat = useChat({
    initialMessages: [
      {
        id: "agent-instructions",
        role: "system",
        content: instructions.agent,
      },
    ],
    onFinish: (response) => {
      speak(response.content);
    },
    body: {
      llm,
    },
  });

  useKeyHold({
    keyCode: "Space",
    onStart: startListening,
    onRelease: async () => {
      const input = await stopListening();
      if (!input) return;
      chat.append({
        id: `voice-input-${Date.now()}`,
        role: "user",
        content: input,
      });
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
    speak(message);
  };

  return (
    <Modal
      opened
      radius="md"
      onClose={() => {}}
      withCloseButton={false}
      centered
    >
      <LoadingOverlay
        visible={listening}
        loaderProps={{ type: "dots" }}
        zIndex={1000}
        overlayProps={{
          // FIXME: This is not applied in Chrome
          blur: 4,
        }}
      />
      {!hasStarted ? (
        <Button fullWidth onClick={handleStartConversation}>
          Start
        </Button>
      ) : (
        <Chat
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
      )}
    </Modal>
  );
}
