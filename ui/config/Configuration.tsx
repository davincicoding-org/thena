"use client";

import type { BoxProps } from "@mantine/core";
import { useEffect } from "react";
import {
  ActionIcon,
  Fieldset,
  Flex,
  InputLabel,
  Kbd,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Slider,
  Stack,
  Switch,
  Tabs,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconAlertCircle, IconVolume, IconX } from "@tabler/icons-react";

import type { LLMConfig } from "@/core/config/models";
import type { SupportedLang } from "@/ui/assistant";
import { LLMConfigSchema, useModelsConfigStore } from "@/core/config/models";
import {
  supportedLangSchema,
  useSpeechConfigStore,
  useSpeechSynthesis,
} from "@/ui/assistant";
import { useFlagsStore } from "@/ui/config";

const llmProviders = LLMConfigSchema.options.map(
  (option) => option.parse({}).provider,
);

export function Configuration({ ...boxProps }: BoxProps) {
  const { llm, switchLLMProvider, updateLLMConfig } = useModelsConfigStore();

  return (
    <>
      <Tabs variant="pills" defaultValue="Features" {...boxProps}>
        <Paper bg="neutral.8" radius="sm" withBorder mb="lg">
          <ScrollArea scrollbars="x">
            <Tabs.List style={{ flexWrap: "nowrap" }} grow>
              <Tabs.Tab value="Features">Features</Tabs.Tab>
              <Tabs.Tab value="Speech">Speech</Tabs.Tab>
              <Tabs.Tab value="LLM" disabled>
                LLM
              </Tabs.Tab>
            </Tabs.List>
          </ScrollArea>
        </Paper>
        <Tabs.Panel value="Features">
          <FeaturesConfig />
        </Tabs.Panel>
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

function FeaturesConfig() {
  const { flags, toggleFlag } = useFlagsStore();

  return (
    <Stack gap="sm">
      <Fieldset legend="Session Planning">
        <Switch
          label={
            <Flex gap={8} align="center">
              Time Travel
              <Tooltip label='Currently only supported in "Collect Tasks" tab.'>
                <IconAlertCircle size={16} className="stroke-amber-500" />
              </Tooltip>
            </Flex>
          }
          checked={flags["sprint-planner--time-travel"]}
          onChange={() => toggleFlag("sprint-planner--time-travel")}
          description={
            <SimpleGrid cols={2} spacing="xs">
              <div>
                <Kbd size="xs">⌘</Kbd>+<Kbd size="xs">Z</Kbd>
              </div>
              <span>Undo last Action</span>

              <div>
                <Kbd size="xs">⌘</Kbd>+<Kbd size="xs">Shift</Kbd>+
                <Kbd size="xs">Z</Kbd>
              </div>
              <span>Redo Action</span>
            </SimpleGrid>
          }
        />
      </Fieldset>
    </Stack>
  );
}

const VOICE_EXAMMPLES: Record<string, string> = {
  de: "Hallo und willkommen bei Thena! Ich helfe dir, deine Aufgaben zu planen. Was möchtest du heute erreichen?",
  en: "Hello and welcome to Thena! I will help you to plan your tasks. What do you want to achieve today?",
  es: "¡Hola y bienvenido a Thena! Te ayudaré a planificar tus tareas. ¿Qué quieres lograr hoy?",
  fr: "Bonjour et bienvenue sur Thena ! Je vais vous aider à planifier vos tâches. Que souhaitez-vous accomplir aujourd'hui ?",
  hi: "नमस्ते और Thena में आपका स्वागत है! मैं आपकी कार्यों की योजना बनाने में मदद करूंगा। आप आज क्या हासिल करना चाहते हैं?",
  id: "Halo dan selamat datang di Thena! Saya akan membantu Anda merencanakan tugas Anda. Apa yang ingin Anda capai hari ini?",
  it: "Ciao e benvenuto su Thena! Ti aiuterò a pianificare i tuoi compiti. Cosa vuoi ottenere oggi?",
  ja: "こんにちは、Thenaへようこそ! あなたのタスクを計画するお手伝いをします。今日は何を達成したいですか？",
  ko: "안녕하세요, Thena에 오신 것을 환영합니다! 당신의 작업을 계획하는 데 도와드리겠습니다. 오늘 무엇을 이루고 싶으신가요?",
  nl: "Hallo en welkom bij Thena! Ik help je met het plannen van je taken. Wat wil je vandaag bereiken?",
  pl: "Cześć i witaj w Thena! Pomogę Ci zaplanować Twoje zadania. Co chcesz dziś osiągnąć?",
  pt: "Olá e bem-vindo ao Thena! Vou ajudá-lo a planejar suas tarefas. O que você quer alcançar hoje?",
  ru: "Здравствуйте и добро пожаловать в Thena! Я помогу вам спланировать ваши задачи. Чего вы хотите достичь сегодня?",
  zh: "你好, 欢迎使用Thena! 我将帮助你规划任务。你今天想要实现什么目标？",
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
