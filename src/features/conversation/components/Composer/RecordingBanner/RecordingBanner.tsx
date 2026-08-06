import styles from "./RecordingBanner.module.css";
import { MdOutlineCancel, MdOutlineCheckCircle } from "react-icons/md";
import { useIncrementRecordingTimer } from "@/features/conversation/hooks/useIncrementRecordingTimer";
import type { RecordingState } from "@/features/conversation/types/recording";

interface RecordingBannerProps {

  state: RecordingState;

  duration: number;

  onConfirm(): void;

  onCancel(): void;

}

const RecordingBanner = ({ state, duration, onConfirm, onCancel }: RecordingBannerProps) => {
  useIncrementRecordingTimer();

  function formatDuration(seconds: number) {

    const minutes = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${minutes}:${secs.toString().padStart(2, "0")}`;

  }

  return (
    <div className={styles["recording-bar"]} >
      <div className={styles["recording-bar-labels-layout"]}>
        <div className={styles["rec-dot-wrap"]}><span className={styles["rec-dot"]}></span><span className={styles["rec-dot-ping"]}></span></div>
        <span className={styles["rec-label"]}>{state === "recording" ? "Recording" : "Transcribing..."}</span>
        <span className={styles["rec-timer"]}  >{formatDuration(duration)}</span>
      </div>
      <div className={styles["recording-bar-btn-layout"]}>

        <button className={styles["rec-confirm"]} onClick={onConfirm}>
          <MdOutlineCheckCircle />
          Confirm
        </button>
        <button className={styles["rec-cancel"]} onClick={onCancel}>
          <MdOutlineCancel />
          Cancel
        </button>
      </div>
    </div>)
}

export default RecordingBanner