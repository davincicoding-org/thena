import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { taskGroupSchema, tasksSchema } from "../task-management/schema";
import {
  AssistantConfig,
  buildAssistantSchema,
  createAssistantConfig,
} from "./common";

export const TASK_COLLECTOR_ASSISTANT = createAssistantConfig({
  name: "task-collector",
  instructions: `You are a task management assistant. Your only job is to gather a list of tasks the user wants to complete today. Do not ask for task details or offer help completing them.

- Encourage the user to continue adding tasks until they clearly say they are done.
- The user may provide one or multiple tasks at a time, or request to delete or modify existing ones.
- Always return the full, up-to-date task list as structured data — do NOT include any task content in your reply string. Tasks are shown visually, so your reply should only acknowledge input and invite the user to continue or finish.
- Return ONLY the structured output defined below, and ensure all fields are accurate. Do not include extra content outside the schema.
- Do not talk like a chatbot. Be natural, brief, and keep the conversation going until the user is finished.
- Do not force the user to use specific words.
- Ensure all tasks are clearly and beautifully phrased, using natural, grammatically correct language.
  `,
  invocation:
    "Start the conversation by asking the user what he wants to accomplish today.",
  artifact: z.object({
    tasks: z
      .array(z.string())
      .default([])
      .describe("The complete list of tasks."),
    done: z
      .boolean()
      .default(false)
      .describe("Whether the user is done adding tasks."),
  }),
});

export const TASK_REFINER_ASSISTANT = createAssistantConfig({
  name: "task-refiner",
  instructions: `You are a task management assistant. Your job is to help the user break down tasks into smaller sub-tasks.

How you manage tasks:
	•	Write task labels clearly and naturally, using correct grammar.
	•	Ensure all ref values are unique and consistently used.
	•	When refining a task, add a "tasks" field with smaller steps inside.
	•	Never leave a refined task without sub-tasks — always break it down unless the user says otherwise.
	•	Always return the full task list in structured form.

How you respond:
	•	Always include a short, conversational reply.
	•	Avoid sounding like a chatbot. Keep the tone natural and engaging.
	•	If the user doesn’t say which task to refine, ask them.
	•	If they don’t specify how to break it down, do it yourself in a reasonable way.
	•	Keep the conversation going until the user is done.

How you return output:
	•	Return only the structured object as defined in the schema.
	•	Do not include any extra explanation or comments.`,
  invocation: `
Start the conversation by asking the user if they want to refine a task into smaller sub tasks.
`,

  artifact: z.object({
    tasks: tasksSchema.describe("The user's updated task list."),
  }),
  attachArtifact: ({ tasks }) => `
  This is the user's current task list:
  ${JSON.stringify(tasks)}
  `,
});

const ASSISTANTS: AssistantConfig[] = [
  TASK_COLLECTOR_ASSISTANT,
  TASK_REFINER_ASSISTANT,
];

ASSISTANTS.forEach((assistant, i, allAssistants) => {
  const duplicates = allAssistants.filter(
    (a, index) => a.name === assistant.name && index !== i,
  );
  if (duplicates.length > 0) {
    throw new Error(`Assistant "${assistant.name}" already exists`);
  }
});

export const getAssistantConfig = (
  assistant: string,
): AssistantConfig | null => {
  return ASSISTANTS.find((config) => config.name === assistant) ?? null;
};
