import { create } from "zustand";

interface UserMenuStore {

    open: boolean;

    toggle(): void;

    close(): void;
}

export const useUserMenuStore = create<UserMenuStore>((set) => ({

    open: false,

    toggle: () =>
        set((state) => ({
            open: !state.open,
        })),

    close: () =>
        set(() => ({
            open: false,
        })),

}));