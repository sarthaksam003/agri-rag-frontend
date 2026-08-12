import type { ChatMessage } from "@/features/conversation/types/message";

export interface MockConversation {
    id: string;
    title: string;
    messages: ChatMessage[];
}

const createMessage = (
    sessionId: string,
    role: "user" | "assistant",
    content: string,
    inputType: "text" | "voice",
    minutesAgo: number,
    sources?: ChatMessage["sources"],
): ChatMessage => ({
    id: crypto.randomUUID(),
    conversationId: sessionId,
    role,
    content,
    createdAt: new Date(Date.now() - minutesAgo * 60_000),
    inputType,
    status: "completed",
    ...(sources ? { sources } : {}),
});

const MOCK_CONVERSATIONS: MockConversation[] = [
    {
        id: "session-1",
        title: "Fertilizer schedule for paddy",
        messages: [
            createMessage(
                "session-1",
                "user",
                "What fertilizer should I use for paddy cultivation?",
                "text",
                12,
            ),
            createMessage(
                "session-1",
                "assistant",
                "For paddy cultivation, nitrogen fertilizer is commonly applied in split doses during the crop's growth stages.",
                "text",
                11,
                [
                    {
                        id: "source-1",
                        documentId: "demo-doc",
                        documentName: "Rice Cultivation Guide.pdf",
                        pageNumber: 12,
                        chunkId: "chunk-001",
                        score: 0.93,
                        snippet:
                            "Apply nitrogen fertilizer in split doses during tillering.",
                    },
                ],
            ),
            createMessage(
                "session-1",
                "user",
                "When should I apply the second dose?",
                "voice",
                8,
            ),
            createMessage(
                "session-1",
                "assistant",
                "The second nitrogen application is generally made around the tillering stage. The exact timing depends on the rice variety and local cultivation practice.",
                "text",
                7,
                [
                    {
                        id: "source-2",
                        documentId: "demo-doc",
                        documentName: "Rice Cultivation Guide.pdf",
                        pageNumber: 13,
                        chunkId: "chunk-002",
                        score: 0.89,
                        snippet:
                            "The second nitrogen dose should coincide with active tillering.",
                    },
                ],
            ),
        ],
    },

    {
        id: "session-2",
        title: "Tomato blight identification",
        messages: [
            createMessage(
                "session-2",
                "user",
                "How can I identify blight in tomato plants?",
                "voice",
                25,
            ),
            createMessage(
                "session-2",
                "assistant",
                "Tomato blight can appear as dark spots on leaves and stems. Early identification is important because the disease can spread rapidly under favorable conditions.",
                "text",
                24,
                [
                    {
                        id: "source-3",
                        documentId: "demo-doc",
                        documentName: "Tomato Disease Management.pdf",
                        pageNumber: 8,
                        chunkId: "chunk-008",
                        score: 0.91,
                        snippet:
                            "Blight symptoms commonly include dark lesions on leaves and stems.",
                    },
                ],
            ),
        ],
    },

    {
        id: "session-3",
        title: "Wheat irrigation timing this season",
        messages: [
            createMessage(
                "session-3",
                "user",
                "When should wheat be irrigated?",
                "text",
                40,
            ),
            createMessage(
                "session-3",
                "assistant",
                "Important irrigation stages for wheat include crown root initiation and later grain development stages. Irrigation timing should also consider soil moisture and weather conditions.",
                "text",
                39,
                [
                    {
                        id: "source-4",
                        documentId: "demo-doc",
                        documentName: "Wheat Irrigation Schedule.pdf",
                        pageNumber: 5,
                        chunkId: "chunk-005",
                        score: 0.94,
                        snippet:
                            "Crown root initiation is one of the most important irrigation stages in wheat.",
                    },
                ],
            ),
        ],
    },

    {
        id: "session-4",
        title: "Pest control document summary",
        messages: [
            createMessage(
                "session-4",
                "user",
                "Summarize the pest control information.",
                "text",
                60,
            ),
            createMessage(
                "session-4",
                "assistant",
                "The document describes several approaches to pest management, including monitoring, preventive measures, and appropriate treatment when pest populations exceed recommended thresholds.",
                "text",
                59,
            ),
        ],
    },
];

export function getMockConversations(): MockConversation[] {
    return MOCK_CONVERSATIONS;
}

export function getMockConversation(
    sessionId: string,
): MockConversation | undefined {
    return MOCK_CONVERSATIONS.find(
        conversation => conversation.id === sessionId,
    );
}
export function createMockConversation(
    sessionId: string,
    title: string,
): MockConversation {
    const conversation: MockConversation = {
        id: sessionId,
        title,
        messages: [],
    };

    MOCK_CONVERSATIONS.push(conversation);

    return conversation;
}
export function addMessageToMockConversation(
    sessionId: string,
    message: ChatMessage,
): void {
    const conversation = getMockConversation(sessionId);

    if (!conversation) {
        throw new Error(`Conversation not found: ${sessionId}`);
    }

    conversation.messages.push(message);
}

export function updateMockConversationTitle(
    sessionId: string,
    title: string,
): void {
    const conversation = getMockConversation(sessionId);

    if (!conversation) {
        throw new Error(`Conversation not found: ${sessionId}`);
    }

    conversation.title = title;
}