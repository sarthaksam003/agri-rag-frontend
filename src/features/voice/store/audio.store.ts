import { create } from "zustand";

interface AudioStore {
  isPlayingAudio: boolean;
  currentAudioId: string | null;

  setIsPlayingAudio: (
    playing: boolean,
    id?: string | null
  ) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  isPlayingAudio: false,
  currentAudioId: null,

  setIsPlayingAudio: (playing, id = null) =>
    set({
      isPlayingAudio: playing,
      currentAudioId: id,
    }),
}));