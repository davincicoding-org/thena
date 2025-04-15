import { createModel } from "@/server/models";
import { streamText } from "ai";
import { LLMConfigSchema, useModelsConfigStore } from "@/core/config/models";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, llm } = await req.json();

  // Get the current LLM settings from the store state
  const settings = LLMConfigSchema.parse(llm);

  const result = streamText({
    model: createModel(settings),
    messages,
    onError: (error) => {
      console.error(error);
    },
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  return result.toDataStreamResponse();
}
