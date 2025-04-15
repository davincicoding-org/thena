import { useEffect, useState } from "react";

interface Stage<T extends string> {
  name: T;
  init?: () => void;
  cleanup?: () => void;
}

export const useStages = <T extends string>(
  stages: [Stage<T>, ...Stage<T>[]],
  options: {
    initialStage?: T;
    onComplete?: () => void;
  } = {},
): {
  currentStage: T;
  completeStage: (stage: T) => void;
  isInStage: (stages: T[]) => boolean;
} => {
  const [currentStage, setCurrentStage] = useState<T>(
    options.initialStage ?? stages[0].name,
  );

  useEffect(() => {
    const currentStageConfig = stages.find(
      (stage) => stage.name === currentStage,
    );
    currentStageConfig?.init?.();
  }, [currentStage]);

  const completeStage = (stage: T) => {
    if (currentStage !== stage) return;
    const currentIndex = stages.findIndex((s) => s.name === currentStage);
    const currentStageConfig = stages.find(
      (stage) => stage.name === currentStage,
    );
    currentStageConfig?.cleanup?.();
    const nextStage = stages[currentIndex + 1];
    if (!nextStage) {
      options.onComplete?.();
      return;
    }
    setCurrentStage(nextStage.name);
  };

  return {
    currentStage,
    completeStage,
    isInStage: (stages: T[]) => stages.includes(currentStage),
  };
};
