import { IconButton } from '@/shared/components/ui/IconButton/IconButton'
import { TiMicrophoneOutline } from "react-icons/ti";
import styles from "./ComposerToolbar.module.css";
import { useTranslation } from "@/features/localization/useTranslation";
interface VoiceButtonProps {
  onVoice(): void;
  isRecording?: boolean;
  disabled?: boolean;
}

const VoiceButton = ({
  disabled,
  isRecording,
  onVoice,
}: VoiceButtonProps) => {
  const { t } = useTranslation();
  return (
    <IconButton
      icon={<TiMicrophoneOutline />}
      className={`${styles["mic-btn"]} ${isRecording ? styles["recording"] : ""
        }`}
      id="micBtn"
      title={t("chat.recordVoiceMessage")}
       onClick={onVoice}
      disabled={disabled}
    />
  );
};

export default VoiceButton