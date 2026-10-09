export interface SourceReference {
    id: string;

    documentId?: string;

    documentName: string;

    pageNumber?: number;

    chunkId: string;

    score: number;

    snippet: string;
}