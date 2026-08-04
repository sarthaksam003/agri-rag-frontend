import { create } from "zustand";

interface AudioStore {
  isRecording: boolean;
  isPlayingAudio: boolean;
  currentAudioId: string | null;

  setIsRecording: (recording: boolean) => void;

  setIsPlayingAudio: (
    playing: boolean,
    id?: string | null
  ) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  isRecording: false,
  isPlayingAudio: false,
  currentAudioId: null,

  setIsRecording: (recording) =>
    set({ isRecording: recording }),

  setIsPlayingAudio: (playing, id = null) =>
    set({
      isPlayingAudio: playing,
      currentAudioId: id,
    }),
}));