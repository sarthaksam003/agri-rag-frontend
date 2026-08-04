import { create } from "zustand";

interface SidebarStore {

    isCollapsed: boolean;

    setCollapsed: (collapsed: boolean) => void;

    toggleSidebar: () => void;

}

export const useSidebarStore = create<SidebarStore>((set) => ({

    isCollapsed: false,

    setCollapsed: (collapsed) =>
        set({ isCollapsed: collapsed }),

    toggleSidebar: () =>
        set((state) => ({
            isCollapsed: !state.isCollapsed,
        })),

}));