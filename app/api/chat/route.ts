import { openai } from "@ai-sdk/openai";
import { coreMessageSchema, streamText } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req
    .json()
    .then((res) =>
      z.object({ messages: z.array(coreMessageSchema) }).parse(res),
    );

  const result = streamText({
    model: openai("gpt-4.1-mini"),
    messages: messages,
  });

  return result.toDataStreamResponse();
}
