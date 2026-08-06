import { create } from "zustand";

import type { ChatMessage } from "@/features/conversation/types/message";

interface ConversationStore {

    messages: ChatMessage[];

    sessionId: string | null;

    isLoading: boolean;

    error: unknown;

    ragMode: "Simple" | "Multi-query";

    sourceLanguage: string;

    setLoading(loading: boolean): void;

    setSessionId(id: string | null): void;

    setError(error: unknown): void;

    clearError(): void;

    setRagMode(mode: "Simple" | "Multi-query"): void;

    setSourceLanguage(language: string): void;

    addMessage(message: ChatMessage): void;

    updateMessage(
        id: string,
        partial: Partial<ChatMessage>,
    ): void;

    setMessages(messages: ChatMessage[]): void;

    clear(): void;

}

export const useConversationStore = create<ConversationStore>((set) => ({

    messages: [],

    sessionId: null,

    isLoading: false,

    error: null,

    ragMode: "Simple",

    sourceLanguage: "en",

    setLoading: (loading) =>
        set({
            isLoading: loading,
        }),

    setSessionId: (id) =>
        set({
            sessionId: id,
        }),

    setError: (error) =>
        set({
            error,
        }),

    clearError: () =>
        set({
            error: null,
        }),

    setRagMode: (mode) =>
        set({
            ragMode: mode,
        }),

    setSourceLanguage: (language) =>
        set({
            sourceLanguage: language,
        }),

    addMessage: (message) =>
        set((state) => ({
            messages: [
                ...state.messages,
                message,
            ],
        })),

    updateMessage: (id, partial) =>
        set((state) => ({
            messages: state.messages.map((message) =>
                message.id === id
                    ? {
                        ...message,
                        ...partial,
                    }
                    : message
            ),
        })),

    setMessages: (messages) =>
        set({
            messages,
        }),

    clear: () =>
        set({
            messages: [],
            sessionId: null,
            error: null,
        }),

}));