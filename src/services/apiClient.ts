import axios, { type AxiosProgressEvent } from 'axios';
import { API_ENDPOINTS, getHeaders, getJsonHeaders } from '../config/apiConfig';

const apiClient = axios.create({
  timeout: 120000,
  withCredentials: true,
});

// ─── Chat ──────────────────────────────────────────────
export interface ChatSourceResponse {
  source: string;
  chunk_id: string;
  chunk_index: number;
  content: string;
  relevance_score: number;
  document_id?: string | null;
  page_number?: number | null;
}

export interface ChatMessageResponse {
  id: string;
  session_id: string;
  session_title?: string | null;
  message: string;
  response: string;
  timestamp: string;
  chunks: string[];
  hallucination_spans: Record<string, unknown> | null;
  retrieved_documents_count: number;
  sources?: ChatSourceResponse[];
}

export const sendChatMessage = async (
  message: string,
  sessionId: string | null = null,
  tenantId: string,
  sourceLanguage: string = "en",

) => {
  const payload: {
    message: string;
    session_id?: string;
    source_language: string;
  } = {
    message,
    source_language: sourceLanguage,
  };

  if (sessionId) {
    payload.session_id = sessionId;
  }

  const response = await apiClient.post<ChatMessageResponse>(
    API_ENDPOINTS.CHAT_MESSAGE,
    payload,
    {
      headers: getJsonHeaders(tenantId),
    },
  );

  return response.data;
};
export const getChatHistory = async (
  sessionId: string,
  tenantId: string,
) => {
  const response = await apiClient.get(
    API_ENDPOINTS.SESSION_HISTORY(sessionId),
    {
      headers: getJsonHeaders(tenantId),
    },
  );

  return response.data;
};
// export const sendMultiqueryChatMessage = async (
//   message: string,
//   sessionId: string | null = null,
//   tenantId: string,
//   useMultiquery: boolean = true,
//   maxQueries: number = 6,
// ) => {
//   const payload: {
//     message: string;
//     session_id?: string;
//     use_multiquery: boolean;
//     max_queries: number;
//   } = {
//     message,
//     use_multiquery: useMultiquery,
//     max_queries: maxQueries,
//   };

//   if (sessionId) {
//     payload.session_id = sessionId;
//   }

//   const response = await apiClient.post(
//     API_ENDPOINTS.MULTIQUERY_CHAT,
//     payload,
//     {
//       headers: getJsonHeaders(tenantId),
//     },
//   );

//   return response.data;
// };
// ─── Voice ─────────────────────────────────────────────


export const sendVoiceChatMessage = async (
  audioBlob: Blob,
  sourceLanguage: string = "en",
  sessionId: string | null = null,
  tenantId: string,
) => {
  const formData = new FormData();

  formData.append(
    "audio",
    audioBlob,
    "recording.wav",
  );

  formData.append(
    "source_language",
    sourceLanguage,
  );


  if (sessionId) {
    formData.append(
      "session_id",
      sessionId,
    );
  }

  const response = await apiClient.post(
    API_ENDPOINTS.VOICE_CHAT,
    formData,
    {
      headers: {
        ...getHeaders(tenantId),
      },
    },
  );

  return response.data;
};

export const transcribeAudio = async (
  audioBlob: Blob,
  sourceLanguage: string = "en",
  tenantId: string,
) => {
  const formData = new FormData();

  formData.append(
    "audio",
    audioBlob,
    "recording.wav",
  );

  formData.append(
    "source_language",
    sourceLanguage,
  );

  const response = await apiClient.post(
    API_ENDPOINTS.VOICE_TRANSCRIBE,
    formData,
    {
      headers: {
        ...getHeaders(tenantId),
      },
    },
  );

  return response.data;
};
// ─── TTS ───────────────────────────────────────────────
export const synthesizeSpeech = async (
  text: string,
  language: string = "en",
  gender: string = "female",
  tenantId: string,
) => {
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
export const ingestDocuments = async (
  files: File[],
  tenantId: string,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await apiClient.post(
    API_ENDPOINTS.DOCUMENTS_INGEST,
    formData,
    {
      headers: {
        ...getHeaders(tenantId),
      },
      onUploadProgress,
    },
  );

  return response.data;
};
export const listDocuments = async (tenantId: string) => {
  const response = await apiClient.get(API_ENDPOINTS.DOCUMENTS_LIST, {
    headers: getHeaders(tenantId),
  });
  return response.data;
};

export const deleteDocument = async (documentId: string, tenantId: string) => {
  const response = await apiClient.delete(API_ENDPOINTS.DOCUMENT_DELETE(documentId), {
    headers: getHeaders(tenantId),
  });
  return response.data;
};

export const deleteAllDocuments = async (tenantId: string) => {
  const response = await apiClient.delete(API_ENDPOINTS.DOCUMENTS_DELETE_ALL, {
    headers: getHeaders(tenantId),
  });
  return response.data;
};

export const getJobStatus = async (jobId: string) => {
  const response = await apiClient.get(API_ENDPOINTS.JOB_STATUS(jobId));
  return response.data;
};

export const getDocumentFile = async (
  documentId: string,
  tenantId: string,
) => {
  const response = await apiClient.get(
    API_ENDPOINTS.DOCUMENT_FILE(documentId),
    {
      headers: getHeaders(tenantId),
      responseType: "blob",
    },
  );

  return response.data;
};

// ─── Sessions ──────────────────────────────────────────
export const listSessions = async (tenantId: string, limit = 20, offset = 0) => {
  const response = await apiClient.get(API_ENDPOINTS.SESSIONS_LIST, {
    headers: getHeaders(tenantId),
    params: { limit, offset },
  });
  return response.data;
};

export const getSessionHistory = async (sessionId: string, tenantId: string) => {
  const response = await apiClient.get(API_ENDPOINTS.SESSION_HISTORY(sessionId), {
    headers: getHeaders(tenantId),
  });
  return response.data;
};

export const deleteSession = async (sessionId: string, tenantId: string) => {
  const response = await apiClient.delete(API_ENDPOINTS.SESSION_DELETE(sessionId), {
    headers: getHeaders(tenantId),
  });
  return response.data;
};

// ─── Admin RAG Configuration ───────────────────────────

export interface RagConfigurationResponse {
  rag_mode: "simple" | "multiquery";
  max_queries: number;
}

export const getRagConfiguration = async () => {
  const response = await apiClient.get(
    API_ENDPOINTS.ADMIN_RAG_CONFIG,
  );

  const data = response.data?.data;

  return data as RagConfigurationResponse;
};

export const updateRagConfiguration = async (
  ragMode: "simple" | "multiquery",
  maxQueries: number,
) => {
  const response = await apiClient.put(
    API_ENDPOINTS.ADMIN_RAG_CONFIG,
    {
      rag_mode: ragMode,
      max_queries: maxQueries,
    },
  );

  const data = response.data?.data;

  return data as RagConfigurationResponse;
};

// ─── Health ────────────────────────────────────────────
export const healthCheck = async () => {
  const response = await apiClient.get(API_ENDPOINTS.HEALTH);
  return response.data;
};


export interface ChatStreamToken {
  type: "token";
  content: string;
  session_id: string;
}

export interface ChatStreamComplete extends ChatMessageResponse {
  type: "complete";
}

export type ChatStreamEvent = ChatStreamToken | ChatStreamComplete;

export const streamChatMessage = async (
  message: string,
  sessionId: string | null = null,
  tenantId: string,
  sourceLanguage: string = "en",
  onToken: (content: string) => void,
  signal?: AbortSignal,
  regenerateFromIndex?: number,
): Promise<ChatStreamComplete> => {
  const payload: {
    message: string;
    session_id?: string;
    source_language: string;
    regenerate_from_index?: number;

  } = {
    message,
    source_language: sourceLanguage,
  };
  if (regenerateFromIndex !== undefined) {
    payload.regenerate_from_index = regenerateFromIndex;
  }
  if (sessionId) {
    payload.session_id = sessionId;
  }

  const response = await fetch(API_ENDPOINTS.CHAT_MESSAGE_STREAM, {
    method: "POST",
    credentials: "include",
    headers: getJsonHeaders(tenantId),
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();
      if (errorData?.detail) {
        detail = errorData.detail;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(detail);
  }

  if (!response.body) {
    throw new Error("Streaming response body is not available.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let completeEvent: ChatStreamComplete | null = null;

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }

      const event = JSON.parse(line) as ChatStreamEvent;

      if (event.type === "token") {
        onToken(event.content);
      } else if (event.type === "complete") {
        completeEvent = event;
      }
    }
  }

  buffer += decoder.decode();

  if (buffer.trim()) {
    const event = JSON.parse(buffer) as ChatStreamEvent;

    if (event.type === "token") {
      onToken(event.content);
    } else if (event.type === "complete") {
      completeEvent = event;
    }
  }

  if (!completeEvent) {
    throw new Error("Streaming response ended without a complete event.");
  }

  return completeEvent;
};


// export const streamMultiqueryChatMessage = async (
//   message: string,
//   sessionId: string | null = null,
//   tenantId: string,
//   sourceLanguage: string = "en",
//   maxQueries: number = 6,
//   onToken: (content: string) => void,
// ): Promise<ChatStreamComplete> => {
//   const payload: {
//     message: string;
//     session_id?: string;
//     source_language: string;
//     use_multiquery: boolean;
//     max_queries: number;
//   } = {
//     message,
//     source_language: sourceLanguage,
//     use_multiquery: true,
//     max_queries: maxQueries,
//   };

//   if (sessionId) {
//     payload.session_id = sessionId;
//   }

//   const response = await fetch(API_ENDPOINTS.MULTIQUERY_CHAT_STREAM, {
//     method: "POST",
//     credentials: "include",
//     headers: getJsonHeaders(tenantId),
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     let detail = `Request failed with status ${response.status}`;

//     try {
//       const errorData = await response.json();

//       if (errorData?.detail) {
//         detail = errorData.detail;
//       }
//     } catch {
//       // Keep the default error message.
//     }

//     throw new Error(detail);
//   }

//   if (!response.body) {
//     throw new Error("Streaming response body is not available.");
//   }

//   const reader = response.body.getReader();
//   const decoder = new TextDecoder();

//   let buffer = "";
//   let completeEvent: ChatStreamComplete | null = null;

//   while (true) {
//     const { value, done } = await reader.read();

//     if (done) {
//       break;
//     }

//     buffer += decoder.decode(value, { stream: true });

//     const lines = buffer.split("\n");
//     buffer = lines.pop() ?? "";

//     for (const line of lines) {
//       if (!line.trim()) {
//         continue;
//       }

//       const event = JSON.parse(line) as ChatStreamEvent;

//       if (event.type === "token") {
//         onToken(event.content);
//       } else if (event.type === "complete") {
//         completeEvent = event;
//       }
//     }
//   }

//   buffer += decoder.decode();

//   if (buffer.trim()) {
//     const event = JSON.parse(buffer) as ChatStreamEvent;

//     if (event.type === "token") {
//       onToken(event.content);
//     } else if (event.type === "complete") {
//       completeEvent = event;
//     }
//   }

//   if (!completeEvent) {
//     throw new Error("Streaming response ended without a complete event.");
//   }

//   return completeEvent;
// };
