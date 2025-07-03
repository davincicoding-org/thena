import { useEffect, useState } from "react";
import { useWindowEvent } from "@mantine/hooks";

export const useKeyHold = ({
  trigger,
  onStart,
  onRelease,
  disabled = false,
}: {
  trigger: (e: KeyboardEvent) => boolean;
  onStart: () => void;
  onRelease: () => void | Promise<void>;
  disabled?: boolean;
}) => {
  const [isHeld, setIsHeld] = useState(false);

  useWindowEvent("keydown", (e) => {
    if (disabled) return;
    if (!trigger(e)) return;
    e.preventDefault();
    setIsHeld(true);
  });

  useWindowEvent("keyup", (e) => {
    if (disabled) return;
    if (!trigger(e)) return;
    e.preventDefault();
    setIsHeld(false);
  });

  useEffect(() => {
    if (!isHeld) return;
    onStart();
    return () => {
      void onRelease();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHeld]);
};
