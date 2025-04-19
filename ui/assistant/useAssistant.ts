import { Dispatch, SetStateAction, useState } from "react";
import { Message, useChat, UseChatHelpers } from "@ai-sdk/react";

import {
  AssistantArtifact,
  AssistantArtifactSchema,
  AssistantBody,
  AssistantConfig,
  buildAssistantSchema,
} from "@/core/assistant/common";
import { interpolate, Interpolation } from "@/core/utils";
import { useSpeechConfigStore } from "@/ui/speech/config";

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
  onReply: (reply: string) => void;
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
  invoke: (params?: {
    initialArtifact?: AssistantArtifact<Artifact>;
    templateInterpolation?: Interpolation;
  }) => void;
  /**
   * Clear the artifact and all messages .
   */
  reset: () => void;

  /**
   * Appends a user message and sends it to the assistant.
   */
  sendMessage: (message: string) => void;
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
    artifact,
  };

  const { messages, append, setMessages, status, error } = useChat({
    api: "/api/assistant",
    body,
    onResponse: async (response) => {
      const { reply, ...artifact } = buildAssistantSchema(
        config.artifact,
      ).parse(await response.json());
      setMessages((prev) => [
        ...prev,
        {
          id: `response-${Date.now()}`,
          role: "assistant",
          content: reply,
        },
      ]);
      setArtifact(artifact);
      options?.onReply?.(reply);
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
    invoke: (options = {}) => {
      const invocationMessage = {
        ...config.invocation,
        content: options.templateInterpolation
          ? interpolate(
              config.invocation.content,
              options.templateInterpolation,
            )
          : config.invocation.content,
      };
      if (options.initialArtifact) {
        setArtifact(options.initialArtifact);
      }

      append(invocationMessage, {
        body: {
          artifact: options.initialArtifact,
        },
      });
    },
    sendMessage: (message: string) => {
      append({ role: "user", content: message });
    },
  };
};
