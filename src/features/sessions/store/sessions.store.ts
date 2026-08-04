import { create } from "zustand";

interface SessionStore {
    // Sessions
    sessions: any[];
    sessionsLoading: boolean,
    setSessions: (sessions: any[]) => void;

    setSessionsLoading: (
        loading: boolean
    ) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({

    sessions: [],
    sessionsLoading: false,
    setSessions: (sessions: any[]) => set({ sessions }),
    setSessionsLoading: (loading: boolean) => set({ sessionsLoading: loading }),
})
);