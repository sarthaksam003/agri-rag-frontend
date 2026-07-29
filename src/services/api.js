import axios from 'axios';
import { API_ENDPOINTS, getHeaders, getJsonHeaders } from '../config/api';

const apiClient = axios.create({
  timeout: 120000,
});

// ─── Chat ──────────────────────────────────────────────
export const sendChatMessage = async (message, sessionId = null, tenantId) => {
  const payload = { message };
  if (sessionId) payload.session_id = sessionId;

  const response = await apiClient.post(API_ENDPOINTS.CHAT_MESSAGE, payload, {
    headers: getJsonHeaders(tenantId),
  });
  return response.data;
};

export const sendMultiqueryChatMessage = async (
  message,
  sessionId = null,
  tenantId,
  useMultiquery = true,
  maxQueries = 6
) => {
  const payload = {
    message,
    use_multiquery: useMultiquery,
    max_queries: maxQueries,
  };
  if (sessionId) payload.session_id = sessionId;

  const response = await apiClient.post(API_ENDPOINTS.MULTIQUERY_CHAT, payload, {
    headers: getJsonHeaders(tenantId),
  });
  return response.data;
};

// ─── Voice ─────────────────────────────────────────────
export const sendVoiceChatMessage = async (
  audioBlob,
  sourceLanguage = 'or',
  sessionId = null,
  ragMode = 'simple',
  tenantId
) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');
  formData.append('source_language', sourceLanguage);
  formData.append('rag_mode', ragMode);
  if (sessionId) formData.append('session_id', sessionId);

  const response = await apiClient.post(API_ENDPOINTS.VOICE_CHAT, formData, {
    headers: {
      ...getHeaders(tenantId),
    },
  });
  return response.data;
};

// ─── TTS ───────────────────────────────────────────────
export const synthesizeSpeech = async (text, language = 'or', gender = 'female', tenantId) => {
  const response = await apiClient.post(
    API_ENDPOINTS.TTS_SYNTHESIZE,
    { text, language, gender },
    {
      headers: getJsonHeaders(tenantId),
      responseType: 'blob',
    }
  );
  return response.data;
};

// ─── Documents ─────────────────────────────────────────
export const ingestDocuments = async (files, tenantId) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await apiClient.post(API_ENDPOINTS.DOCUMENTS_INGEST, formData, {
    headers: {
      ...getHeaders(tenantId),
    },
  });
  return response.data;
};

export const listDocuments = async (tenantId) => {
  const response = await apiClient.get(API_ENDPOINTS.DOCUMENTS_LIST, {
    headers: getHeaders(tenantId),
  });
  return response.data;
};

export const deleteDocument = async (documentId, tenantId) => {
  const response = await apiClient.delete(API_ENDPOINTS.DOCUMENT_DELETE(documentId), {
    headers: getHeaders(tenantId),
  });
  return response.data;
};

export const deleteAllDocuments = async (tenantId) => {
  const response = await apiClient.delete(API_ENDPOINTS.DOCUMENTS_DELETE_ALL, {
    headers: getHeaders(tenantId),
  });
  return response.data;
};

export const getJobStatus = async (jobId) => {
  const response = await apiClient.get(API_ENDPOINTS.JOB_STATUS(jobId));
  return response.data;
};

// ─── Sessions ──────────────────────────────────────────
export const listSessions = async (tenantId, limit = 20, offset = 0) => {
  const response = await apiClient.get(API_ENDPOINTS.SESSIONS_LIST, {
    headers: getHeaders(tenantId),
    params: { limit, offset },
  });
  return response.data;
};

export const getSessionHistory = async (sessionId, tenantId) => {
  const response = await apiClient.get(API_ENDPOINTS.SESSION_HISTORY(sessionId), {
    headers: getHeaders(tenantId),
  });
  return response.data;
};

export const deleteSession = async (sessionId, tenantId) => {
  const response = await apiClient.delete(API_ENDPOINTS.SESSION_DELETE(sessionId), {
    headers: getHeaders(tenantId),
  });
  return response.data;
};

// ─── Health ────────────────────────────────────────────
export const healthCheck = async () => {
  const response = await apiClient.get(API_ENDPOINTS.HEALTH);
  return response.data;
};
