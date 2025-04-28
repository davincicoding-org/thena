import { useCallback, useEffect, useState } from "react";

import type { SupportedLang } from "./speech-config";

export function useSpeechSynthesis({
  lang,
  voiceURI,
  mode = "quality",
  rate = 1,
  onStart,
  onEnd,
  onError,
}: {
  lang: SupportedLang;
  voiceURI?: string;
  rate?: number;
  mode?: "quality" | "privacy";
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const abortSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", abortSpeech);
    return () => {
      abortSpeech();
      window.removeEventListener("beforeunload", abortSpeech);
    };
  }, [abortSpeech]);

  useEffect(() => {
    const updateVoices = () => {
      const supportedVoices = window.speechSynthesis.getVoices();

      const voicesForLang = supportedVoices.filter((voice) =>
        voice.lang.startsWith(lang),
      );

      return setVoices(() => {
        switch (mode) {
          case "quality":
            // TODO: Define quality voices based on https://github.com/HadrienGardeur/web-speech-recommended-voices/tree/main
            return voicesForLang.filter(
              (voice) =>
                voice.voiceURI.startsWith("Google") ||
                voice.voiceURI.startsWith("Microsoft"),
            );
          case "privacy":
            return voicesForLang.filter((voice) => voice.localService);
        }
      });
    };

    updateVoices();

    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [lang, mode]);

  const speak = useCallback(
    (text: string) =>
      new Promise<void>((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;

        if (voiceURI) {
          const selectedVoice = voices.find(
            (voice) => voice.voiceURI === voiceURI,
          );
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }

        // Simulate output volume during speech
        // let volumeInterval: number | null = null;

        utterance.onstart = () => {
          setIsSpeaking(true);
          onStart?.();

          // Simulate volume fluctuation during speech
          // let time = 0;
          // volumeInterval = window.setInterval(() => {
          //   // Create a natural-looking volume pattern using sine wave
          //   const normalizedVolume = 0.3 + 0.7 * Math.abs(Math.sin(time));
          //   setOutputVolume(normalizedVolume);
          //   time += 0.2;
          // }, 100);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          onEnd?.();
          resolve();
          // if (volumeInterval) {
          //   clearInterval(volumeInterval);
          // }
          // setOutputVolume(0);
        };

        utterance.onerror = (error) => {
          setIsSpeaking(false);
          if (error.error === "interrupted") {
            onEnd?.();
            resolve();
          } else {
            onError?.(error);
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(error);
          }
          // if (volumeInterval) {
          //   clearInterval(volumeInterval);
          // }
          // setOutputVolume(0);
        };

        window.speechSynthesis.speak(utterance);
      }),
    [lang, rate, voiceURI, voices],
  );

  return { isSpeaking, speak, abortSpeech, voices };
}
