import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const FLAGS = {
  "sprint-planner--time-travel": false,
} as const satisfies Record<string, boolean>;

export type FlagKey = keyof typeof FLAGS;

interface FlagsStoreState {
  flags: Record<FlagKey, boolean>;
  toggleFlag: (flag: FlagKey) => void;
}

export const useFlagsStore = create<FlagsStoreState>()(
  devtools(
    persist(
      (set) => ({
        flags: FLAGS,
        toggleFlag: (flag) =>
          set((state) => ({
            flags: {
              ...state.flags,
              [flag]: !state.flags[flag],
            },
          })),
      }),
      {
        name: "flags",
      },
    ),
  ),
);
