import { useEffect, useState } from "react";
import { useDisclosure, useWindowEvent } from "@mantine/hooks";

export const useKeyHold = ({
  keyCode,
  onStart,
  onRelease,
}: {
  keyCode: string;
  onStart: () => void;
  onRelease: () => void;
}) => {
  const [isHeld, { open: setIsHeld, close: setIsReleased }] =
    useDisclosure(false);

  useWindowEvent("keydown", (e) => {
    if (e.code !== keyCode) return;
    e.preventDefault();
    setIsHeld();
  });

  useWindowEvent("keyup", (e) => {
    if (e.code !== keyCode) return;
    e.preventDefault();
    setIsReleased();
  });

  useEffect(() => {
    if (isHeld) {
      onStart();
    } else {
      onRelease();
    }
  }, [isHeld]);
};
