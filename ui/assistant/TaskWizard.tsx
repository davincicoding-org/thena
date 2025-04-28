import { useChat } from "@ai-sdk/react";
import { Button, Center, Flex, Stack } from "@mantine/core";

import type { BoxProps } from "@mantine/core";
import { taskManagerResponseSchema } from "@/ui/assistant/schema";
import { useKeyHold } from "@/ui/hooks/useKeyHold";
import {
  TaskCollector,
  useProjects,
  useTags,
  useTaskList,
} from "@/ui/task-management";

import type { AssistantIndicatorProps } from "../assistant/AssistantIndicator";
import { AssistantIndicator } from "../assistant/AssistantIndicator";
import { cn } from "../utils";
import { useSpeechConfigStore } from "./speech-config";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useSpeechSynthesis } from "./useSpeechSynthesis";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
  const { projects, createProject } = useProjects();
  const { tags, createTag } = useTags();

  const chat = useChat({
    api: "/api/task-manager",
    body: { tasks },
    onResponse: async (response) => {
      const { reply, tasks, usage } = await response
        .json()
        .then((data) => taskManagerResponseSchema.parse(data));

      console.log(`🪙 ${usage.promptTokens} -> ${usage.completionTokens}`);

      if (tasks) setTasks(tasks);
      if (reply) {
        void speak(reply);
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

  const assistantStatus = (():
    | AssistantIndicatorProps["status"]
    | undefined => {
    if (isListening) return "listening";
    if (isSpeaking) return "speaking";
    if (chat?.status === "submitted") return "thinking";
    if (chat?.status === "streaming") return "thinking";
    return "idle";
  })();

  useKeyHold({
    disabled: tasks === undefined,
    keyCode: ["AltLeft", "AltRight"],
    onStart: () => {
      void abortSpeech();
      void startListening();
    },
    onRelease: async () => {
      const input = await stopListening();
      if (!input) return;
      void chat.append({
        role: "user",
        content: input,
      });
    },
  });

  return (
    <Center inline {...boxProps}>
      {/*  FIXME: Tasks are never undefined */}
      {tasks === undefined ? (
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            void speak("What do you want to accomplish today?");
          }}
        >
          Start
        </Button>
      ) : (
        <Flex h="100%" direction="column" align="center">
          {tasks.length > 0 && (
            <Stack my="auto">
              <TaskCollector
                w="90vw"
                maw={500}
                items={tasks}
                projects={projects}
                tags={tags}
                onUpdateTask={(taskId, updates) => updateTask(taskId, updates)}
                onRemoveTask={(taskId) => removeTask(taskId)}
                onMoveTaskToBacklog={(task) => removeTask(task.id)}
                onAddTask={(task) => addTask(task)}
                onRefineTask={(task) => {
                  void chat.append({
                    role: "user",
                    content: `Refine the "${task.title}" task`,
                  });
                }}
                onCreateProject={createProject}
                onCreateTag={createTag}
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
