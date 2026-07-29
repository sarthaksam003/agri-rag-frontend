import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  // State
  messages: [],
  sessionId: null,
  isLoading: false,
  error: null,
  ragMode: 'simple',
  tenantId: 'demo-tenant',
  maxQueries: 6,
  sourceLanguage: 'or',    // ← top-level state

  // Sidebar
  sidebarOpen: true,
  activeTab: 'chat',

  // Sessions
  sessions: [],
  sessionsLoading: false,

  // Documents
  documents: [],
  documentsLoading: false,

  // Audio
  isRecording: false,
  isPlayingAudio: false,
  currentAudioId: null,

  // Actions
  setRagMode: (mode) => set({ ragMode: mode }),
  setTenantId: (id) => set({ tenantId: id }),
  setMaxQueries: (n) => set({ maxQueries: n }),
  setSourceLanguage: (lang) => set({ sourceLanguage: lang }),  // ← top-level action
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsRecording: (recording) => set({ isRecording: recording }),
  setIsPlayingAudio: (playing, id = null) =>
    set({ isPlayingAudio: playing, currentAudioId: id }),
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
      retrievalStrategy: data.retrieval_strategy || 'simple',
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
  loadSession: (sessionId, messages) =>
    set({ sessionId, messages, error: null }),
  setSessions: (sessions) => set({ sessions }),
  setSessionsLoading: (loading) => set({ sessionsLoading: loading }),
  setDocuments: (documents) => set({ documents }),
  setDocumentsLoading: (loading) => set({ documentsLoading: loading }),
}));

export default useChatStore;
