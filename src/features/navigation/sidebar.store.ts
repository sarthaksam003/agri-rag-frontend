import { create } from "zustand";
import type { SidebarTab } from "@/shared/types/sidebar";

interface SidebarStore {
    isCollapsed: boolean;
    activeTab: SidebarTab;

    setCollapsed: (collapsed: boolean) => void;
    toggleSidebar: () => void;
    setActiveTab: (tab: SidebarTab) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    isCollapsed: false,
    activeTab: "chat",

    setCollapsed: (collapsed) =>
        set({ isCollapsed: collapsed }),

    toggleSidebar: () =>
        set((state) => ({
            isCollapsed: !state.isCollapsed,
        })),

    setActiveTab: (tab) =>
        set({ activeTab: tab }),
}));