import { ConversationStatus } from '@/features/conversation/types/conversation-status';
import { ChatMessage } from '@/features/conversation/types/message';
import { create } from 'zustand';

interface ConversationStore {
  messages: ChatMessage[];
  sessionId: string | null;
  status: ConversationStatus;
  error: unknown;

  ragMode: "Simple" | "Multi-query";
  sourceLanguage: string;

  setSessionId: (id: string | null) => void;

  setRagMode: (mode: "Simple" | "Multi-query") => void;
  setSourceLanguage: (lang: string) => void;

  setError: (error: unknown) => void;
  clearError: () => void;

  addMessage: (message: ChatMessage) => void;


  clear: () => void;


  setStatus: (status: ConversationStatus) => void
  setMessages: (messages: ChatMessage[]) => void,
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  // State
  messages: [],
  sessionId: null,
  error: null,
  ragMode: 'Simple',
  sourceLanguage: 'or',    // ← top-level state
  status: "idle",
  // Actions
  setRagMode: (mode: "Simple" | "Multi-query") => set({ ragMode: mode }),
  setSourceLanguage: (lang) => set({ sourceLanguage: lang }),  // ← top-level action
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  clear: () =>
    set({
      messages: [],
      sessionId: null,
      error: null,
      status: "idle",
    }),
  addMessage: (message) =>
    set((state) => ({

      messages: [

        ...state.messages,

        message,

      ],

    })),



  setSessionId: (id) => set({ sessionId: id }),
  setMessages: (messages) => set({ messages }),
  setStatus: (status: ConversationStatus) =>
    set({
      status,
    }),
}));
