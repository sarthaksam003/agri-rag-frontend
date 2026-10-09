import { ComposerToolbar } from '@/features/conversation/components/Composer/ComposerToolbar';
import ComposerInput from '@/features/conversation/components/Composer/ComposerInput/ComposerInput';
import styles from "./Composer.module.css";
import RecordingBanner from '@/features/conversation/components/Composer/RecordingBanner/RecordingBanner';
import { useRecordingStore } from '@/features/voice/store/recording.store';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import TTSPlayer from '@/features/conversation/components/Composer/TTSPlayer/TTSPlayer';
import { useAudioStore } from '@/features/voice/store/audio.store';
import { useTranslation } from "@/features/localization/useTranslation";
import { useToast } from "@/shared/components/hooks/useToast";

interface ComposerProps {
  value: string;
  onChange(value: string): void;
  onSend(text: string): void | Promise<void>;
  onVoiceSend(audio: Blob): Promise<string>;
  onStop(): void;
  showStop?: boolean;
  disabled: boolean;
  waitingForResponse?: boolean;
}

const Composer = ({
  value,
  onChange,
  onVoiceSend,
  onSend,
  onStop,
  showStop = false,
  disabled,
  waitingForResponse = false,
}: ComposerProps) => {
  const { isAudioPlayerOpen } = useAudioStore();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const {
    state,
    duration,
    start,
    cancel,
    beginTranscription,
    finishTranscription,
  } = useRecordingStore();

  const {
    startRecording,
    stopRecording,
    cancelRecording,
    audioLevel,
  } = useAudioRecorder();

  const handleVoice = async () => {
    if (state !== "idle" || disabled) {
      return;
    }

    const started = await startRecording();

    if (started) {
      start();

      showToast(t("notifications.recordingStarted"), {
        type: "info",
      });
    }
  };

  const isDisabled =
    disabled ||
    state !== "idle";

  const handleRecordingConfirm = async () => {
    if (state !== "recording") {
      return;
    }
    showToast(t("notifications.recordingConfirmed"), {
      type: "info",
    });
    beginTranscription();

    try {
      const audioBlob = await stopRecording();

      if (!audioBlob || audioBlob.size === 0) {
        console.error("No audio was recorded.");
        finishTranscription();
        return;
      }

      console.log(
        "Recorded audio:",
        audioBlob.size,
        "bytes",
        audioBlob.type
      );

      const transcribedText = await onVoiceSend(audioBlob);


      finishTranscription();
      if (transcribedText.trim()) {
        onChange(transcribedText);
      }
    } catch (error) {
      console.error("Failed to process voice recording:", error);
      finishTranscription();
    }
  };

  const handleRecordingCancel = () => {
    cancelRecording();
    cancel();
  };

  const handleTextSend = () => {
    const text = value.trim();

    if (!text) {
      return;
    }

    onSend(text);
    onChange("");
  };

  return (
    <div className={styles['composer-wrap']}>

      {isAudioPlayerOpen && <TTSPlayer />}

      {state !== "idle" && (
        <RecordingBanner
          onConfirm={handleRecordingConfirm}
          onCancel={handleRecordingCancel}
          state={state}
          duration={duration}
          audioLevel={audioLevel}
        />
      )}

      <div className={styles.composer}>

        <ComposerInput
          value={value}
          onChange={onChange}
          onSend={handleTextSend}
          onStop={onStop}
          onVoice={handleVoice}
          disabled={isDisabled}
          waitingForResponse={waitingForResponse}
          showStop={showStop}
          isRecording={state === "recording"}
        />

        <ComposerToolbar
          onSend={handleTextSend}
          disabled={isDisabled}
          onAttach={() => { }}
          onVoice={() => { }}
        />
      </div>
    </div>
  );
};

export default Composer;
