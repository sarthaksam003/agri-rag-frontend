export type DocumentFileType =
    | "pdf"
    | "csv"
    | "doc"
    | "docx"
    | "xlsx"
    | "txt"
    | "unknown";

export interface DocumentFile {

    id: string;

    filename: string;

    chunkCount: number;

    uploadedAt: Date;

    fileType: DocumentFileType;

    status: DocumentStatus;

    fileUrl?: string;

}

export type DocumentStatus =
    | "queued"
    | "uploading"
    | "processing"
    | "ready"
    | "failed";