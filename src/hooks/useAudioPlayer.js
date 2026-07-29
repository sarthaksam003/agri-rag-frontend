import { useRef, useCallback } from 'react';
import useChatStore from '../store/chatStore';

export const useAudioPlayer = () => {
  const audioRef = useRef(null);
  const { setIsPlayingAudio } = useChatStore();

  const playAudio = useCallback(
    (audioBlob, messageId) => {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onplay = () => setIsPlayingAudio(true, messageId);
      audio.onended = () => {
        setIsPlayingAudio(false, null);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setIsPlayingAudio(false, null);
        URL.revokeObjectURL(url);
      };

      audio.play().catch(console.error);
    },
    [setIsPlayingAudio]
  );

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingAudio(false, null);
    }
  }, [setIsPlayingAudio]);

  return { playAudio, stopAudio };
};
