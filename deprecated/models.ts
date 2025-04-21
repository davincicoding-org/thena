import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { chromeai } from "chrome-ai";
import { createOllama } from "ollama-ai-provider";

import { LLMConfig } from "@/core/config/models";

export const createModel = (config: LLMConfig) => {
  switch (config.provider) {
    case "lmstudio":
      return createOpenAICompatible({
        name: "lmstudio",
        baseURL: config.baseURL,
      })(config.model);
    case "ollama":
      return createOllama({
        baseURL: config.baseURL,
      })(config.model);
    case "chrome-ai":
      return chromeai();
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
};
