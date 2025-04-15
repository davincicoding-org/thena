import { useInstructionsConfigStore } from "@/core/config/instructions";
import { useSpeechConfigStore } from "@/core/config/speech";
import { useMessagesConfigStore } from "@/core/config/messages";
import { useModelsConfigStore } from "@/core/config/models";
import { useChat } from "@ai-sdk/react";
import { useKeyHold } from "@/ui/useKeyHold";
import { Button, Kbd, Stack, Text } from "@mantine/core";
import {
  AssistantIndicator,
  AssistantIndicatorProps,
} from "../AssistantIndicator";
import { useSpeechSynthesis } from "../speech/useSpeechSynthesis";
import { useSpeechRecognition } from "../speech/useSpeechRecognition";
import { useState } from "react";

export interface TaskWizardProps {}

export function TaskWizard({}: TaskWizardProps) {
  const { instructions } = useInstructionsConfigStore();
  const { speech } = useSpeechConfigStore();
  const { llm } = useModelsConfigStore();
  const { messages } = useMessagesConfigStore();

  const { speak, abortSpeech } = useSpeechSynthesis({
    lang: speech.lang,
    voiceURI: speech.synthesis.voice,
    rate: speech.synthesis.rate,
  });
  const { startListening, stopListening } = useSpeechRecognition({
    lang: speech.lang,
  });

  const chat = useChat({
    initialMessages: [
      {
        id: "agent-instructions",
        role: "system",
        content: instructions.agent,
      },
    ],
    onFinish: async (response) => {
      setAssistantStatus("speaking");
      await speak(response.content);
      setAssistantStatus("idle");
    },
    body: {
      llm,
    },
  });

  useKeyHold({
    keyCode: ["AltLeft", "AltRight"],
    onStart: async () => {
      abortSpeech();
      await startListening();
      setAssistantStatus("listening");
    },
    onRelease: async () => {
      const input = await stopListening();
      if (!input) return;
      chat.append({
        role: "user",
        content: input,
      });
      setAssistantStatus("thinking");
    },
  });

  const [assistantStatus, setAssistantStatus] =
    useState<AssistantIndicatorProps["status"]>();

  return (
    <div>
      {chat.messages.length === 1 ? (
        <Button variant="outline" size="lg" onClick={() => chat.reload()}>
          Start
        </Button>
      ) : (
        <Stack gap={0}>
          <AssistantIndicator
            className="w-64"
            // volume={Math.max(inputVolume * 10, outputVolume)}
            status={assistantStatus}
          />

          <Text size="xl" ta="center" h={33}>
            {assistantStatus === "idle" && (
              <>
                Hold <Kbd className="align-middle">option</Kbd> to speak
              </>
            )}
          </Text>
        </Stack>
      )}
    </div>
  );
}
