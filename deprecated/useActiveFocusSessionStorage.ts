import { useLocalStorage } from "@mantine/hooks";

import type { ActiveFocusSession } from "@/core/deep-work";

export const useActiveFocusSessionStorage = () => {
  const [storedSession, setStoredSession, clearStoredSession] =
    useLocalStorage<ActiveFocusSession | null>({
      key: "active-focus-session",
      defaultValue: null,
    });

  return {
    session: storedSession,
    setSession: setStoredSession,
    clearSession: clearStoredSession,
  };
};
