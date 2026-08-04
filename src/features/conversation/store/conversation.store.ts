import { create } from 'zustand';

interface ConversationStore {
  messages: any[];
  sessionId: string | null;

  isLoading: boolean;
  error: unknown;

  ragMode: "Simple" | "Multi-query";
  sourceLanguage: string;

  setLoading: (loading: boolean) => void;
  setSessionId: (id: string | null) => void;

  setRagMode: (mode: "Simple" | "Multi-query") => void;
  setSourceLanguage: (lang: string) => void;

  setError: (error: unknown) => void;
  clearError: () => void;

  addUserMessage: (text: string) => any;
  addBotMessage: (data: any) => any;
  addVoiceUserMessage: (data: any) => any;

  clearChat: () => void;
  loadSession: (sessionId: string, messages: any[]) => void;
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
  // State
  messages: [],
  sessionId: null,
  isLoading: false,
  error: null,
  ragMode: 'Simple',
  sourceLanguage: 'or',    // ← top-level state

  // Actions
  setRagMode: (mode: "Simple" | "Multi-query") => set({ ragMode: mode }),
  setSourceLanguage: (lang) => set({ sourceLanguage: lang }),  // ← top-level action
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  addUserMessage: (text) => {
    const msg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, msg] }));
    return msg;
  },

  addBotMessage: (data) => {
    const msg = {
      id: data.id,
      role: 'assistant',
      content: data.response,
      timestamp: data.timestamp,
      chunks: data.chunks || [],
      hallucinationSpans: data.hallucination_spans || null,
      retrievedCount: data.retrieved_documents_count || 0,
      generatedQueries: data.generated_queries || [],
      retrievalStrategy: data.retrieval_strategy || 'Simple',
      retrievalAnalysis: data.retrieval_analysis || {},
      chunkRetrievalInfo: data.chunk_retrieval_info || [],
      originalMessage: data.original_message || null,
      translatedMessage: data.translated_message || null,
      translatedResponse: data.translated_response || null,
      sourceLanguage: data.source_language || get().sourceLanguage,  // ← read from data, fallback to store
    };
    set((state) => ({
      messages: [...state.messages, msg],
      sessionId: data.session_id || state.sessionId,
    }));
    return msg;
  },

  addVoiceUserMessage: (data) => {
    const msg = {
      id: `voice-user-${Date.now()}`,
      role: 'user',
      content: data.original_message || data.translated_message || '🎤 Voice message',
      originalMessage: data.original_message,
      translatedMessage: data.translated_message,
      sourceLanguage: data.source_language,
      isVoice: true,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, msg] }));
    return msg;
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setSessionId: (id) => set({ sessionId: id }),
  clearChat: () => set({ messages: [], sessionId: null, error: null }),
  loadSession: (sessionId, messages) => { set({ sessionId, messages, error: null }) },

}));
