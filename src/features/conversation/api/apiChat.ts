import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface ChatMessageRequest {
    message: string;
    session_id?: string | null;
    use_multiquery?: boolean;
    max_queries?: number;
}

export interface RetrievalInfo {
    chunk_id: number;
    source_queries: string[];
    retrieval_score: number | null;
    metadata: Record<string, unknown>;
}

export interface ChatMessageResponse {
    id: string;
    session_id: string;
    message: string;
    response: string;
    timestamp: string;
    chunks: string[];
    hallucination_spans: Record<string, unknown> | null;
    retrieved_documents_count: number;
    generated_queries: string[];
    retrieval_strategy: string;
    retrieval_analysis: Record<string, unknown>;
    chunk_retrieval_info: RetrievalInfo[];
}

const TENANT_ID = "demo-tenant";

export const chatApi = {
    async sendMessage(
        request: ChatMessageRequest,
    ): Promise<ChatMessageResponse> {
        const response = await axios.post<ChatMessageResponse>(
            `${API_BASE_URL}/api/v1/multiquery-chat/message`,
            request,
            {
                withCredentials: true,
                headers: {
                    "X-Tenant-ID": TENANT_ID,
                },
            },
        );

        return response.data;
    },
};