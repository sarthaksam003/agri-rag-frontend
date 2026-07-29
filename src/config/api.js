const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const API_ENDPOINTS = {
  // Chat
  CHAT_MESSAGE: `${API_BASE_URL}/api/v1/chat/message`,
  MULTIQUERY_CHAT: `${API_BASE_URL}/api/v1/multiquery-chat/message`,

  // Voice
  VOICE_CHAT: `${API_BASE_URL}/api/v1/voice-chat/message`,

  // TTS
  TTS_SYNTHESIZE: `${API_BASE_URL}/api/v1/tts/synthesize`,

  // Documents
  DOCUMENTS_INGEST: `${API_BASE_URL}/api/v1/documents/ingest`,
  DOCUMENTS_LIST: `${API_BASE_URL}/api/v1/documents/`,
  DOCUMENT_DELETE: (id) => `${API_BASE_URL}/api/v1/documents/${id}`,
  DOCUMENTS_DELETE_ALL: `${API_BASE_URL}/api/v1/documents/tenant/all`,
  JOB_STATUS: (id) => `${API_BASE_URL}/api/v1/documents/jobs/${id}`,

  // Sessions
  SESSIONS_LIST: `${API_BASE_URL}/api/v1/sessions/sessions`,
  SESSION_HISTORY: (id) => `${API_BASE_URL}/api/v1/sessions/sessions/${id}/history`,
  SESSION_DELETE: (id) => `${API_BASE_URL}/api/v1/sessions/sessions/${id}`,
  SESSIONS_HEALTH: `${API_BASE_URL}/api/v1/sessions/health`,

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
