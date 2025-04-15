import { useState, useRef, useEffect, useCallback } from "react";
import { notifications } from "@mantine/notifications";

/**
 * @deprecated Use useSpeechRecognition and useSpeechSynthesis instead
 */
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
  debug?: boolean;
}): {
  speaking: boolean;
  listening: boolean;
  startListening: () => void;
  stopListening: () => Promise<string | null>;
  speak: (text: string) => void;
  cancelSpeaking: () => void;
  voices: SpeechSynthesisVoice[];
  inputVolume: number;
  outputVolume: number;
} => {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [inputVolume, setInputVolume] = useState(0);
  const [outputVolume, setOutputVolume] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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

  // Setup audio context for volume monitoring
  useEffect(() => {
    // Create audio context
    const AudioContextClass = window.AudioContext;
    audioContextRef.current = new AudioContextClass();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;

    return () => {
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Function to start monitoring microphone volume
  const startVolumeMonitoring = useCallback(async () => {
    if (!audioContextRef.current || !analyserRef.current) return;

    try {
      // Get microphone access
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Connect the microphone to the analyzer
      const audioContext = audioContextRef.current;
      if (!audioContext) return;

      const mediaStream = mediaStreamRef.current;
      if (!mediaStream) return;

      const source = audioContext.createMediaStreamSource(mediaStream);
      const analyser = analyserRef.current;
      if (!analyser) return;

      source.connect(analyser);

      // Create data array for volume analysis
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      // Function to continuously update volume
      const updateVolume = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        // Calculate volume (average of frequency data)
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i]!;
        }
        const average = sum / dataArray.length;
        // Normalize to 0-1 range
        setInputVolume(average / 255);

        // Continue monitoring if still listening
        if (listening) {
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
      };

      // Start monitoring
      updateVolume();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }, [listening]);

  // Stop volume monitoring
  const stopVolumeMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setInputVolume(0);
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
      stopVolumeMonitoring();
      setListening(false);
      setSpeaking(false);
    };
  }, [lang, stopVolumeMonitoring]);

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

  // Start/stop volume monitoring when listening state changes
  useEffect(() => {
    if (listening) {
      startVolumeMonitoring();
    } else {
      stopVolumeMonitoring();
    }
  }, [listening, startVolumeMonitoring, stopVolumeMonitoring]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      notifications.show({
        id: "listening",
        title: "Listening",
        loading: true,
        message: "...",
        color: "blue",
      });
      // Stop any ongoing speech synthesis
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setOutputVolume(0);

      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      } finally {
        setListening(true);
      }
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setListening(false);
    }
  }, []);

  const cancelSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setOutputVolume(0);
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

      // Simulate output volume during speech
      let volumeInterval: number | null = null;

      utterance.onstart = () => {
        setSpeaking(true);
        // Simulate volume fluctuation during speech
        let time = 0;
        volumeInterval = window.setInterval(() => {
          // Create a natural-looking volume pattern using sine wave
          const normalizedVolume = 0.3 + 0.7 * Math.abs(Math.sin(time));
          setOutputVolume(normalizedVolume);
          time += 0.2;
        }, 100);
      };

      utterance.onend = () => {
        setSpeaking(false);
        if (volumeInterval) {
          clearInterval(volumeInterval);
        }
        setOutputVolume(0);
      };

      utterance.onerror = () => {
        setSpeaking(false);
        if (volumeInterval) {
          clearInterval(volumeInterval);
        }
        setOutputVolume(0);
      };

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
    inputVolume,
    outputVolume,
  };
};
