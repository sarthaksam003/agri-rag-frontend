import { useEffect, useState } from "react";
import axios from "axios";
import type { SourceReference } from "@/features/conversation/types/source";
import { useParams } from "react-router-dom";

import {
    ConversationView,
} from "@/features/conversation/components/ConversationView/ConversationView";

import { useConversationStore } from "@/features/conversation/store/conversation.store";

import { getChatHistory } from "@/services/apiClient";
import { DEFAULT_TENANT_ID } from "@/config/apiConfig";

import { LoadingScreen } from "@/app/router/LoadingScreen";
import { ResourceNotFoundScreen } from "@/app/router/ResourceNotFoundScreen";

export const ConversationPage = () => {
    const { conversationId } = useParams<{
        conversationId?: string;
    }>();

    const setSessionId = useConversationStore(
        state => state.setSessionId,
    );

    const setConversationTitle = useConversationStore(
        state => state.setConversationTitle,
    );

    const setMessages = useConversationStore(
        state => state.setMessages,
    );

    const setStatus = useConversationStore(
        state => state.setStatus,
    );
    const activeRequestSessionId = useConversationStore(
        state => state.activeRequestSessionId,
    );

    const status = useConversationStore(
        state => state.status,
    );
    const [resourceNotFound, setResourceNotFound] =
        useState(false);

    const [resolvedConversationId, setResolvedConversationId] =
        useState<string | null>(null);

    useEffect(() => {
        // /chat is always a new conversation.
        if (!conversationId) {
            setResourceNotFound(false);
            setResolvedConversationId(null);
            return;
        }

        let cancelled = false;

        /*
         * Check whether this exact conversation already has an
         * in-flight request.
         *
         * We use getState() here instead of the subscribed `status`
         * value so that changes from waiting -> streaming -> idle
         * do not cause this effect to run again.
         */
        const currentState = useConversationStore.getState();

        const requestAlreadyActive =
            currentState.activeRequestSessionId === conversationId &&
            (
                currentState.status === "waiting" ||
                currentState.status === "streaming"
            );

        if (requestAlreadyActive) {
            /*
             * The conversation is already known locally and has an
             * active response. Let ConversationView render immediately
             * so the existing StreamingMessage remains visible.
             */
            setResolvedConversationId(conversationId);
        } else {
            setResourceNotFound(false);
        }

        const loadHistory = async () => {
            setResourceNotFound(false);

            try {
                const data = await getChatHistory(
                    conversationId,
                    DEFAULT_TENANT_ID,
                );

                if (cancelled) {
                    return;
                }

                const history =
                    data?.data?.history ?? [];
                
                setConversationTitle(
                    data?.data?.title ?? null,
                );
                const messages = history.flatMap(
                    (
                        item: {
                            user: string;
                            user_timestamp?: string | null;
                            assistant_timestamp?: string | null;
                            assistant: string;
                            user_language?: string;
                            assistant_language?: string;
                            user_input_type?:
                            | "text"
                            | "voice"
                            | "suggestion";
                            sources?: Array<{
                                source: string;
                                document_id?: string | null;
                                chunk_id?: string | null;
                                chunk_index?: number | null;
                                content: string;
                                relevance_score?: number | null;
                            }>;
                        },
                        index: number,
                    ) => {
                        const userMessage = {
                            id: `${conversationId}-user-${index}`,
                            conversationId,
                            role: "user" as const,
                            content: item.user,
                            createdAt: item.user_timestamp
                                ? new Date(item.user_timestamp)
                                : new Date(),
                            inputType:
                                item.user_input_type ?? "text",
                            status: "completed" as const,
                        };

                        const assistantMessage = {
                            id: `${conversationId}-assistant-${index}`,
                            conversationId,
                            role: "assistant" as const,
                            content: item.assistant,
                            createdAt: item.assistant_timestamp
                                ? new Date(item.assistant_timestamp)
                                : new Date(),
                            inputType: "text" as const,
                            status: "completed" as const,
                            sources: item.sources?.map(
                                (source): SourceReference => ({
                                    id: `${source.source}:${source.chunk_id}`,
                                    documentId: source.document_id ?? undefined,
                                    documentName: source.source,
                                    chunkId: source.chunk_id ?? "unknown",
                                    score: source.relevance_score ?? 0,
                                    snippet: source.content,
                                }),
                            ) ?? [],
                        };

                        return [
                            userMessage,
                            assistantMessage,
                        ];
                    },
                );

                /*
                 * Check again after history has loaded.
                 *
                 * The response may still be running. If it is,
                 * do NOT replace the local messages with older
                 * history, because that would remove the current
                 * in-progress conversation state.
                 */
                const latestState =
                    useConversationStore.getState();

                const requestStillActive =
                    latestState.activeRequestSessionId !== null &&
                    (
                        latestState.status === "waiting" ||
                        latestState.status === "streaming"
                    );

                const requestStillActiveForConversation =
                    requestStillActive &&
                    latestState.activeRequestSessionId === conversationId;

                if (!requestStillActiveForConversation) {
                    setMessages(messages);
                }

                if (!requestStillActive) {
                    setStatus("idle");
                }

                setSessionId(
                    data?.data?.session_id ??
                    conversationId,
                );

                setResolvedConversationId(conversationId);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to load chat history:",
                    error,
                );

                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 404
                ) {
                    setResourceNotFound(true);
                    setResolvedConversationId(
                        conversationId,
                    );
                    return;
                }

                setStatus("error");
            }
        };

        void loadHistory();

        return () => {
            cancelled = true;
        };
    }, [
        conversationId,
        setMessages,
        setSessionId,
        setConversationTitle,
        setStatus,
    ]);
    /*
     * /chat is always the new-chat route.
     * This check deliberately comes before resourceNotFound.
     */
    if (!conversationId) {
        return <ConversationView />;
    }

    /*
     * A conversation ID exists but we have not finished
     * resolving that ID yet. Show the loading screen instead
     * of briefly rendering an empty conversation.
     */
    const activeRequestForConversation =
        activeRequestSessionId === conversationId &&
        (
            status === "waiting" ||
            status === "streaming"
        );

    if (
        resolvedConversationId !== conversationId &&
        !resourceNotFound &&
        !activeRequestForConversation
    ) {
        return <LoadingScreen message="Loading conversation" />;
    }

    if (resourceNotFound) {
        return <ResourceNotFoundScreen />;
    }

    return <ConversationView />;
};