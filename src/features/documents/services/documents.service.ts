import type { DocumentFile } from "../types/document";

const delay = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

const MOCK_DOCUMENTS: DocumentFile[] = [

    {
        id: "1",
        filename: "fertilizer_guidelines_2026.pdf",
        chunkCount: 142,
        status: "ready",
        uploadedAt: new Date(),
        fileType: "pdf",
    },

    {
        id: "2",
        filename: "pest_management_handbook.pdf",
        chunkCount: 98,
        uploadedAt: new Date(),
        fileType: "pdf",
        status: "ready",
    },

    {
        id: "3",
        filename: "wheat_irrigation_schedule.pdf",
        chunkCount: 51,
        uploadedAt: new Date(),
        fileType: "pdf",
        status: "ready",
    },

    {
        id: "4",
        filename: "soil_health_advisory_kharif.pdf",
        chunkCount: 67,
        uploadedAt: new Date(),
        fileType: "pdf",
        status: "ready",
    },

];

export async function getDocuments() {

    await delay(600);

    return MOCK_DOCUMENTS;

}

export async function mockUploadDocument(
    file: File
): Promise<DocumentFile> {

    await delay(2000);

    const extension =
        file.name
            .split(".")
            .pop()
            ?.toLowerCase();

    return {

        id: crypto.randomUUID(),

        filename: file.name,

        chunkCount: Math.floor(
            Math.random() * 120
        ) + 20,

        uploadedAt: new Date(),

        fileType:
            extension === "pdf"
                ? "pdf"
                : "unknown",

        status: "ready",

        fileUrl: URL.createObjectURL(file),

    };

}