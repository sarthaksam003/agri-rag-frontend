import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "@/features/settings/store/settings.store";
import { useConversationStore } from "@/features/conversation/store/conversation.store";
import {
    // sendChatMessage,
    streamChatMessage,
    sendVoiceChatMessage,
    type ChatSourceResponse,
} from "@/services/apiClient";
import { DEFAULT_TENANT_ID } from "@/config/apiConfig";
import type { ChatMessage } from "@/features/conversation/types/message";

const NEW_CHAT_REQUEST_ID = "__new_chat__";

export function useConversation() {
    const navigate = useNavigate();
    const { language } = useSettingsStore();
    const {
        messages,
        addMessage,
        sessionId,
        setSessionId,
        setConversationTitle,
        setActiveRequestSessionId,
        setStatus,
        status, removeMessage,
        updateMessage,
    } = useConversationStore();
    const abortControllerRef = useRef<AbortController | null>(null);


    const sendMessage = useCallback(
        async (
            text: string,
            inputType: "text" | "voice",
        ) => {
            const trimmedText = text.trim();

            if (!trimmedText) {
                return;
            }

            /*
             * The backend is the source of truth for session IDs.
             *
             * For a new conversation, sessionId is null.
             * The backend creates the session and returns its ID.
             */
            const activeSessionId = sessionId;
            const requestConversationId =
                activeSessionId ?? NEW_CHAT_REQUEST_ID;

            setActiveRequestSessionId(requestConversationId);
            setStatus("waiting");
            const userMessage = {
                id: crypto.randomUUID(),
                conversationId: activeSessionId ?? "",
                role: "user" as const,
                content: trimmedText,
                createdAt: new Date(),
                inputType,
                status: "completed" as const,
            };

            addMessage(userMessage);
            const assistantMessageId = crypto.randomUUID();
            const abortController = new AbortController();
            abortControllerRef.current = abortController;

            try {
                /*
                * The current text integration uses the Simple RAG endpoint.
                * Voice input is not being integrated into this path yet.
                */
                if (inputType !== "text") {
                    throw new Error(
                        "Voice input is not connected to the backend yet.",
                    );
                }
                await new Promise<void>((resolve) => {
                    requestAnimationFrame(() => resolve());
                });


                const assistantMessage = {
                    id: assistantMessageId,
                    conversationId: activeSessionId ?? "",
                    role: "assistant" as const,
                    content: "",
                    createdAt: new Date(),
                    inputType: "text" as const,
                    status: "completed" as const,
                    sources: [],
                };

                addMessage(assistantMessage);

                const handleToken = (token: string) => {
                    const currentMessage = useConversationStore
                        .getState()
                        .messages.find((message) => message.id === assistantMessageId);

                    if (!currentMessage) {
                        return;
                    }

                    updateMessage(assistantMessageId, {
                        content: currentMessage.content + token,
                    });
                };


                const data = await streamChatMessage(
                    trimmedText,
                    activeSessionId,
                    DEFAULT_TENANT_ID,
                    language,
                    handleToken,
                    abortController.signal,
                );

                const backendSessionId = data.session_id;
                if (!activeSessionId && data.session_title) {
                    setConversationTitle(data.session_title);
                }
                const targetSessionId =
                    backendSessionId ?? activeSessionId;

                if (!activeSessionId && backendSessionId) {
                    setSessionId(backendSessionId);
                }

                updateMessage(assistantMessageId, {
                    id: data.id ?? assistantMessageId,
                    conversationId:
                        backendSessionId ?? activeSessionId ?? "",
                    content: data.response,
                    createdAt: data.timestamp
                        ? new Date(data.timestamp)
                        : new Date(),
                    sources:
                        data.sources?.map((source: ChatSourceResponse) => ({
                            id: `${source.source}:${source.chunk_id}`,
                            documentId: source.document_id ?? undefined,
                            pageNumber: source.page_number ?? undefined,
                            documentName: source.source,
                            chunkId: source.chunk_id,
                            score: source.relevance_score,
                            snippet: source.content,
                        })) ?? [],
                });

                setActiveRequestSessionId(null);
                setStatus("idle");

                if (targetSessionId) {
                    navigate(`/chat/${targetSessionId}`);
                }
            } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") {
                    updateMessage(assistantMessageId, {
                        status: "cancelled",
                    });
                    setActiveRequestSessionId(null);
                    setStatus("idle");
                    return;
                }

                console.error("Failed to send chat message:", error);
                removeMessage(assistantMessageId);
                setActiveRequestSessionId(null);
                setStatus("error");
            }
            finally {
                if (abortControllerRef.current === abortController) {
                    abortControllerRef.current = null;
                }
            }
        },
        [
            addMessage,
            language,
            removeMessage,
            navigate,
            sessionId,
            setSessionId,
            setConversationTitle,
            setActiveRequestSessionId,
            setStatus,
            updateMessage,
        ],
    );


    const resendMessage = useCallback(
        async (
            message: ChatMessage,
            editedContent: string,
        ) => {
            const trimmedText = editedContent.trim();

            if (!trimmedText) {
                return;
            }

            if (status === "waiting" || status === "streaming") {
                return;
            }

            const messageIndex = messages.findIndex(
                (currentMessage) => currentMessage.id === message.id,
            );

            if (messageIndex === -1) {
                return;
            }

            if (message.role !== "user") {
                return;
            }

            if (!sessionId) {
                return;
            }

            const activeSessionId = sessionId;

            setActiveRequestSessionId(activeSessionId);
            setStatus("waiting");

            const editedUserMessage: ChatMessage = {
                ...message,
                content: trimmedText,
                conversationId: activeSessionId,
                createdAt: new Date(),
                status: "completed",
            };

            const assistantMessageId = crypto.randomUUID();

            const assistantMessage: ChatMessage = {
                id: assistantMessageId,
                conversationId: activeSessionId,
                role: "assistant",
                content: "",
                createdAt: new Date(),
                inputType: "text",
                status: "completed",
                sources: [],
            };

            /*
             * Replace the edited message and discard everything after it.
             * The backend will perform the same truncation using
             * regenerate_from_index.
             */
            const newMessages = [
                ...messages.slice(0, messageIndex),
                editedUserMessage,
                assistantMessage,
            ];

            useConversationStore.setState({
                messages: newMessages,
            });

            const abortController = new AbortController();
            abortControllerRef.current = abortController;

            try {
                await new Promise<void>((resolve) => {
                    requestAnimationFrame(() => resolve());
                });

                const handleToken = (token: string) => {
                    const currentMessage = useConversationStore
                        .getState()
                        .messages.find(
                            (currentMessage) =>
                                currentMessage.id === assistantMessageId,
                        );

                    if (!currentMessage) {
                        return;
                    }

                    updateMessage(assistantMessageId, {
                        content: currentMessage.content + token,
                        status: "streaming",
                    });
                };

                const data = await streamChatMessage(
                    trimmedText,
                    activeSessionId,
                    DEFAULT_TENANT_ID,
                    language,
                    handleToken,
                    abortController.signal,
                    messageIndex,
                );

                updateMessage(assistantMessageId, {
                    id: data.id ?? assistantMessageId,
                    conversationId: data.session_id ?? activeSessionId,
                    content: data.response,
                    createdAt: data.timestamp
                        ? new Date(data.timestamp)
                        : new Date(),
                    status: "completed",
                    sources:
                        data.sources?.map(
                            (source: ChatSourceResponse) => ({
                                id: `${source.source}:${source.chunk_id}`,
                                documentId:
                                    source.document_id ?? undefined,
                                pageNumber:
                                    source.page_number ?? undefined,
                                documentName: source.source,
                                chunkId: source.chunk_id,
                                score: source.relevance_score,
                                snippet: source.content,
                            }),
                        ) ?? [],
                });

                setActiveRequestSessionId(null);
                setStatus("idle");
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    updateMessage(assistantMessageId, {
                        status: "cancelled",
                    });

                    setActiveRequestSessionId(null);
                    setStatus("idle");
                    return;
                }

                console.error(
                    "Failed to resend chat message:",
                    error,
                );

                updateMessage(assistantMessageId, {
                    status: "error",
                });

                setActiveRequestSessionId(null);
                setStatus("error");
            } finally {
                if (abortControllerRef.current === abortController) {
                    abortControllerRef.current = null;
                }
            }
        },
        [
            language,
            messages,
            sessionId,
            setActiveRequestSessionId,
            setStatus,
            status,
            updateMessage,
        ],
    );


    const stopGeneration = () => {
        abortControllerRef.current?.abort();
    };
    const sendVoiceMessage = useCallback(
        async (audio: Blob) => {
            if (!audio || audio.size === 0) {
                return;
            }

            const activeSessionId = sessionId;
            const requestConversationId =
                activeSessionId ?? NEW_CHAT_REQUEST_ID;
            setActiveRequestSessionId(requestConversationId);

            setStatus("waiting");

            try {
                console.log(
                    "Sending voice message:",
                    audio.size,
                    "bytes",
                    audio.type
                );

                const data = await sendVoiceChatMessage(
                    audio,
                    language,
                    activeSessionId,
                    DEFAULT_TENANT_ID
                );

                const backendSessionId = data.session_id;

                if (!activeSessionId && backendSessionId) {
                    setSessionId(backendSessionId);

                    navigate(`/chat/${backendSessionId}`, {
                        replace: true,
                    });
                }

                const userMessage = {
                    id: data.id ?? crypto.randomUUID(),
                    conversationId:
                        backendSessionId ?? activeSessionId ?? "",
                    role: "user" as const,
                    content: data.original_message,
                    createdAt: data.timestamp
                        ? new Date(data.timestamp)
                        : new Date(),
                    inputType: "voice" as const,
                    status: "completed" as const,
                };

                const assistantMessage = {
                    id: crypto.randomUUID(),
                    conversationId:
                        backendSessionId ?? activeSessionId ?? "",
                    role: "assistant" as const,
                    content:
                        data.translated_response ??
                        data.response,
                    createdAt: data.timestamp
                        ? new Date(data.timestamp)
                        : new Date(),
                    inputType: "text" as const,
                    status: "completed" as const,
                };

                addMessage(userMessage);
                addMessage(assistantMessage);
                setActiveRequestSessionId(null);

                setStatus("idle");
            } catch (error) {
                console.error(
                    "Failed to send voice message:",
                    error
                );
                setActiveRequestSessionId(null);
                setStatus("error");
            }
        },
        [
            addMessage,
            navigate,
            sessionId,
            setSessionId,
            setStatus,
            setActiveRequestSessionId,
            language,
        ]
    );
    return {
        messages,
        status,
        sendMessage, resendMessage,

        sendVoiceMessage,
        stopGeneration,
        setActiveRequestSessionId
    };
}