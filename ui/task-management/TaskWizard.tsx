import { useMemo, useState } from "react";
import { BoxProps, Button, Center, Flex, Stack } from "@mantine/core";

import { TASK_COLLECTOR_ASSISTANT } from "@/core/assistant/config";
import { useSpeechConfigStore } from "@/core/config/speech";
import { useAssistant } from "@/ui/assistant/useAssistant";
import { useKeyHold } from "@/ui/useKeyHold";

import {
  AssistantIndicator,
  AssistantIndicatorProps,
} from "../assistant/AssistantIndicator";
import { useSpeechRecognition } from "../speech/useSpeechRecognition";
import { useSpeechSynthesis } from "../speech/useSpeechSynthesis";
import { useStages } from "../useStages";
import { cn } from "../utils";
import { buildTaskName, TasksEditor, TasksEditorProps } from "./TasksEditor";

export interface TaskWizardProps extends BoxProps {}

export function TaskWizard({ ...boxProps }: TaskWizardProps) {
  const { currentStage, completeStage, isInStage } = useStages([
    {
      name: "START",
      init: () => {},
    },
    {
      name: "COLLECTION",
      init: () => taskCollector.invoke(),
    },
    {
      name: "REFINEMENT",
      init: () => {},
    },
  ]);

  const [tasks, setTasks] = useState<TasksEditorProps["items"]>([]);

  const { speech } = useSpeechConfigStore();

  const { speak, abortSpeech, isSpeaking } = useSpeechSynthesis({
    lang: speech.lang,
    voiceURI: speech.synthesis.voice,
    rate: speech.synthesis.rate,
  });
  const { startListening, stopListening, isListening } = useSpeechRecognition({
    lang: speech.lang,
  });

  const taskCollector = useAssistant(TASK_COLLECTOR_ASSISTANT, {
    onMessage: speak,
    onGenerate: ({ tasks, done }) => {
      setTasks(
        tasks.map((task, index) => ({
          name: buildTaskName(index),
          label: task,
        })) || [],
      );
      if (done) completeStage("COLLECTION");
    },
  });

  const assistantStatus = useMemo((): AssistantIndicatorProps["status"] => {
    if (isListening) return "listening";
    if (isSpeaking) return "speaking";
    if (taskCollector.status === "submitted") return "thinking";
    if (taskCollector.status === "streaming") return "thinking";
    return "idle";
  }, [isListening, isSpeaking, taskCollector.status]);

  useKeyHold({
    disabled: !isInStage(["COLLECTION", "REFINEMENT"]),
    keyCode: ["AltLeft", "AltRight"],
    onStart: async () => {
      abortSpeech();
      startListening();
    },
    onRelease: async () => {
      const input = await stopListening();
      if (!input) return;
      switch (currentStage) {
        case "COLLECTION":
          taskCollector.sendMessage(input);
          break;
        case "REFINEMENT":
          // taskRefiner.sendMessage(input);
          break;
      }
    },
  });

  return (
    <Center inline {...boxProps}>
      {currentStage === "START" ? (
        <Button
          variant="outline"
          size="lg"
          onClick={() => completeStage("START")}
        >
          Start
        </Button>
      ) : (
        <Flex h="100%" direction="column" align="center">
          {tasks.length > 0 && (
            <Stack>
              <TasksEditor
                my="auto"
                w="90vw"
                maw={500}
                disableRefine={currentStage !== "REFINEMENT"}
                items={tasks}
                onChange={(items) => setTasks(items)}
                onRefineTask={console.log}
              />
              <Button onClick={() => completeStage("COLLECTION")}>
                Refine Tasks
              </Button>
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
