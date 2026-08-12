import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { Session } from "../types/session.types";
import {
    deleteSession,
    getSessions,
} from "../services/session.service";

import { useToast } from "@/shared/components/hooks/useToast";

export function useSessions() {
    const { showToast } = useToast();

    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [search, setSearch] = useState("");

    const loadSessions = useCallback(
        async (refresh = false) => {
            try {
                if (refresh) {
                    setIsRefreshing(true);
                } else {
                    setIsLoading(true);
                }

                const result = await getSessions();

                setSessions(result);
            } catch {
                showToast(
                    "Unable to load sessions. Please try again.",
                    {
                        type: "error",
                    }
                );
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [showToast]
    );

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    const refreshSessions = useCallback(async () => {
        await loadSessions(true);
    }, [loadSessions]);

    const filteredSessions = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return sessions;
        }

        return sessions.filter(session =>
            session.title.toLowerCase().includes(query)
        );
    }, [sessions, search]);

    const removeSession = useCallback(
        async (sessionId: string) => {
            try {
                await deleteSession(sessionId);

                setSessions(currentSessions =>
                    currentSessions.filter(
                        session => session.id !== sessionId
                    )
                );

                showToast(
                    "Session deleted successfully.",
                    {
                        type: "success",
                    }
                );
            } catch {
                showToast(
                    "Unable to delete session. Please try again.",
                    {
                        type: "error",
                    }
                );

                throw new Error("Failed to delete session");
            }
        },
        [showToast]
    );

    return {
        sessions,
        filteredSessions,
        search,
        setSearch,
        isLoading,
        isRefreshing,
        refreshSessions,
        removeSession,
    };
}