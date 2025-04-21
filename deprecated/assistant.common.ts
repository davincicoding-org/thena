import { Message } from "ai";
import { z } from "zod";

import { supportedLangSchema } from "../ui/speech/config";

export const assistantBodySchema = z.object({
  assistant: z.string(),
  lang: supportedLangSchema,
  messages: z.array(z.any()),
  artifact: z.any().optional(),
});
export type AssistantBody = z.infer<typeof assistantBodySchema>;

export type AssistantArtifactSchema = z.AnyZodObject;

export type AssistantArtifact<Definition extends AssistantArtifactSchema> =
  z.infer<Definition>;

export interface AssistantConfig<
  Artifact extends AssistantArtifactSchema = AssistantArtifactSchema,
> {
  name: string;
  instructions: Message;
  invocation: Message;
  artifact: Artifact;
  attachArtifact?: (artifact: AssistantArtifact<Artifact>) => string;
}

export const createAssistantConfig = <
  Artifact extends AssistantArtifactSchema,
>({
  name,
  invocation,
  instructions,
  artifact,
  attachArtifact,
}: {
  name: string;
  instructions: string;
  invocation: string;
  artifact: Artifact;
  attachArtifact?: (artifact: AssistantArtifact<Artifact>) => string;
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
  attachArtifact,
});

export const buildAssistantSchema = <Artifact extends AssistantArtifactSchema>(
  artifact: Artifact,
): z.objectUtil.extendShape<Artifact, { reply: z.ZodString }> => {
  // @ts-expect-error - TODO: fix this
  return artifact.extend({
    reply: z.string().describe("A short, spoken response."),
  });
};
