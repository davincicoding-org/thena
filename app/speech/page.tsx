"use client";

import {
  AppShell,
  Button,
  Card,
  Center,
  Container,
  Fieldset,
  Flex,
  Group,
  SimpleGrid,
  Stack,
  Textarea,
} from "@mantine/core";
import { useSpeechRecognition } from "@/ui/speech/useSpeechRecognition";
import { useKeyHold } from "@/ui/useKeyHold";
import { useSpeechSynthesis } from "@/ui/speech/useSpeechSynthesis";
import { useEffect, useState } from "react";
import { useInputState } from "@mantine/hooks";
import { cn } from "@/ui/utils";
import { useSpeechConfigStore } from "@/core/config/speech";

export default function SpeechPage() {
  const { speech } = useSpeechConfigStore();
  const [transcriptions, setTranscriptions] = useState<
    { isFinal: boolean; text: string }[]
  >([]);

  const { startListening, stopListening, isListening } = useSpeechRecognition({
    lang: speech.lang,
    onResult: ({ results }) =>
      setTranscriptions(
        results.map((result) => ({
          isFinal: result.isFinal,
          text: result[0]!.transcript,
        }))
      ),
  });

  const [text, setText] =
    useInputState(`The easiest way to get started is to use one of the templates. All templates include required dependencies and pre-configured settings. Some templates also include additional features like Jest, Storybook, ESLint, etc.

Templates include only @mantine/core and @mantine/hooks packages, if you need additional @mantine/* packages, follow installation instructions of the package you want to use.

To get started with a template, open it on GitHub and click "Use this template" button. In order to use this feature you need to be logged in to your GitHub account. If you are not familiar with GitHub, you can find a detailed instruction on how to bootstrap a project from a template in this article.`);

  const { isSpeaking, speak, abortSpeech } = useSpeechSynthesis({
    lang: speech.lang,
    voiceURI: speech.synthesis.voice,
    rate: speech.synthesis.rate,
    mode: "quality",
  });

  useEffect(() => {
    if (isListening) {
      abortSpeech();
    }
  }, [isListening]);

  return (
    <AppShell.Main className="grid">
      <Center className="items-center">
        <SimpleGrid cols={2} className="w-full max-w-screen-md">
          <Fieldset legend="Speech Recognition">
            <Stack gap="lg">
              <Button
                variant="outline"
                onClick={() => {
                  if (isListening) {
                    return stopListening();
                  }
                  setTranscriptions([]);
                  return startListening();
                }}
              >
                {isListening ? "Stop Listening" : "Start Listening"}
              </Button>
              <Card withBorder>
                {transcriptions.map((transcription, index) => (
                  <span
                    key={index}
                    className={cn({
                      "text-neutral-400 italic": !transcription.isFinal,
                    })}
                  >
                    {transcription.text}
                  </span>
                ))}
              </Card>
            </Stack>
          </Fieldset>
          <Fieldset legend="Speech Synthesis">
            <Stack gap="lg">
              <Textarea value={text} onChange={setText} autosize minRows={4} />
              <Button
                variant="outline"
                onClick={() => (isSpeaking ? abortSpeech() : speak(text))}
              >
                {isSpeaking ? "Stop Speaking" : "Start Speaking"}
              </Button>
            </Stack>
          </Fieldset>
        </SimpleGrid>
      </Center>
    </AppShell.Main>
  );
}
