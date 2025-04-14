"use client";
import {
  InstructionKey,
  useInstructionsConfigStore,
} from "@/core/config/instructions";
import { MessageKey, useMessagesConfigStore } from "@/core/config/messages";
import {
  LLMConfig,
  LLMConfigSchema,
  useModelsConfigStore,
} from "@/core/config/models";
import { IconVolume, IconX } from "@tabler/icons-react";
import { useSpeechConfigStore } from "@/core/config/speech";
import {
  Select,
  Tabs,
  InputLabel,
  Divider,
  TextInput,
  Flex,
  Textarea,
  Fieldset,
  Stack,
  Slider,
  ActionIcon,
  ScrollArea,
  Paper,
} from "@mantine/core";
import { useVoiceAssistant } from "./useVoiceAssistant";

const llmProviders = LLMConfigSchema.options.map(
  (option) => option.parse({}).provider
);

export function Configuration() {
  const { llm, switchLLMProvider, updateLLMConfig } = useModelsConfigStore();
  const { messages, updateMessage } = useMessagesConfigStore();
  const { instructions, updateInstruction } = useInstructionsConfigStore();

  return (
    <>
      <Tabs variant="pills" defaultValue="LLM" radius="xs">
        <Paper bg="dark.8" radius="sm" withBorder mb="lg">
          <ScrollArea scrollbars="x">
            <Tabs.List style={{ flexWrap: "nowrap" }} grow>
              <Tabs.Tab value="LLM">LLM</Tabs.Tab>
              <Tabs.Tab value="Speech">Speech</Tabs.Tab>
              <Tabs.Tab value="Messages">Messages</Tabs.Tab>
              <Tabs.Tab value="Instructions">Instructions</Tabs.Tab>
            </Tabs.List>
          </ScrollArea>
        </Paper>
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
        <Tabs.Panel value="Speech">
          <SpeechConfig />
        </Tabs.Panel>
        <Tabs.Panel value="Messages">
          <Stack>
            {Object.entries(messages).map(([key, content]) => (
              <Textarea
                label={key}
                key={key}
                autosize
                minRows={2}
                value={content}
                onChange={({ target: { value } }) =>
                  updateMessage(key as MessageKey, value)
                }
              />
            ))}
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="Instructions">
          <Stack>
            {Object.entries(instructions).map(([key, content]) => (
              <Textarea
                label={key}
                key={key}
                autosize
                minRows={2}
                value={content}
                onChange={({ target: { value } }) =>
                  updateInstruction(key as InstructionKey, value)
                }
              />
            ))}
          </Stack>
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
  ja: "こんにちは、Concentrateへようこそ！ あなたのタスクを計画するお手伝いをします。今日は何を達成したいですか？",
  ko: "안녕하세요, Concentrate에 오신 것을 환영합니다! 당신의 작업을 계획하는 데 도와드리겠습니다. 오늘 무엇을 이루고 싶으신가요?",
  nl: "Hallo en welkom bij Concentrate! Ik help je met het plannen van je taken. Wat wil je vandaag bereiken?",
  pl: "Cześć i witaj w Concentrate! Pomogę Ci zaplanować Twoje zadania. Co chcesz dziś osiągnąć?",
  pt: "Olá e bem-vindo ao Concentrate! Vou ajudá-lo a planejar suas tarefas. O que você quer alcançar hoje?",
  ru: "Здравствуйте и добро пожаловать в Concentrate! Я помогу вам спланировать ваши задачи. Чего вы хотите достичь сегодня?",
  zh: "你好，欢迎使用Concentrate！我将帮助你规划任务。你今天想要实现什么目标？",
};

function SpeechConfig() {
  const { speech, updateSpeechConfig, updateSynthesisConfig } =
    useSpeechConfigStore();

  const { voices, speak, speaking, cancelSpeaking } = useVoiceAssistant({
    lang: speech.lang,
    voiceURI: speech.synthesis.voice,
    rate: speech.synthesis.rate,
  });

  const googleVoices = voices.filter((voice) =>
    voice.voiceURI.startsWith("Google")
  );

  const langOptions = Array.from(
    new Set(googleVoices.map((voice) => voice.lang.substring(0, 2)))
  ).sort();

  const voiceExample = VOICE_EXAMMPLES[speech.lang];

  console.log(googleVoices);
  const voiceOptions = googleVoices
    .filter((voice) => voice.lang.startsWith(speech.lang))
    .map((voice) => ({
      label: voice.name
        .replace(/^Google /, "")
        .replace(/^./, (c) => c.toUpperCase()),
      value: voice.voiceURI,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

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
            updateSpeechConfig({ lang: value });
            const voice = googleVoices.find((voice) =>
              voice.lang.startsWith(value)
            );
            console.log(voice);
            if (voice) updateSynthesisConfig({ voice: voice.voiceURI });
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
                size="input-sm"
                variant="light"
                color={speaking ? "red" : undefined}
                onClick={() =>
                  speaking ? cancelSpeaking() : speak(voiceExample)
                }
              >
                {speaking ? <IconX /> : <IconVolume />}
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
