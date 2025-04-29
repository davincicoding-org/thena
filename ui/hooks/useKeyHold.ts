import { useEffect, useState } from "react";
import { useWindowEvent } from "@mantine/hooks";

export const useKeyHold = ({
  keyCode,
  onStart,
  onRelease,
  disabled = false,
}: {
  keyCode: string | string[];
  onStart: () => void;
  onRelease: () => void | Promise<void>;
  disabled?: boolean;
}) => {
  const [isHeld, setIsHeld] = useState(false);
  const keyCodes = Array.isArray(keyCode) ? keyCode : [keyCode];

  useWindowEvent("keydown", (e) => {
    if (disabled) return;
    if (!keyCodes.includes(e.code)) return;
    e.preventDefault();
    setIsHeld(true);
  });

  useWindowEvent("keyup", (e) => {
    if (disabled) return;
    if (!keyCodes.includes(e.code)) return;
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
