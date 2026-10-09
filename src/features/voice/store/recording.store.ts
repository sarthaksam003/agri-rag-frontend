import { RecordingState } from "@/features/conversation/types/recording";
import { create } from "zustand";

export interface RecordingStore {

    state: RecordingState;

    duration: number;

    start(): void;

    beginTranscription(): void;

    finishTranscription(): void;

    cancel(): void;

    tick(): void;
}

export const useRecordingStore = create<RecordingStore>((set) => ({
    state: "idle",
    duration: 0,

    start: () =>
        set({
            state: "recording",
            duration: 0,
        }),

    cancel: () =>
        set({
            state: "idle",
            duration: 0,
        }),
    tick: () =>
        set((state) => ({
            duration: state.duration + 1,
        })),
    beginTranscription: () =>
        set(() => ({
            state: "transcribing",
        })),

    finishTranscription: () =>
        set(() => ({
            state: "idle",
        })),

}));