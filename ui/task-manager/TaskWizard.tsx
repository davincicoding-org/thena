import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Box,
  BoxProps,
  Button,
  Center,
  Flex,
  Kbd,
  Stack,
  Text,
} from "@mantine/core";

import { useAgentChat } from "@/core/agents/common";
import { TASK_COLLECTOR_AGENT } from "@/core/agents/config";
import { useSpeechConfigStore } from "@/core/config/speech";
import { useKeyHold } from "@/ui/useKeyHold";

import {
  AssistantIndicator,
  AssistantIndicatorProps,
} from "../AssistantIndicator";
import { useSpeechRecognition } from "../speech/useSpeechRecognition";
import { useSpeechSynthesis } from "../speech/useSpeechSynthesis";
import { cn } from "../utils";
import { buildTaskName, TasksEditor, TasksEditorProps } from "./TasksEditor";

export interface TaskWizardProps extends BoxProps {}

export function TaskWizard({ ...boxProps }: TaskWizardProps) {
  const [stage, setStage] = useState<"START" | "COLLECTION" | "REFINEMENT">();

  const { speech } = useSpeechConfigStore();

  const [tasks, setTasks] = useState<TasksEditorProps["items"]>([]);

  const { speak, abortSpeech } = useSpeechSynthesis({
    lang: speech.lang,
    voiceURI: speech.synthesis.voice,
    rate: speech.synthesis.rate,
  });
  const { startListening, stopListening } = useSpeechRecognition({
    lang: speech.lang,
  });

  const taskCollector = useAgentChat(TASK_COLLECTOR_AGENT, {
    onResponse: async ({ reply, tasks }) => {
      taskCollector.setMessages((prev) => [
        ...prev,
        {
          id: `task-collector-${Date.now()}`,
          role: "assistant",
          content: `${reply}\n\nTasks: \n - ${tasks.join("\n - ")}`,
        },
      ]);
      setTasks(
        tasks.map((task, index) => ({
          name: buildTaskName(index),
          label: task,
        })),
      );
      await speak(reply);
      setAssistantStatus("idle");
    },
  });

  useKeyHold({
    disabled: stage === "START",
    keyCode: ["AltLeft", "AltRight"],
    onStart: async () => {
      abortSpeech();
      await startListening();
      setAssistantStatus("listening");
    },
    onRelease: async () => {
      const input = await stopListening();
      if (!input) return;

      taskCollector.append({
        id: `user-${Date.now()}`,
        role: "user",
        content: input,
      });
      setAssistantStatus("thinking");
    },
  });

  const [assistantStatus, setAssistantStatus] =
    useState<AssistantIndicatorProps["status"]>();

  return (
    <Center inline {...boxProps}>
      {stage === "START" ? (
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            taskCollector.reload();
            setStage("COLLECTION");
            setAssistantStatus("thinking");
          }}
        >
          Start
        </Button>
      ) : (
        <Flex h="100%" direction="column" align="center">
          {tasks.length > 0 && (
            <TasksEditor
              my="auto"
              w="90vw"
              maw={500}
              disableRefine
              items={tasks}
              onChange={(items) => setTasks(items)}
              onRefineTask={console.log}
            />
          )}
          <AssistantIndicator
            className={cn(tasks.length > 0 ? "w-32" : "w-64", {
              "my-auto": tasks.length === 0,
            })}
            // volume={Math.max(inputVolume * 10, outputVolume)}
            status={assistantStatus}
          />
        </Flex>
      )}
    </Center>
  );
}
