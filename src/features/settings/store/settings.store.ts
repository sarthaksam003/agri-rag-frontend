import { create } from "zustand";

interface SettingsStore {
    // Sessions
    tenantId: string | number | readonly string[] | undefined,
    maxQueries: number,
    setTenantId: (
        id: string
    ) => void;

    setMaxQueries: (
        n: number
    ) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({

    tenantId: "",
    maxQueries: 1,
    setTenantId: (id: string) => set({ tenantId: id }),
    setMaxQueries: (n: number) => set({ maxQueries: n }),
})
);