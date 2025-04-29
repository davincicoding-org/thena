"use client";

import { useEffect } from "react";
import {
  ActionIcon,
  Fieldset,
  Flex,
  InputLabel,
  Paper,
  ScrollArea,
  Select,
  Slider,
  Stack,
  Tabs,
  TextInput,
} from "@mantine/core";
import { IconVolume, IconX } from "@tabler/icons-react";

import type { LLMConfig } from "@/core/config/models";
import type { SupportedLang } from "@/ui/assistant";
import { LLMConfigSchema, useModelsConfigStore } from "@/core/config/models";
import {
  supportedLangSchema,
  useSpeechConfigStore,
  useSpeechSynthesis,
} from "@/ui/assistant";

const llmProviders = LLMConfigSchema.options.map(
  (option) => option.parse({}).provider,
);

export function Configuration() {
  const { llm, switchLLMProvider, updateLLMConfig } = useModelsConfigStore();

  return (
    <>
      <Tabs variant="pills" defaultValue="Speech" radius="xs">
        <Paper bg="neutral.8" radius="sm" withBorder mb="lg">
          <ScrollArea scrollbars="x">
            <Tabs.List style={{ flexWrap: "nowrap" }} grow>
              <Tabs.Tab value="Speech">Speech</Tabs.Tab>
              <Tabs.Tab value="LLM" disabled>
                LLM
              </Tabs.Tab>
            </Tabs.List>
          </ScrollArea>
        </Paper>
        <Tabs.Panel value="Speech">
          <SpeechConfig />
        </Tabs.Panel>
        <Tabs.Panel value="LLM">
          <Flex
            display="grid"
            style={{ gridTemplateColumns: "auto 1fr" }}
            rowGap="xs"
            columnGap="sm"
            align="center"
          >
            <InputLabel>Provider</InputLabel>
            <Select
              data={llmProviders}
              value={llm.provider}
              onChange={(value) =>
                switchLLMProvider(value as LLMConfig["provider"])
              }
            />
            {"model" in llm && (
              <>
                <InputLabel>Model</InputLabel>
                <TextInput
                  value={llm.model}
                  onChange={({ target: { value } }) =>
                    updateLLMConfig({ model: value })
                  }
                />
              </>
            )}
            {"baseURL" in llm && (
              <>
                <InputLabel>Base URL</InputLabel>
                <TextInput
                  value={llm.baseURL}
                  onChange={({ target: { value } }) =>
                    updateLLMConfig({ baseURL: value })
                  }
                />
              </>
            )}
          </Flex>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

const VOICE_EXAMMPLES: Record<string, string> = {
  de: "Hallo und willkommen bei Concentrate! Ich helfe dir, deine Aufgaben zu planen. Was möchtest du heute erreichen?",
  en: "Hello and welcome to Concentrate! I will help you to plan your tasks. What do you want to achieve today?",
  es: "¡Hola y bienvenido a Concentrate! Te ayudaré a planificar tus tareas. ¿Qué quieres lograr hoy?",
  fr: "Bonjour et bienvenue sur Concentrate ! Je vais vous aider à planifier vos tâches. Que souhaitez-vous accomplir aujourd'hui ?",
  hi: "नमस्ते और Concentrate में आपका स्वागत है! मैं आपकी कार्यों की योजना बनाने में मदद करूंगा। आप आज क्या हासिल करना चाहते हैं?",
  id: "Halo dan selamat datang di Concentrate! Saya akan membantu Anda merencanakan tugas Anda. Apa yang ingin Anda capai hari ini?",
  it: "Ciao e benvenuto su Concentrate! Ti aiuterò a pianificare i tuoi compiti. Cosa vuoi ottenere oggi?",
  ja: "こんにちは、Concentrateへようこそ! あなたのタスクを計画するお手伝いをします。今日は何を達成したいですか？",
  ko: "안녕하세요, Concentrate에 오신 것을 환영합니다! 당신의 작업을 계획하는 데 도와드리겠습니다. 오늘 무엇을 이루고 싶으신가요?",
  nl: "Hallo en welkom bij Concentrate! Ik help je met het plannen van je taken. Wat wil je vandaag bereiken?",
  pl: "Cześć i witaj w Concentrate! Pomogę Ci zaplanować Twoje zadania. Co chcesz dziś osiągnąć?",
  pt: "Olá e bem-vindo ao Concentrate! Vou ajudá-lo a planejar suas tarefas. O que você quer alcançar hoje?",
  ru: "Здравствуйте и добро пожаловать в Concentrate! Я помогу вам спланировать ваши задачи. Чего вы хотите достичь сегодня?",
  zh: "你好, 欢迎使用Concentrate! 我将帮助你规划任务。你今天想要实现什么目标？",
};

function SpeechConfig() {
  const { speech, updateSpeechConfig, updateSynthesisConfig } =
    useSpeechConfigStore();

  const { voices, speak, isSpeaking, abortSpeech } = useSpeechSynthesis({
    lang: speech.lang,
    voiceURI: speech.synthesis.voice,
    rate: speech.synthesis.rate,
  });

  const langOptions = supportedLangSchema.options.sort();

  const voiceExample = VOICE_EXAMMPLES[speech.lang];

  const voiceOptions = voices.map((voice) => voice.voiceURI).sort();

  useEffect(() => {
    if (!speech.synthesis.voice) return;
    if (voiceOptions.length === 0) return;
    if (voiceOptions.includes(speech.synthesis.voice)) return;
    updateSynthesisConfig({ voice: voiceOptions[0] });
  }, [
    voiceOptions,
    speech.synthesis.voice,
    speech.lang,
    updateSynthesisConfig,
  ]);

  return (
    <Stack gap="sm">
      <Flex justify="space-between" align="center" px="md">
        <InputLabel>Language</InputLabel>
        <Select
          w={100}
          data={langOptions}
          value={speech.lang}
          onChange={(value) => {
            if (!value) return;
            updateSpeechConfig({ lang: value as SupportedLang });
          }}
        />
      </Flex>
      <Fieldset legend="Synthesis">
        <Flex
          display="grid"
          style={{ gridTemplateColumns: "auto 1fr" }}
          rowGap="sm"
          columnGap="md"
          align="center"
        >
          <InputLabel>Model</InputLabel>
          <Select disabled data={["browser"]} defaultValue="browser" />
          <InputLabel>Voice</InputLabel>
          <Flex gap="xs">
            <Select
              flex={1}
              data={voiceOptions}
              disabled={voiceOptions.length < 2}
              value={speech.synthesis.voice}
              onChange={(value) => {
                if (!value) return;
                updateSynthesisConfig({ voice: value });
              }}
            />
            {voiceExample && (
              <ActionIcon
                aria-label="Speak Example"
                size="input-sm"
                variant="light"
                color={isSpeaking ? "red" : undefined}
                onClick={() =>
                  isSpeaking ? abortSpeech() : speak(voiceExample)
                }
              >
                {isSpeaking ? <IconX /> : <IconVolume />}
              </ActionIcon>
            )}
          </Flex>

          <InputLabel>Speed</InputLabel>
          <Slider
            style={{ alignSelf: "start" }}
            value={speech.synthesis.rate}
            onChange={(value) => updateSynthesisConfig({ rate: value })}
            min={0.5}
            max={1.5}
            step={0.25}
            marks={[
              { value: 0.5, label: "Slow" },
              { value: 1, label: "Normal" },
              { value: 1.5, label: "Fast" },
            ]}
          />
        </Flex>
      </Fieldset>

      <Fieldset legend="Recognition">
        <Flex
          display="grid"
          style={{ gridTemplateColumns: "auto 1fr" }}
          rowGap="sm"
          columnGap="md"
          align="center"
        >
          <InputLabel>Model</InputLabel>
          <Select disabled data={["browser"]} defaultValue="browser" />
        </Flex>
      </Fieldset>
    </Stack>
  );
}
