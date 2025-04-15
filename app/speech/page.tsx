"use client";

import { AppShell, Button, Center, Group } from "@mantine/core";
import { useSpeechRecognition } from "@/ui/speech/useSpeechRecognition";
import { useKeyHold } from "@/ui/useKeyHold";
import { useSpeechSynthesis } from "@/ui/speech/useSpeechSynthesis";
import { useEffect } from "react";
const transcript = `
The easiest way to get started is to use one of the templates. All templates include required dependencies and pre-configured settings. Some templates also include additional features like Jest, Storybook, ESLint, etc.

Templates include only @mantine/core and @mantine/hooks packages, if you need additional @mantine/* packages, follow installation instructions of the package you want to use.

To get started with a template, open it on GitHub and click "Use this template" button. In order to use this feature you need to be logged in to your GitHub account. If you are not familiar with GitHub, you can find a detailed instruction on how to bootstrap a project from a template in this article.
`;

export default function SpeechPage() {
  const { startListening, stopListening, isListening } = useSpeechRecognition({
    lang: "de",
  });

  const { isSpeaking, speak, abortSpeech, voices } = useSpeechSynthesis({
    lang: "en",
    mode: "quality",
  });

  useEffect(() => {
    if (isListening) {
      abortSpeech();
    }
  }, [isListening]);

  useKeyHold({
    keyCode: "AltLeft",
    onStart: startListening,
    onRelease: () =>
      stopListening().then((transcription) => {
        console.log(transcription);
      }),
  });

  return (
    <AppShell.Main display="flex">
      <Center m="auto">
        <Button
          variant="outline"
          onClick={() => (isSpeaking ? abortSpeech() : speak(transcript))}
        >
          {isSpeaking ? "Stop" : "Speak"}
        </Button>
      </Center>
    </AppShell.Main>
  );
}
