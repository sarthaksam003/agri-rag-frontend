import { ConversationStatus } from '@/features/conversation/types/conversation-status';
import { ChatMessage } from '@/features/conversation/types/message';
import { create } from 'zustand';

interface ConversationStore {
  messages: ChatMessage[];
  sessionId: string | null;
  conversationTitle: string | null;

  status: ConversationStatus;
  error: unknown;
  activeRequestSessionId: string | null;

  setSessionId: (id: string | null) => void;
  setConversationTitle: (title: string | null) => void;


  setError: (error: unknown) => void;
  clearError: () => void;

  addMessage: (message: ChatMessage) => void;
  removeMessage: (messageId: string) => void;
  updateMessage: (
    messageId: string,
    updates: Partial<ChatMessage>
  ) => void;

  clear: () => void;


  setStatus: (status: ConversationStatus) => void
  setMessages: (messages: ChatMessage[]) => void,
  setActiveRequestSessionId: (id: string | null) => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
  // State
  messages: [],
  sessionId: null,
  conversationTitle: null,
  error: null,
  status: "idle",
  activeRequestSessionId: null,

  // Actions
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  clear: () =>
    set({
      messages: [],
      sessionId: null,
      conversationTitle: null,
      error: null,
    }),
  addMessage: (message) =>
    set((state) => ({

      messages: [

        ...state.messages,

        message,

      ],

    })),
  removeMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter(
        (message) => message.id !== messageId
      ),
    })),
  updateMessage: (messageId, updates) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId
          ? { ...message, ...updates }
          : message
      ),
    })),

  setSessionId: (id) => set({ sessionId: id }),
  setConversationTitle: (title) =>
    set({ conversationTitle: title }),
  setActiveRequestSessionId: (id) =>
    set({ activeRequestSessionId: id }),

  setMessages: (messages) => set({ messages }),
  setStatus: (status: ConversationStatus) =>
    set({
      status,
    }),
}));
