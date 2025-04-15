import { useEffect, useState } from "react";
import { useDisclosure, useWindowEvent } from "@mantine/hooks";

export const useKeyHold = ({
  keyCode,
  onStart,
  onRelease,
}: {
  keyCode: string | string[];
  onStart: () => void;
  onRelease: () => void;
}) => {
  const [isHeld, setIsHeld] = useState(false);
  const keyCodes = Array.isArray(keyCode) ? keyCode : [keyCode];

  useWindowEvent("keydown", (e) => {
    if (!keyCodes.includes(e.code)) return;
    e.preventDefault();
    setIsHeld(true);
  });

  useWindowEvent("keyup", (e) => {
    if (!keyCodes.includes(e.code)) return;
    e.preventDefault();
    setIsHeld(false);
  });

  useEffect(() => {
    if (!isHeld) return;
    onStart();
    return () => {
      onRelease();
    };
  }, [isHeld]);
};
