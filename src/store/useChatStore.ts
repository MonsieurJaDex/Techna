import { create } from 'zustand';

import * as chatService from '@/services/chat';
import { Message, Source } from '@/types/chat';

type State = {
  messages: Message[];
  isLoading: boolean;
};

type Actions = {
  addMessage: (message: Message) => void;
  setLoading: (value: boolean) => void;
  clearChat: () => void;
  sendMessage: (text: string) => Promise<void>;
};

function nowIso() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function errorMessage(): Message {
  return {
    id: makeId('err'),
    role: 'assistant',
    text: 'Не удалось получить ответ. Попробуйте позже.',
    timestamp: nowIso(),
  };
}

export const useChatStore = create<State & Actions>()(
  (set, get) => ({
    messages: [],
    isLoading: false,

    addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
    setLoading: (value) => set({ isLoading: value }),
    clearChat: () => set({ messages: [], isLoading: false }),

    sendMessage: async (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: Message = {
        id: makeId('u'),
        role: 'user',
        text: trimmed,
        timestamp: nowIso(),
      };
      set((s) => ({ messages: [...s.messages, userMsg], isLoading: true }));

      try {
        const res = await chatService.sendMessage(trimmed);
        const assistantMsg: Message = {
          id: makeId('a'),
          role: 'assistant',
          text: res.answer,
          sources: (res.sources || []) as Source[],
          timestamp: nowIso(),
        };
        set((s) => ({ messages: [...s.messages, assistantMsg], isLoading: false }));
      } catch {
        set((s) => ({ messages: [...s.messages, errorMessage()], isLoading: false }));
      }
    },
  })
);

