const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const API_ENDPOINTS = {
  // Chat
  CHAT_MESSAGE: `${API_BASE_URL}/api/v1/chat/message`,
  CHAT_MESSAGE_STREAM: `${API_BASE_URL}/api/v1/chat/message/stream`,
  // MULTIQUERY_CHAT: `${API_BASE_URL}/api/v1/multiquery-chat/message`,
  // MULTIQUERY_CHAT_STREAM: `${API_BASE_URL}/api/v1/multiquery-chat/message/stream`,
  
  // Voice
  VOICE_CHAT: `${API_BASE_URL}/api/v1/voice-chat/message`,
  VOICE_TRANSCRIBE: `${API_BASE_URL}/api/v1/voice-chat/transcribe`,
  
  // TTS
  TTS_SYNTHESIZE: `${API_BASE_URL}/api/v1/tts/synthesize`,

  // Documents
  DOCUMENTS_INGEST: `${API_BASE_URL}/api/v1/documents/ingest`,
  DOCUMENTS_LIST: `${API_BASE_URL}/api/v1/documents/`,
  DOCUMENT_FILE: (id: string) =>
    `${API_BASE_URL}/api/v1/documents/${id}/file`,
  DOCUMENT_DELETE: (id: string) => `${API_BASE_URL}/api/v1/documents/${id}`,
  DOCUMENTS_DELETE_ALL: `${API_BASE_URL}/api/v1/documents/tenant/all`,
  JOB_STATUS: (id: string) => `${API_BASE_URL}/api/v1/documents/jobs/${id}`,

  // Sessions
  SESSIONS_LIST: `${API_BASE_URL}/api/v1/sessions/sessions`,
  SESSION_HISTORY: (id: string) => `${API_BASE_URL}/api/v1/sessions/sessions/${id}/history`,
  SESSION_DELETE: (id: string) => `${API_BASE_URL}/api/v1/sessions/sessions/${id}`,
  SESSIONS_HEALTH: `${API_BASE_URL}/api/v1/sessions/health`,

  // Admin
  ADMIN_RAG_CONFIG: `${API_BASE_URL}/api/v1/admin/rag-config`,

  // Health
  HEALTH: `${API_BASE_URL}/health`,
};

export const DEFAULT_TENANT_ID = 'demo-tenant';

export const getHeaders = (tenantId = DEFAULT_TENANT_ID) => ({
  'x-tenant-id': tenantId,
});

export const getJsonHeaders = (tenantId = DEFAULT_TENANT_ID) => ({
  'Content-Type': 'application/json',
  'x-tenant-id': tenantId,
});
