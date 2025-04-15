import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// import type {} from '@redux-devtools/extension' // required for devtools typing

export type InstructionKey = "agent";

interface InstructionsConfigState {
  instructions: Record<InstructionKey, string>;
  updateInstruction: (key: InstructionKey, instruction: string) => void;
}

export const useInstructionsConfigStore = create<InstructionsConfigState>()(
  devtools(
    persist(
      (set) => ({
        instructions: {
          agent:
            "You are a helpful assistant that helps a user to plan some tasks.",
        },
        updateInstruction: (key, instruction) =>
          set((state) => ({
            instructions: { ...state.instructions, [key]: instruction },
          })),
      }),
      {
        name: "instructions-config-storage",
      },
    ),
  ),
);
