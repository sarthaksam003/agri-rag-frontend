import { IconButton } from '@/shared/components/ui/IconButton/IconButton'
import { TiMicrophoneOutline } from "react-icons/ti";
import styles from "./ComposerToolbar.module.css";

interface VoiceButtonProps {
  onVoice(): void;
  disabled?: boolean;
}

const VoiceButton = ({
  onVoice,
  disabled,
}: VoiceButtonProps) => {
  return (
    <IconButton
      icon={<TiMicrophoneOutline />}
      className={styles["mic-btn"]}
      id="micBtn"
      title="Record a voice message"
      onClick={onVoice}
      disabled={disabled}
    />
  );
};

export default VoiceButton