import { create } from "zustand";

interface AudioStore {
  isPlayingAudio: boolean;
  isAudioPaused: boolean;
  isAudioPlayerOpen: boolean;
  currentAudioId: string | null;
  currentTime: number;
  duration: number;
  playbackRate: number;

  setIsPlayingAudio: (
    playing: boolean,
    id?: string | null
  ) => void;
  setAudioPaused: (paused: boolean) => void;
  setAudioPlayerOpen: (open: boolean) => void;
  setAudioProgress: (currentTime: number, duration?: number) => void;
  setPlaybackRate: (playbackRate: number) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  isPlayingAudio: false,
  isAudioPaused: false,
  isAudioPlayerOpen: false,
  currentAudioId: null,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,

  setIsPlayingAudio: (playing, id = null) =>
    set({
      isPlayingAudio: playing,
      currentAudioId: id,
    }),
  setAudioPaused: (paused) => set({ isAudioPaused: paused }),
  setAudioPlayerOpen: (open) => set({ isAudioPlayerOpen: open }),
  setAudioProgress: (currentTime, duration) =>
    set((state) => ({
      currentTime,
      duration: duration ?? state.duration,
    })),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
}));