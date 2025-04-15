import { z } from "zod";

import { AgentConfig, createAgentConfig } from "./common";

export const TASK_COLLECTOR_AGENT = createAgentConfig({
  name: "task-collector",
  initialMessage:
    "Start the conversation by asking the user what he wants to accomplish today.",
  instructions: `
You are a task management assistant. Your only job is to gather a list of tasks the user wants to complete today. Do not ask for task details or offer help completing them.

- Encourage the user to continue adding tasks until they clearly say they are done.
- The user may provide one or multiple tasks at a time, or request to delete or modify existing ones.
- Always return the full, up-to-date task list as structured data — do NOT include any task content in your reply string. Tasks are shown visually, so your reply should only acknowledge input and invite the user to continue or finish.
- Return ONLY the structured output defined below, and ensure all fields are accurate. Do not include extra content outside the schema.
- Do not talk like a chatbot. Be natural, brief, and keep the conversation going until the user is finished.
- Do not force the user to use specific words.
- Ensure all tasks are clearly and beautifully phrased, using natural, grammatically correct language.

  `,
  output: z.object({
    reply: z
      .string()
      .describe("A short, spoken response. Do not include any tasks."),
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

const AGENTS: AgentConfig[] = [TASK_COLLECTOR_AGENT];

AGENTS.forEach((agent, i, agents) => {
  const duplicates = agents.filter(
    (a, index) => a.name === agent.name && index !== i,
  );
  if (duplicates.length > 0) {
    throw new Error(`Agent ${agent.name} already exists`);
  }
});

export const getAgentConfig = (agent: string): AgentConfig | null => {
  return AGENTS.find((config) => config.name === agent) ?? null;
};
