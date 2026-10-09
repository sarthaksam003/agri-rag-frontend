import {
    listDocuments,
    ingestDocuments,
    getJobStatus,
    deleteDocument as apiDeleteDocument,
    getDocumentFile as apiGetDocumentFile,
    deleteAllDocuments as apiDeleteAllDocuments,
} from "@/services/apiClient";

import { DEFAULT_TENANT_ID } from "@/config/apiConfig";
import type { DocumentFile } from "../types/document";

interface BackendDocument {
    id: string;
    filename: string;
    file_size: number;
    ingested_at: string;
    chunk_count: number;
}

interface BackendDocumentsResponse {
    data?: {
        documents?: BackendDocument[];
    };
}

interface UploadResponseItem {
    document_id: string;
    filename: string;
    status: string;
    job_id?: string | null;
}

export interface UploadResponse {
    processed_files: UploadResponseItem[];
    total_processed: number;
    total_failed: number;
}

export interface JobStatusResponse {
    job_id: string;
    status?: string;
    error?: string;
    [key: string]: unknown;
}

const toDocumentFile = (document: BackendDocument): DocumentFile => ({
    id: document.id,
    filename: document.filename,
    chunkCount: document.chunk_count,
    uploadedAt: new Date(document.ingested_at),
    fileType: document.filename.toLowerCase().endsWith(".pdf")
        ? "pdf"
        : "unknown",
    status: "ready",
});


export async function getDocuments(): Promise<DocumentFile[]> {
    const response =
        await listDocuments(
            DEFAULT_TENANT_ID,
        ) as BackendDocumentsResponse;

    const documents =
        response.data?.documents ?? [];

    return documents.map(toDocumentFile);
}

export async function uploadDocuments(
    files: File[],
    onUploadProgress?: Parameters<typeof ingestDocuments>[2],
): Promise<UploadResponse> {
    return ingestDocuments(
        files,
        DEFAULT_TENANT_ID,
        onUploadProgress,
    ) as Promise<UploadResponse>;
}

export async function getDocumentJobStatus(
    jobId: string,
): Promise<JobStatusResponse> {
    return getJobStatus(jobId) as Promise<JobStatusResponse>;
}

export async function deleteDocument(
    documentId: string,
) {
    return apiDeleteDocument(
        documentId,
        DEFAULT_TENANT_ID,
    );
}

export async function deleteAllDocuments() {
    return apiDeleteAllDocuments(
        DEFAULT_TENANT_ID,
    );
}

export async function getDocumentFile(
    documentId: string,
): Promise<Blob> {
    return apiGetDocumentFile(
        documentId,
        DEFAULT_TENANT_ID,
    ) as Promise<Blob>;
}

// export async function testDocumentFile(
//     documentId: string,
// ): Promise<void> {
//     const blob = await getDocumentFile(documentId);

//     console.log(
//         "PDF blob:",
//         blob.type,
//         blob.size,
//     );
// }
