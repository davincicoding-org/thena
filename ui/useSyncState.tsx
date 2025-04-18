import { useEffect, useState } from "react";
import { useInputState } from "@mantine/hooks";

/**
 * Internal state that reacts to external state changes.
 */
export const useSyncState = <T extends unknown>(externalState: T) => {
  const [state, setState] = useState<T>(externalState);

  useEffect(() => {
    setState(externalState);
  }, [externalState]);

  return [state, setState] as const;
};

/**
 * Internal state that reacts to external state changes.
 */
export const useSyncInputState = <T extends unknown>(externalState: T) => {
  const [state, setState] = useInputState<T>(externalState);

  useEffect(() => {
    setState(externalState);
  }, [externalState]);

  return [state, setState] as const;
};
