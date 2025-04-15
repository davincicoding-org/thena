import { Dispatch, SetStateAction, useState } from "react";
import { Message, useChat, UseChatHelpers } from "@ai-sdk/react";

import {
  AssistantArtifact,
  AssistantArtifactSchema,
  AssistantBody,
  AssistantConfig,
  buildAssistantSchema,
} from "@/core/assistant/common";
import { useSpeechConfigStore } from "@/core/config/speech";

export interface AssistantChatOptions<
  Artifact extends AssistantArtifactSchema,
> {
  /**
   * The assistant has generated an artifact.
   */
  onGenerate?: (artifact: AssistantArtifact<Artifact>) => void;
  /**
   * The assistant replied with a message.
   */
  onMessage: (message: string) => void;
  // disabled?: boolean;
}

export interface AssistantHook<Artifact extends AssistantArtifactSchema>
  extends Pick<
    UseChatHelpers,
    "messages" | "setMessages" | "status" | "error"
  > {
  artifact: AssistantArtifact<Artifact> | undefined;
  setArtifact: Dispatch<
    SetStateAction<AssistantArtifact<Artifact> | undefined>
  >;
  /**
   * Invokes the agent with an optional user message.
   */
  invoke: (message?: string) => void;
  /**
   * Clear the artifact and all messages .
   */
  reset: () => void;

  /**
   * Appends a user message and sends it to the assistant.
   */
  sendMessage: (message: string) => void;
  /**
   * Appends a system message and without sending it to the assistant.
   */
  attachMessage: (message: string) => void;
}

export const useAssistant = <Artifact extends AssistantArtifactSchema>(
  config: AssistantConfig<Artifact>,
  options?: AssistantChatOptions<Artifact>,
): AssistantHook<Artifact> => {
  const { speech } = useSpeechConfigStore();

  const [artifact, setArtifact] = useState<
    AssistantArtifact<Artifact> | undefined
  >();

  const body: Omit<AssistantBody, "messages"> = {
    assistant: config.name,
    lang: speech.lang,
  };

  const { messages, append, setMessages, status, error } = useChat({
    api: "/api/assistant",
    body,
    onResponse: async (response) => {
      const { message, ...artifact } = buildAssistantSchema(
        config.artifact,
      ).parse(await response.json());
      setMessages((prev) => [
        ...prev,
        {
          id: `response-${Date.now()}`,
          role: "assistant",
          content: message,
        },
      ]);
      options?.onMessage?.(message);
      options?.onGenerate?.(artifact);
    },
  });

  return {
    messages,
    setMessages,
    status,
    error,
    reset: () => {
      setArtifact(undefined);
      setMessages([config.invocation]);
    },
    artifact,
    setArtifact,
    invoke: (message?: string) => {
      const invocation: Message = message
        ? {
            id: "assistant-invocation",
            role: "user",
            content: message,
          }
        : config.invocation;
      append(invocation);
    },
    sendMessage: (message: string) => {
      append({ role: "user", content: message });
    },
    attachMessage: (message: string) => {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}`, role: "system", content: message },
      ]);
    },
  };
};
