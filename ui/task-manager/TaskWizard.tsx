import { useInstructionsConfigStore } from "@/core/config/instructions";
import { useSpeechConfigStore } from "@/core/config/speech";
import { useMessagesConfigStore } from "@/core/config/messages";
import { useModelsConfigStore } from "@/core/config/models";
import { useVoiceAssistant } from "@/ui/speech/useVoiceAssistant";
import { useChat } from "@ai-sdk/react";
import { useKeyHold } from "@/ui/useKeyHold";
import { Button, Center } from "@mantine/core";
import { AssistantIndicator } from "../AssistantIndicator";

export interface TaskWizardProps {}

export function TaskWizard({}: TaskWizardProps) {
  const { instructions } = useInstructionsConfigStore();
  const { speech } = useSpeechConfigStore();
  const { llm } = useModelsConfigStore();
  const { messages } = useMessagesConfigStore();
  const {
    speak,
    startListening,
    stopListening,
    inputVolume,
    outputVolume,
    listening,
    speaking,
  } = useVoiceAssistant({
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
    keyCode: "AltLeft",
    onStart: startListening,
    onRelease: async () => {
      const input = await stopListening();
      if (!input) return;
      console.log(input);
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
            if (listening) return "listening";
            if (speaking) return "speaking";
            if (chat.status === "submitted" || chat.status === "streaming")
              return "processing";
            return "idle";
          })()}
        />
      )}
    </div>
  );
}
