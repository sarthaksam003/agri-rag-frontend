import { useCallback } from "react";
import { useAudioStore } from "@/features/voice/store/audio.store";

let audioRef: HTMLAudioElement | null = null;
let audioUrl: string | null = null;
let currentAudioBlob: Blob | null = null;

export const useAudioPlayer = () => {
  const {
    setIsPlayingAudio,
    setAudioPaused,
    setAudioPlayerOpen,
    setAudioProgress,
    setPlaybackRate,
  } = useAudioStore();

  const clearAudio = useCallback(() => {

    if (audioRef) {
      audioRef.pause();
      audioRef.src = "";
      audioRef = null;
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      audioUrl = null;
    }
    currentAudioBlob = null;
    setIsPlayingAudio(false, null);
    setAudioPaused(false);
    setAudioPlayerOpen(false);
    setAudioProgress(0, 0);
  }, [setAudioPaused, setAudioPlayerOpen, setAudioProgress, setIsPlayingAudio]);

  const playAudio = useCallback(
    (audioBlob: Blob, messageId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (audioRef) {
          audioRef.pause();
          audioRef.src = "";
        }

        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }

        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);

        audioRef = audio;
        audioUrl = url;

        audio.playbackRate = 1;

        setAudioPlayerOpen(true);
        setAudioPaused(false);
        setPlaybackRate(1);
        setAudioProgress(0, 0);

        audio.onplay = () => {
          setIsPlayingAudio(true, messageId);
          setAudioPaused(false);
          resolve();
        };

        audio.onpause = () => {
          if (audioRef === audio && !audio.ended) {
            setIsPlayingAudio(false, messageId);
            setAudioPaused(true);
          }
        };

        audio.onloadedmetadata = () => {
          setAudioProgress(audio.currentTime, audio.duration);
        };

        audio.ontimeupdate = () => {
          setAudioProgress(audio.currentTime, audio.duration);
        };

        audio.onended = () => {
          setIsPlayingAudio(false, null);
          setAudioPaused(false);
          setAudioPlayerOpen(false);
          setAudioProgress(0, audio.duration);

          if (audioRef === audio) {
            audioRef = null;

            if (audioUrl) {
              URL.revokeObjectURL(audioUrl);
            }

            audioUrl = null;
          }
        };

        audio.onerror = () => {
          clearAudio();
          reject(new Error("Failed to play audio."));
        };

        void audio.play().catch((error) => {
          console.error("Failed to play audio:", error);
          clearAudio();
          reject(error);
        });
      });
    },
    [
      clearAudio,
      setAudioPaused,
      setAudioPlayerOpen,
      setAudioProgress,
      setIsPlayingAudio,
      setPlaybackRate,
    ],
  );

  
  const downloadAudio = useCallback(() => {
    if (!currentAudioBlob) {
      return;
    }

    const downloadUrl = URL.createObjectURL(currentAudioBlob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "agri-chat-response.wav";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadUrl);
  }, []);

  const stopAudio = useCallback(() => {
    if (!audioRef) {
      return;
    }

    clearAudio();
  }, [clearAudio]);

  const togglePause = useCallback(() => {
    if (!audioRef) return;

    if (audioRef.paused) {
      void audioRef.play();
    } else {
      audioRef.pause();
    }
  }, []);

  const seekAudio = useCallback((time: number) => {
    if (!audioRef) return;
    audioRef.currentTime = Math.max(0, Math.min(time, audioRef.duration || time));
    setAudioProgress(audioRef.currentTime, audioRef.duration);
  }, [setAudioProgress]);

  const setAudioPlaybackRate = useCallback((rate: number) => {
    if (audioRef) audioRef.playbackRate = rate;
    setPlaybackRate(rate);
  }, [setPlaybackRate]);

  return {
    playAudio,
    stopAudio,
    togglePause,
    seekAudio,
    setAudioPlaybackRate,
    downloadAudio,
  };
};