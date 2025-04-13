import { z } from "zod";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const LLMConfigLmStudioSchema = z.object({
  provider: z.literal("lmstudio").default("lmstudio"),
  model: z.string().default("meta-llama-3.1-8b-instruct"),
  baseURL: z.string().url().default("http://localhost:1234/v1"),
});
export type LLMConfigLmStudio = z.infer<typeof LLMConfigLmStudioSchema>;

const LLMConfigOllamaSchema = z.object({
  provider: z.literal("ollama").default("ollama"),
  model: z.string().default("gemma3:4b-it-q4_K_M"),
  baseURL: z.string().url().default("http://localhost:11434/api"),
});
export type LLMConfigOllama = z.infer<typeof LLMConfigOllamaSchema>;

// NOT WORKING YET
// const LLMConfigChromeAiSchema = z.object({
//   provider: z.literal("chrome-ai").default("chrome-ai"),
// });
// export type LLMConfigChromeAi = z.infer<typeof LLMConfigChromeAiSchema>;

export const LLMConfigSchema = z.discriminatedUnion("provider", [
  LLMConfigLmStudioSchema,
  LLMConfigOllamaSchema,
  // LLMConfigChromeAiSchema,
]);
export type LLMConfig = z.infer<typeof LLMConfigSchema>;

const modelsConfigSchema = z.object({
  llm: LLMConfigSchema,
});
export type ModelsConfig = z.infer<typeof modelsConfigSchema>;

interface ModelsConfigState {
  llm: LLMConfig;
  switchLLMProvider: (provider: LLMConfig["provider"]) => void;
  updateLLMConfig: (config: Partial<LLMConfig>) => void;
  // setLLM: (llm: LLMConfig) => void;
}

export const useModelsConfigStore = create<ModelsConfigState>()(
  devtools(
    persist(
      (set) => ({
        llm: LLMConfigSchema.options[0].parse({}),
        switchLLMProvider: (provider) =>
          set((state) => {
            const config = LLMConfigSchema.options
              .map((option) => option.parse({}))
              .find((option) => option.provider === provider);

            if (!config) return state;

            return { llm: config };
          }),

        updateLLMConfig: (config) =>
          set((state) => ({
            llm: { ...state.llm, ...config } as LLMConfig,
          })),
      }),
      {
        name: "models-config-storage",
      }
    )
  )
);
