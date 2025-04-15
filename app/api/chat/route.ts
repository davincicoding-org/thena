import { openai } from "@ai-sdk/openai";
import { generateObject, NoObjectGeneratedError } from "ai";
import { agentBodySchema } from "@/core/agents/common";
import { getAgentConfig } from "@/core/agents/config";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages: clientMessages,
    lang,
    agent,
  } = await req.json().then(agentBodySchema.parse);

  const agentConfig = getAgentConfig(agent);
  if (!agentConfig) {
    return Response.json(
      { error: `Agent "${agent}" not found` },
      { status: 404 }
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
      // model: createModel(llm),
      model: openai("gpt-4.1-nano"),
      messages: messages,
      schema: agentConfig.output,
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
