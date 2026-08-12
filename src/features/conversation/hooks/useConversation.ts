import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useConversationStore } from "@/features/conversation/store/conversation.store";
import { sendMockMessage } from "@/features/conversation/services/mockConversation.service";
import {
    addMessageToMockConversation,
    createMockConversation,
} from "@/features/conversation/services/mockConversation.repository";

export function useConversation() {
    const navigate = useNavigate();

    const {
        messages,
        sessionId,
        status,
        addMessage,
        setSessionId,
        setStatus,
    } = useConversationStore();

    const sendMessage = useCallback(
        async (
            text: string,
            inputType: "text" | "voice",
        ) => {
            let activeSessionId = sessionId;
            let isNewConversation = false;

            if (!activeSessionId) {
                activeSessionId = crypto.randomUUID();

                createMockConversation(
                    activeSessionId,
                    text.trim().slice(0, 50),
                );

                setSessionId(activeSessionId);

                navigate(`/chat/${activeSessionId}`);
            }

            const userMessage = {
                id: crypto.randomUUID(),
                conversationId: activeSessionId,
                role: "user" as const,
                content: text,
                createdAt: new Date(),
                inputType,
                status: "completed" as const,
            };

            addMessage(userMessage);

            addMessageToMockConversation(
                activeSessionId,
                userMessage,
            );

            if (isNewConversation) {
                navigate(`/chat/${activeSessionId}`);
            }

            setStatus("waiting");

            try {
                const assistant =
                    await sendMockMessage(
                        text,
                        activeSessionId,
                    );

                addMessage(assistant);

                addMessageToMockConversation(
                    activeSessionId,
                    {
                        ...assistant,
                        conversationId: activeSessionId,
                    },
                );

                setStatus("idle");
            } catch {
                setStatus("error");
            }
        },
        [
            addMessage,
            navigate,
            setSessionId,
            setStatus,
            sessionId,
        ],
    );

    return {
        messages,
        status,
        sendMessage,
    };
}