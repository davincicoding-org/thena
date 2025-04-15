import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// import type {} from '@redux-devtools/extension' // required for devtools typing

export type MessageKey = "intro";

interface MessagesConfigState {
  messages: Record<MessageKey, string>;
  updateMessage: (key: MessageKey, message: string) => void;
}

export const useMessagesConfigStore = create<MessagesConfigState>()(
  devtools(
    persist(
      (set) => ({
        messages: {
          intro:
            "Hello and welcome to concentrate! I will help you to plan your tasks. What do you want to achieve today?",
        },
        updateMessage: (key, message) =>
          set((state) => ({
            messages: { ...state.messages, [key]: message },
          })),
      }),
      {
        name: "messages-config-storage",
      },
    ),
  ),
);
