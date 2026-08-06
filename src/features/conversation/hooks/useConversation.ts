import { useCallback } from "react";

import { useConversationStore } from "@/features/conversation/store/conversation.store";
import { sendMockMessage } from "@/features/conversation/services/mockConversation.service";

export function useConversation() {

    const {
        messages,
        status,
        addMessage,
        setStatus,
    } = useConversationStore();

    const sendMessage = useCallback(
        async (
            text: string,
            inputType: "text" | "voice",
        ) => {

            addMessage({

                id: crypto.randomUUID(),

                conversationId: crypto.randomUUID(),

                role: "user",

                content: text,

                createdAt: new Date(),

                inputType,

                status: "completed",

            });

            setStatus("waiting");

            try {

                const assistant =
                    await sendMockMessage(text);

                addMessage(assistant);

                setStatus("idle");

            } catch {

                setStatus("error");

            }

        },
        [
            addMessage,
            setStatus,
        ],
    );

    return {

        messages,

        status,

        sendMessage,

    };

}