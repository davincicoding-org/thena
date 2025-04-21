import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { BoxProps, Button, Center, Flex, Stack } from "@mantine/core";

import { taskManagerResponseSchema } from "@/core/task-management/schema";
import { useKeyHold } from "@/ui/hooks/useKeyHold";
import { useSpeechConfigStore } from "@/ui/speech/config";
import { TaskList, useTaskList } from "@/ui/task-management";

import {
  AssistantIndicator,
  AssistantIndicatorProps,
} from "../assistant/AssistantIndicator";
import { useSpeechRecognition } from "../speech/useSpeechRecognition";
import { useSpeechSynthesis } from "../speech/useSpeechSynthesis";
import { cn } from "../utils";

export interface TaskWizardProps extends BoxProps {}

export function TaskWizard({ ...boxProps }: TaskWizardProps) {
  const { speech } = useSpeechConfigStore();

  const { speak, abortSpeech, isSpeaking } = useSpeechSynthesis({
    lang: speech.lang,
    voiceURI: speech.synthesis.voice,
    rate: speech.synthesis.rate,
  });
  const { startListening, stopListening, isListening } = useSpeechRecognition({
    lang: speech.lang,
  });

  const { tasks, setTasks, addTask, updateTask, removeTask } = useTaskList();

  const chat = useChat({
    api: "/api/task-manager",
    body: { tasks },
    onResponse: async (response) => {
      const { reply, tasks, usage } = await response
        .json()
        .then(taskManagerResponseSchema.parse);

      console.log(`🪙 ${usage.promptTokens} -> ${usage.completionTokens}`);

      if (tasks) setTasks(tasks);
      if (reply) {
        speak(reply);
        chat.setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}`,
            role: "assistant",
            content: reply,
          },
        ]);
      }
    },
  });

  const assistantStatus = useMemo(():
    | AssistantIndicatorProps["status"]
    | undefined => {
    if (isListening) return "listening";
    if (isSpeaking) return "speaking";
    if (chat?.status === "submitted") return "thinking";
    if (chat?.status === "streaming") return "thinking";
    return "idle";
  }, [isListening, isSpeaking, chat.status]);

  useKeyHold({
    disabled: tasks === undefined,
    keyCode: ["AltLeft", "AltRight"],
    onStart: async () => {
      abortSpeech();
      startListening();
    },
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
    <Center inline {...boxProps}>
      {tasks === undefined ? (
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            speak("What do you want to accomplish today?");
            setTasks([]);
          }}
        >
          Start
        </Button>
      ) : (
        <Flex h="100%" direction="column" align="center">
          {tasks.length > 0 && (
            <Stack my="auto">
              <TaskList
                w="90vw"
                maw={500}
                items={tasks}
                onUpdateTask={updateTask}
                onRemoveTask={removeTask}
                onAddTask={addTask}
                onRefineTask={(task) => {
                  chat.append({
                    role: "user",
                    content: `Refine the "${task.title}" task`,
                  });
                }}
              />
            </Stack>
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
