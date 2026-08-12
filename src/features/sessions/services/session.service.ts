import { getMockConversation, getMockConversations } from "@/features/conversation/services/mockConversation.repository";
import type { Session } from "../types/session.types";

export async function getSessions(): Promise<Session[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return getMockConversations()
        .map(conversation => {
            const latestMessage =
                conversation.messages[
                    conversation.messages.length - 1
                ];

            return {
                id: conversation.id,
                title: conversation.title,
                messageCount: conversation.messages.length,
                updatedAt:
                    latestMessage?.createdAt ??
                    new Date(0),
            };
        })
        .sort(
            (a, b) =>
                b.updatedAt.getTime() -
                a.updatedAt.getTime()
        );
}

export async function deleteSession(
    sessionId: string,
): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const conversation = getMockConversation(sessionId);

    if (!conversation) {
        throw new Error(`Session not found: ${sessionId}`);
    }

    // Actual mock deletion will be implemented when we
    // connect session deletion to the shared repository.
}