"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

import { cn } from "@/ui/utils";

type NoiseFunction3D = (x: number, y: number, z: number) => number;

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  disabled = false,
  ...props
}: {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  disabled?: boolean;
  [key: string]: unknown;
}) => {
  const noiseRef = useRef<NoiseFunction3D>(null);
  let w: number, h: number, nt: number, i: number, x: number;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create noise with a deterministic random function

    noiseRef.current = createNoise3D() as NoiseFunction3D;
    ctxRef.current = ctx;
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;

    window.onresize = function () {
      if (!canvas || !ctx) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    render();
  };

  const defaultColors = [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ] as const;
  const waveColors = colors ?? defaultColors;

  const drawWave = (n: number) => {
    const ctx = ctxRef.current;
    const noise = noiseRef.current;
    if (!ctx || !noise) return;

    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth ?? 50;
      const color = waveColors[i % waveColors.length];
      // Ensure color is a valid CanvasStyle
      ctx.strokeStyle = color!;
      for (x = 0; x < w; x += 5) {
        const y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5); // adjust for height, currently at 50% of the container
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId: number;
  const render = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Ensure fillStyle is a valid CanvasStyle
    ctx.fillStyle = backgroundFill ?? "black";
    ctx.globalAlpha = waveOpacity ?? 0.5;
    ctx.fillRect(0, 0, w, h);
    drawWave(5);
    if (!disabled) {
      animationId = requestAnimationFrame(render);
    }
  };

  useEffect(() => {
    if (!disabled) {
      init();
    }
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [disabled]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // I'm sorry but i have got to support it on safari.
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome"),
    );
  }, []);

  return (
    <div
      className={cn(
        "flex h-screen flex-col items-center justify-center",
        containerClassName,
      )}
    >
      <canvas
        className="absolute inset-0 z-0 opacity-30"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
