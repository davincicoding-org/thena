import type { BoxProps } from "@mantine/core";
import { useChat } from "@ai-sdk/react";
import { Button, Center, Flex, Stack } from "@mantine/core";

import { taskManagerResponseSchema } from "@/ui/assistant/schema";
import { useKeyHold } from "@/ui/hooks/useKeyHold";
import {
  TaskCollector,
  useCreateProject,
  useProjectsQuery,
  useTaskList,
} from "@/ui/task-management";

import type { AssistantIndicatorProps } from "./AssistantIndicator";
import { cn } from "../utils";
import { AssistantIndicator } from "./AssistantIndicator";
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

  const taskList = useTaskList(tasks.items);
  const { data: projects = [] } = useProjectsQuery();
  const { mutate: createProject } = useCreateProject();

  const chat = useChat({
    api: "/api/task-manager",
    body: { tasks: taskList.tasks },
    onResponse: async (response) => {
      const {
        reply,
        tasks: _tasks,
        usage,
      } = await response
        .json()
        .then((data) => taskManagerResponseSchema.parse(data));

      console.log(`🪙 ${usage.promptTokens} -> ${usage.completionTokens}`);

      // if (tasks) taskList.setTasks(tasks);
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
    trigger: (e) => e.key === "Alt",
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
          {taskList.tasks.length > 0 && (
            <Stack my="auto">
              <TaskCollector
                w="90vw"
                maw={500}
                items={taskList.tasks}
                projects={projects}
                onUpdateTask={tasks.updateTask}
                onRemoveTask={(taskId) => taskList.removeTask(taskId)}
                onAddTask={(task) =>
                  tasks.addTask
                    .asPromise(task)
                    .then(({ id }) => taskList.addTask(id))
                }
                onRefineTask={(task) => {
                  void chat.append({
                    role: "user",
                    content: `Refine the "${task.title}" task`,
                  });
                }}
                onCreateProject={createProject}
              />
            </Stack>
          )}
          <AssistantIndicator
            className={cn(taskList.tasks.length > 0 ? "w-32" : "w-64", {
              "my-auto": taskList.tasks.length === 0,
            })}
            // volume={Math.max(inputVolume * 10, outputVolume)}
            status={assistantStatus}
          />
        </Flex>
      )}
    </Center>
  );
}
