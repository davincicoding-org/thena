import { config } from "process";
import { openai } from "@ai-sdk/openai";
import {
  generateObject,
  generateText,
  NoObjectGeneratedError,
  Output,
  tool,
} from "ai";

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
    artifact,
  } = await req.json().then(assistantBodySchema.parse);

  const assistantConfig = getAssistantConfig(assistant);
  if (!assistantConfig) {
    return Response.json(
      { error: `Assistant "${assistant}" not found` },
      { status: 404 },
    );
  }

  const messages = (() => {
    const instructionMessages = [
      assistantConfig.instructions,
      {
        id: "language-instruction",
        role: "system",
        content: `Speak in ${lang.toUpperCase()}`,
      },
    ];

    if (!assistantConfig.attachArtifact)
      return [...instructionMessages, ...clientMessages];

    const artifactMessage = {
      id: "assistant-artifact",
      role: "system",
      content: assistantConfig.attachArtifact(artifact),
    };

    const cleanedClientMessages = clientMessages.filter(
      (message) => message.id !== artifactMessage.id,
    );

    return [...instructionMessages, ...cleanedClientMessages, artifactMessage];
  })();

  try {
    const result = await generateObject({
      model: openai("gpt-4.1-nano"),
      messages: messages,
      schema: buildAssistantSchema(assistantConfig.artifact),
      // experimental_telemetry: {
      //   isEnabled: true,
      //   functionId: "assistant",
      // },
    });

    console.log("Result");
    console.log(JSON.stringify(result.object, null, 2));

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
