import { ComposerToolbar } from '@/features/conversation/components/Composer/ComposerToolbar';
import ComposerInput from '@/features/conversation/components/Composer/ComposerInput/ComposerInput';
import styles from "./Composer.module.css";
import RecordingBanner from '@/features/conversation/components/Composer/RecordingBanner/RecordingBanner';
import { useRecordingStore } from '@/features/voice/store/recording.store';

interface ComposerProps {

  value: string;

  onChange(value: string): void;

  onSend(text: string): void | Promise<void>;

  onVoiceSend(text: string): void | Promise<void>;

  setTranscript(text: string): void;

  disabled: boolean;

}

const Composer = ({ value, onChange, onVoiceSend, onSend, setTranscript, disabled }: ComposerProps) => {
  const {
    state,
    duration,
    start,
    cancel,
    beginTranscription,
    finishTranscription,
  } = useRecordingStore();


  const handleVoice = () => {
    if (state !== "idle")
      return;

    start();
  };

  const isDisabled =
    disabled ||
    state !== "idle";

  const handleRecordingConfirm = () => {

    beginTranscription();

    setTimeout(() => {

      const transcript =
        "How much fertilizer should I use for paddy cultivation?";

      setTranscript(transcript);

      finishTranscription();

      onVoiceSend(transcript);

      onChange("");
    }, 1500);

  };

  const handleTextSend = () => {

    const text = value.trim();

    if (!text)
      return;

    onSend(text);

    onChange("");

  };

  return (
    <div className={styles['composer-wrap']}>
      {state !== "idle" && <RecordingBanner onConfirm={handleRecordingConfirm} onCancel={cancel} state={state} duration={duration} />}
      <div className={styles.composer}>
        <ComposerInput
          value={value}
          onChange={onChange}
          onSend={handleTextSend}
          onVoice={handleVoice}
          disabled={isDisabled}
          isRecording={state === "recording"}
        />
        <ComposerToolbar onSend={handleTextSend} disabled={isDisabled}
          onAttach={() => { }} onVoice={() => { }} />
      </div>
    </div>
  )
}

export default Composer