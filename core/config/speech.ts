import { z } from "zod";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// import type {} from '@redux-devtools/extension' // required for devtools typing

export const supportedLangSchema = z.enum([
  "en",
  "de",
  "fr",
  "es",
  "it",
  "ja",
  "zh",
]);
export type SupportedLang = z.infer<typeof supportedLangSchema>;

const speechSynthesisConfigBrowserSchema = z.object({
  provider: z.literal("browser").default("browser"),
  rate: z.number().min(0.5).max(2).default(1),
  voice: z.string().default("Google UK English Male"),
});

type SpeechSynthesisConfig = z.infer<typeof speechSynthesisConfigBrowserSchema>;

const speechSynthesisConfigSchema = z.discriminatedUnion("provider", [
  speechSynthesisConfigBrowserSchema,
]);

const speechRecognitionConfigBrowserSchema = z.object({
  provider: z.literal("browser").default("browser"),
});

type SpeechRecognitionConfig = z.infer<
  typeof speechRecognitionConfigBrowserSchema
>;

const speechRecognitionConfigSchema = z.discriminatedUnion("provider", [
  speechRecognitionConfigBrowserSchema,
]);

const speechConfigSchema = z.object({
  lang: supportedLangSchema.default("en"),
  synthesis: speechSynthesisConfigSchema.default(
    speechSynthesisConfigBrowserSchema.parse({})
  ),
  recognition: speechRecognitionConfigSchema.default(
    speechRecognitionConfigBrowserSchema.parse({})
  ),
});
export type SpeechConfig = z.infer<typeof speechConfigSchema>;

interface SpeechConfigState {
  speech: SpeechConfig;
  updateSpeechConfig: (config: Partial<SpeechConfig>) => void;
  switchSynthesisProvider: (
    provider: SpeechConfig["synthesis"]["provider"]
  ) => void;
  updateSynthesisConfig: (config: Partial<SpeechConfig["synthesis"]>) => void;
  updateRecognitionConfig: (
    config: Partial<SpeechConfig["recognition"]>
  ) => void;
  switchRecognitionProvider: (
    provider: SpeechConfig["recognition"]["provider"]
  ) => void;
}

export const useSpeechConfigStore = create<SpeechConfigState>()(
  devtools(
    persist(
      (set) => ({
        speech: speechConfigSchema.parse({}),
        updateSpeechConfig: (config) =>
          set((state) => ({ speech: { ...state.speech, ...config } })),

        switchSynthesisProvider: (provider) =>
          set((state) => {
            const config = speechSynthesisConfigSchema.options
              .map((option) => option.parse({}))
              .find((option) => option.provider === provider);

            if (!config) return state;

            return { speech: { ...state.speech, synthesis: config } };
          }),

        updateSynthesisConfig: (config) =>
          set((state) => ({
            speech: {
              ...state.speech,
              synthesis: { ...state.speech.synthesis, ...config },
            },
          })),

        switchRecognitionProvider: (provider) =>
          set((state) => {
            const config = speechRecognitionConfigSchema.options
              .map((option) => option.parse({}))
              .find((option) => option.provider === provider);

            if (!config) return state;

            return { speech: { ...state.speech, recognition: config } };
          }),

        updateRecognitionConfig: (config) =>
          set((state) => ({
            speech: {
              ...state.speech,
              recognition: {
                ...state.speech.recognition,
                ...config,
              },
            },
          })),
      }),
      {
        name: "speech-config-storage",
      }
    )
  )
);
