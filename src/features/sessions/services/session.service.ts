import {
    deleteSession as deleteSessionApi,
    // getSessionHistory,
    listSessions,
} from "@/services/apiClient";

import { DEFAULT_TENANT_ID } from "@/config/apiConfig";

import type { Session } from "../types/session.types";

interface BackendSession {
    session_id: string;
    title: string | null;
    message_count: number;
    last_updated: string;
}

interface BackendSessionListResponse {
    message: string;
    data: {
        sessions: BackendSession[];
        total: number;
        limit: number;
        offset: number;
    };
}

// interface BackendHistoryResponse {
//     message: string;
//     data: {
//         session_id: string;
//         history: Array<{
//             user: string;
//             assistant: string;
//         }>;
//         total_messages: number;
//     };
// }

/**
 * Convert the backend session representation into
 * the frontend Session representation.
 *
 * Backend:
 *   session_id
 *   message_count
 *   last_updated
 *
 * Frontend:
 *   id
 *   title
 *   messageCount
 *   updatedAt
 */
export async function getSessions(): Promise<Session[]> {
    const response: BackendSessionListResponse =
        await listSessions(
            DEFAULT_TENANT_ID,
        );

    const backendSessions =
        response.data?.sessions ?? [];

    const sessions = backendSessions.map(
        backendSession => ({
            id: backendSession.session_id,
            title:
                backendSession.title ??
                "Untitled conversation",
            messageCount:
                backendSession.message_count,
            updatedAt:
                new Date(
                    backendSession.last_updated,
                ),
        }),
    );

    return sessions.sort(
        (a, b) =>
            b.updatedAt.getTime() -
            a.updatedAt.getTime(),
    );
}
/**
 * Delete a session through the real backend.
 */
export async function deleteSession(
    sessionId: string,
): Promise<void> {
    await deleteSessionApi(
        sessionId,
        DEFAULT_TENANT_ID,
    );
}