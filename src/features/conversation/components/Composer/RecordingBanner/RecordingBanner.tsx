import styles from "./RecordingBanner.module.css";
import { MdOutlineCancel, MdOutlineCheckCircle } from "react-icons/md";
import { useIncrementRecordingTimer } from "@/features/conversation/hooks/useIncrementRecordingTimer";
import type { RecordingState } from "@/features/conversation/types/recording";
import type { CSSProperties } from "react";
import { useTranslation } from "@/features/localization/useTranslation";
interface RecordingBannerProps {

  state: RecordingState;

  duration: number;

  audioLevel: number;

  onConfirm(): void;

  onCancel(): void;

}

const waveformBars = Array.from({ length: 29 });

type WaveformStyle = CSSProperties & Record<"--audio-level", string>;

const RecordingBanner = ({ state, duration, audioLevel, onConfirm, onCancel }: RecordingBannerProps) => {
  useIncrementRecordingTimer();
  const { t } = useTranslation();
  const isRecording = state === "recording";

  const isSpeaking = isRecording && audioLevel > 0.08;

  const waveformClassName = [
    styles.waveform,
    !isRecording ? styles["waveform-hidden"] : "",
    isSpeaking ? styles.speaking : "",
  ].filter(Boolean).join(" ");

  const waveformStyle: WaveformStyle = {
    "--audio-level": audioLevel.toFixed(3),
  };

  function formatDuration(seconds: number) {

    const minutes = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${minutes}:${secs.toString().padStart(2, "0")}`;

  }

  return (
    <div className={styles["recording-bar"]} >
      <div className={styles["recording-bar-labels-layout"]}>
        <div className={styles["rec-dot-wrap"]}><span className={styles["rec-dot"]}></span><span className={styles["rec-dot-ping"]}></span></div>
        <span className={styles["rec-label"]}>
          {state === "recording"
            ? t("chat.recording")
            : t("chat.transcribing")}
        </span>
        <span className={styles["rec-timer"]}  >{formatDuration(duration)}</span>
      </div>
      <div
        className={waveformClassName}
        style={waveformStyle}
        aria-hidden="true"
      >
        {waveformBars.map((_, index) => (
          <span key={index} className={styles["waveform-bar"]}></span>
        ))}
      </div>
      <div className={styles["recording-bar-btn-layout"]}>

        <button className={styles["rec-confirm"]} onClick={onConfirm}>
          <MdOutlineCheckCircle />
          {t("actions.confirm")}
        </button>

        <button className={styles["rec-cancel"]} onClick={onCancel}>
          <MdOutlineCancel />
          {t("actions.cancel")}
        </button>
      </div>
    </div>)
}

export default RecordingBanner
