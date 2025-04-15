import { useInstructionsConfigStore } from "@/core/config/instructions";
import { useSpeechConfigStore } from "@/core/config/speech";
import { useMessagesConfigStore } from "@/core/config/messages";
import { useModelsConfigStore } from "@/core/config/models";
import { useChat } from "@ai-sdk/react";
import { useKeyHold } from "@/ui/useKeyHold";
import { Button } from "@mantine/core";
import { AssistantIndicator } from "../AssistantIndicator";
import { useSpeechSynthesis } from "../speech/useSpeechSynthesis";
import { useSpeechRecognition } from "../speech/useSpeechRecognition";

export interface TaskWizardProps {}

export function TaskWizard({}: TaskWizardProps) {
  const { instructions } = useInstructionsConfigStore();
  const { speech } = useSpeechConfigStore();
  const { llm } = useModelsConfigStore();
  const { messages } = useMessagesConfigStore();

  const { speak, isSpeaking, abortSpeech } = useSpeechSynthesis({
    lang: speech.lang,
    voiceURI: speech.synthesis.voice,
    rate: speech.synthesis.rate,
  });
  const { startListening, stopListening, isListening } = useSpeechRecognition({
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
    onFinish: (response) => {
      speak(response.content);
    },
    body: {
      llm,
    },
  });

  useKeyHold({
    keyCode: "AltLeft",
    onStart: startListening,
    onRelease: async () => {
      const input = await stopListening();
      if (!input) return;
      chat.append({
        role: "user",
        content: input,
      });
    },
  });

  return (
    <div>
      {chat.messages.length === 1 ? (
        <Button variant="outline" size="lg" onClick={() => chat.reload()}>
          Start
        </Button>
      ) : (
        <AssistantIndicator
          className="w-32"
          // volume={Math.max(inputVolume * 10, outputVolume)}
          status={(() => {
            if (isListening) return "listening";
            if (isSpeaking) return "speaking";
            if (chat.status === "submitted" || chat.status === "streaming")
              return "thinking";
            return "idle";
          })()}
        />
      )}
    </div>
  );
}
