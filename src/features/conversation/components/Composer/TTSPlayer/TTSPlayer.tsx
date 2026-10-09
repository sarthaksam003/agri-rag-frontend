import { FiDownload, FiPause, FiPlay, FiRotateCcw, FiRotateCw, FiX } from "react-icons/fi";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAudioStore } from "@/features/voice/store/audio.store";
import styles from "./TTSPlayer.module.css";

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, "0")}`;
};

const TTSPlayer = () => {
  const {
    isAudioPaused,
    currentTime,
    duration,
    playbackRate,
  } = useAudioStore();
  const {
    togglePause,
    seekAudio,
    setAudioPlaybackRate,
    stopAudio,
    downloadAudio
  } = useAudioPlayer();

  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const nextSpeed = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
    setAudioPlaybackRate(nextSpeed);
  };

  return (
    <div className={styles.player} role="region" aria-label="Text to speech player">
      <div className={styles.identity}>
        <span className={styles.dot} />
        <span className={styles.label}>Speaking response</span>
        <span className={styles.time}>{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>

      <input
        className={styles.progress}
        type="range"
        min="0"
        max={duration || 0}
        step="0.01"
        value={Math.min(currentTime, duration || 0)}
        onChange={(event) => seekAudio(Number(event.target.value))}
        aria-label="Seek audio"
      />

      <div className={styles.controls}>
        <button type="button" onClick={() => seekAudio(currentTime - 10)} title="Back 10 seconds" aria-label="Back 10 seconds">
          <FiRotateCcw />
        </button>
        <button type="button" className={styles.playButton} onClick={togglePause} title={isAudioPaused ? "Play" : "Pause"} aria-label={isAudioPaused ? "Play" : "Pause"}>
          {isAudioPaused ? <FiPlay /> : <FiPause />}
        </button>
        <button type="button" onClick={() => seekAudio(currentTime + 10)} title="Forward 10 seconds" aria-label="Forward 10 seconds">
          <FiRotateCw />
        </button>
        <button type="button" className={styles.speedButton} onClick={changeSpeed} title="Change playback speed" aria-label="Change playback speed">
          {playbackRate}x
        </button>
        <button
          type="button"
          onClick={downloadAudio}
          title="Download audio"
          aria-label="Download audio"
        >
          <FiDownload />
        </button>
        <button type="button" onClick={stopAudio} title="Close player" aria-label="Close player">
          <FiX />
        </button>
      </div>
    </div>
  );
};

export default TTSPlayer;