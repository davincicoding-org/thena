import { SupportedLang } from "@/core/config/speech";
import { useRef, useState, useEffect } from "react";

export function useSpeechRecognition({
  lang,
  onStart,
  onResult,
  onEnd,
  onError,
}: {
  lang: SupportedLang;
  onStart?: () => void;
  onResult?: (params: {
    results: SpeechRecognitionResult[];
    resultIndex: number;
    result: SpeechRecognitionResult;
  }) => void;
  onEnd?: () => void;
  onError?: (error: SpeechRecognitionErrorEvent) => void;
}) {
  const [isListening, setIsListening] = useState(false);
  const hasSpoken = useRef(false);
  const recognition = useRef<SpeechRecognition>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, []);

  const abortListening = () => {
    if (recognition.current) recognition.current.abort();
  };

  // TODO: Add volume monitoring
  const startListening = async () =>
    new Promise<void>((resolve, reject) => {
      abortListening();

      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognitionAPI();
      recognition.current.lang = lang;
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      hasSpoken.current = false;

      // Store handlers as refs so we can remove them
      const errorHandler = (event: SpeechRecognitionErrorEvent) => {
        onError?.(event);
        reject(event);
      };

      const resultHandler = (event: SpeechRecognitionEvent) => {
        const results = Array.from(event.results);
        const result = results[event.resultIndex]!;
        onResult?.({ results, resultIndex: event.resultIndex, result });
      };

      recognition.current.start();
      recognition.current.onstart = () => {
        setIsListening(true);
        resolve();
        onStart?.();
        // startVolumeMonitoring();
      };

      recognition.current.onend = () => {
        setIsListening(false);
        onEnd?.();
        // stopVolumeMonitoring();

        // Clean up listeners when speech recognition ends
        if (recognition.current) {
          recognition.current.removeEventListener("error", errorHandler);
          recognition.current.removeEventListener("result", resultHandler);
        }
      };

      recognition.current.onspeechstart = () => {
        hasSpoken.current = true;
      };

      recognition.current.addEventListener("error", errorHandler);
      recognition.current.addEventListener("result", resultHandler);
    });

  const stopListening = () =>
    new Promise<string | null>((resolve, reject) => {
      if (!recognition.current) return null;

      console.log("stopListening");

      // Store handlers as refs so we can remove them
      const resultHandler = (event: SpeechRecognitionEvent) => {
        const results = Array.from(event.results);
        console.log(results);
        if (results.some((result) => !result.isFinal)) return;

        const transcription = Array.from(results)
          .map((result) => result.item(0).transcript.trim())
          .join(" ");

        // Remove listeners after getting the result
        if (recognition.current) {
          recognition.current.removeEventListener("result", resultHandler);
          recognition.current.removeEventListener("error", errorHandler);
        }

        resolve(transcription);
      };

      const errorHandler = (event: SpeechRecognitionErrorEvent) => {
        // Remove listeners on error
        if (recognition.current) {
          recognition.current.removeEventListener("result", resultHandler);
          recognition.current.removeEventListener("error", errorHandler);
        }

        onError?.(event);
        reject(event);
      };

      recognition.current.addEventListener("result", resultHandler);
      recognition.current.addEventListener("error", errorHandler);

      recognition.current.stop();
      if (!hasSpoken.current) {
        // Remove listeners if nothing was spoken
        if (recognition.current) {
          recognition.current.removeEventListener("result", resultHandler);
          recognition.current.removeEventListener("error", errorHandler);
        }
        resolve(null);
      }
    });

  return { startListening, stopListening, isListening, abortListening };
}
