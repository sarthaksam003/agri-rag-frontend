import { ChatMessage } from "@/features/conversation/types/message";

export async function sendMockMessage(
    text: string,
    sessionId: string
): Promise<ChatMessage> {
    const delay = (ms: number) =>
        new Promise((resolve) => {
            setTimeout(resolve, ms);
        });

    await delay(800 + Math.random() * 1200);

    return {
        id: crypto.randomUUID(),
        conversationId: sessionId,
        role: "assistant",
        content: "This is a mocked AI response.",
        createdAt: new Date(),
        inputType: "text",
        status: "completed",
        sources: [
            {
                id: crypto.randomUUID(),
                documentId: "demo-doc",
                documentName: "Rice Cultivation Guide.pdf",
                pageNumber: 12,
                chunkId: "chunk-001",
                score: 0.93,
                snippet:
                    "Apply nitrogen fertilizer in split doses during tillering.",
            },
        ],
    };
}