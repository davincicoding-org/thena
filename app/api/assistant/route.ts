import { openai } from "@ai-sdk/openai";
import { generateObject, NoObjectGeneratedError } from "ai";

import {
  assistantBodySchema,
  buildAssistantSchema,
} from "@/core/assistant/common";
import { getAssistantConfig } from "@/core/assistant/config";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages: clientMessages,
    lang,
    assistant,
  } = await req.json().then(assistantBodySchema.parse);

  const agentConfig = getAssistantConfig(assistant);
  if (!agentConfig) {
    return Response.json(
      { error: `Assistant "${assistant}" not found` },
      { status: 404 },
    );
  }

  const messages = [
    agentConfig.instructions,
    {
      role: "system",
      content: `Speak in ${lang.toUpperCase()}`,
    },
    ...clientMessages,
  ];

  try {
    const result = await generateObject({
      model: openai("gpt-4.1-nano"),
      messages: messages,
      schema: buildAssistantSchema(agentConfig.artifact),
    });
    return result.toJsonResponse();
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      console.log("NoObjectGeneratedError");
      console.log("Cause:", error.cause);
      console.log("Text:", error.text);
      console.log("Response:", error.response);
      console.log("Usage:", error.usage);
    }
    return Response.json({ error }, { status: 404 });
  }
}
