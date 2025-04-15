"use client";

import React, { useEffect, useState } from "react";
import { Box, BoxProps } from "@mantine/core";
import { motion } from "framer-motion";

import { cn } from "../utils";

export interface AssistantIndicatorProps extends BoxProps {
  status?: "idle" | "listening" | "thinking" | "speaking";
  // volume: number;
}

// TODO: implment volume reactivity
export function AssistantIndicator({
  className,
  status = "idle",
  ...boxProps
}: AssistantIndicatorProps) {
  const [bars, setBars] = useState(Array(50).fill(0));

  const volume = 0;
  useEffect(() => {
    if (volume) {
      updateBars(volume, status === "speaking" ? Math.random() : 1);
    } else {
      resetBars();
    }
  }, [volume]);

  const updateBars = (volume: number, multiplier: number) => {
    setBars(bars.map(() => volume * multiplier * 50));
  };

  const resetBars = () => {
    setBars(Array(50).fill(0));
  };

  return (
    <Box
      component="svg"
      viewBox="0 0 300 300"
      className={cn("transition-all", className, {
        "animate-speaking stroke-purple-700": status === "speaking",
        "animate-listening stroke-white": status === "listening",
        "stroke-white": status === "idle",
        "animate-processing stroke-purple-300": status === "thinking",
      })}
      {...boxProps}
    >
      {bars.map((height, index) => {
        const angle = (index / bars.length) * 360;
        const radians = (angle * Math.PI) / 180;
        const x1 = 150 + Math.cos(radians) * Math.max(0, 20 - height * 0.25);
        const y1 = 150 + Math.sin(radians) * Math.max(0, 20 - height * 0.25);
        const x2 = 150 + Math.cos(radians) * (50 + height * 0.75);
        const y2 = 150 + Math.sin(radians) * (50 + height * 0.75);

        return (
          <motion.line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={cn("opacity-70")}
            strokeWidth="2"
            initial={{ x2: x1, y2: y1 }}
            animate={{ x2, y2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        );
      })}
    </Box>
  );
}
