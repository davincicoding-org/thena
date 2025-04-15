import { useChat, UseChatOptions } from "@ai-sdk/react";
import { Message } from "ai";
import { z } from "zod";
import { supportedLangSchema, useSpeechConfigStore } from "../config/speech";
import { LLMConfigSchema } from "../config/models";

export const agentBodySchema = z.object({
  agent: z.string(),
  lang: supportedLangSchema,
  messages: z.any(),
  // llm: LLMConfigSchema,
});
export type AgentBody = z.infer<typeof agentBodySchema>;

export interface AgentChatOptions<Output extends z.AnyZodObject>
  extends Omit<UseChatOptions, "initialMessages" | "onResponse"> {
  onResponse?: (result: z.infer<Output>) => void;
}

export const useAgentChat = <Output extends z.AnyZodObject>(
  config: AgentConfig<Output>,
  options?: AgentChatOptions<Output>
) => {
  const { speech } = useSpeechConfigStore();
  // const { llm } = useModelsConfigStore();

  const body: Omit<AgentBody, "messages"> = {
    agent: config.name,
    lang: speech.lang,
    // llm,
  };

  return useChat({
    initialMessages: [config.initialMessage],
    ...options,
    body: {
      ...options?.body,
      ...body,
    },
    onResponse: async (response) => {
      if (!options?.onResponse) return;
      const result = config.output.parse(await response.json());
      return options.onResponse(result);
    },
  });
};

export interface AgentConfig<Output extends z.AnyZodObject = z.AnyZodObject> {
  name: string;
  initialMessage: Message;
  instructions: Message;
  output: Output;
}

export const createAgentConfig = <Output extends z.AnyZodObject>({
  name,
  initialMessage,
  instructions,
  output,
}: {
  name: string;
  initialMessage: string;
  instructions: string;
  output: Output;
}): AgentConfig<Output> => ({
  name,
  initialMessage: {
    id: `agent-invocation`,
    role: "system",
    content: initialMessage,
  },
  instructions: {
    id: `agent-instructions`,
    role: "system",
    content: instructions,
  },
  output,
});
