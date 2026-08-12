import { create } from "zustand";

export type RagMode = "simple" | "multi";

interface SettingsStore {
    ragMode: RagMode;
    maxQueries: number;

    profileName: string;
    occupation: string;

    setRagMode: (mode: RagMode) => void;
    setMaxQueries: (queries: number) => void;

    setProfileName: (name: string) => void;
    setOccupation: (occupation: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    ragMode: "simple",
    maxQueries: 2,

    profileName: "Sarthak Sambharia",
    occupation: "Employee",

    setRagMode: (mode) =>
        set({
            ragMode: mode,
        }),

    setMaxQueries: (queries) =>
        set({
            maxQueries: Math.min(6, Math.max(2, queries)),
        }),

    setProfileName: (name) =>
        set({
            profileName: name,
        }),

    setOccupation: (occupation) =>
        set({
            occupation,
        }),
}));