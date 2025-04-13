import { useState, useRef, useEffect, useCallback } from "react";

export const useVoiceAssistant = ({
  lang,
  stopListeningDelay: stopDelay = 500,
  rate = 1,
  voiceURI,
}: {
  lang: string;
  stopListeningDelay?: number;
  rate?: number;
  voiceURI?: string;
}): {
  speaking: boolean;
  listening: boolean;
  startListening: () => void;
  stopListening: () => Promise<string | null>;
  speak: (text: string) => void;
  cancelSpeaking: () => void;
  voices: SpeechSynthesisVoice[];
} => {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize voices
  useEffect(() => {
    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    // Get initial voices
    updateVoices();

    // Listen for voices changed event
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang;
    }

    // Cleanup function to stop both speech synthesis and recognition
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping recognition
        }
      }
      window.speechSynthesis.cancel();
      setListening(false);
      setSpeaking(false);
    };
  }, [lang]);

  // Add event listener for page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      // Stop any ongoing speech synthesis
      window.speechSynthesis.cancel();
      setSpeaking(false);

      recognitionRef.current.start();
      setListening(true);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setListening(false);
    }
  }, []);

  const cancelSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return Promise.resolve(null);
    setListening(false); // Update state immediately

    return new Promise<string | null>((resolve) => {
      const recognition = recognitionRef.current;
      if (!recognition) {
        resolve(null);
        return;
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results = event.results;
        if (results?.[0]?.[0]?.transcript) {
          resolve(results[0][0].transcript);
        } else {
          resolve(null);
        }
      };

      recognition.onend = () => {
        resolve(null);
      };

      // Use the configurable stopDelay
      setTimeout(() => {
        recognition.stop();
      }, stopDelay);
    });
  }, [stopDelay]);

  const speak = useCallback(
    (text: string) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;

      // Find and use the voice matching the provided URI
      if (voiceURI) {
        const selectedVoice = voices.find((v) => v.voiceURI === voiceURI);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [lang, rate, voiceURI, voices]
  );

  return {
    speaking,
    listening,
    startListening,
    stopListening,
    speak,
    cancelSpeaking,
    voices,
  };
};
