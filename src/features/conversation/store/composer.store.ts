import { create } from "zustand";

interface ComposerStore {

    text: string;

    setText(text: string): void;

    clear(): void;

}

export const useComposerStore = create<ComposerStore>((set) => ({

    text: "",

    setText: (text) =>
        set({ text }),

    clear: () =>
        set({ text: "" }),

}));