import { Message } from "ai";
import { z } from "zod";

import { supportedLangSchema } from "../config/speech";

export const assistantBodySchema = z.object({
  assistant: z.string(),
  lang: supportedLangSchema,
  messages: z.any(),
});
export type AssistantBody = z.infer<typeof assistantBodySchema>;

export type AssistantArtifactSchema = z.AnyZodObject;

export type AssistantArtifact<Definition extends AssistantArtifactSchema> =
  z.infer<Definition>;

export interface AssistantConfig<
  Artifact extends AssistantArtifactSchema = AssistantArtifactSchema,
> {
  name: string;
  invocation: Message;
  instructions: Message;
  artifact: Artifact;
}

export const createAssistantConfig = <
  Artifact extends AssistantArtifactSchema,
>({
  name,
  invocation,
  instructions,
  artifact,
}: {
  name: string;
  invocation: string;
  instructions: string;
  artifact: Artifact;
}): AssistantConfig<Artifact> => ({
  name,
  invocation: {
    id: `assistant-invocation`,
    role: "system",
    content: invocation,
  },
  instructions: {
    id: `assistant-instructions`,
    role: "system",
    content: instructions,
  },
  artifact,
});

export const buildAssistantSchema = <Artifact extends AssistantArtifactSchema>(
  artifact: Artifact,
): z.objectUtil.extendShape<Artifact, { message: z.ZodString }> => {
  return artifact.extend({
    message: z.string().describe("A short, spoken response."),
  });
};
