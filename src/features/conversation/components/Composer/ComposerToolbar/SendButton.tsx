import { IconButton } from '@/shared/components/ui/IconButton/IconButton';
import { BsSend } from "react-icons/bs";
import styles from "./ComposerToolbar.module.css";
import { useTranslation } from '@/features/localization/useTranslation';

interface SendButtonProps {

  onSend(): void;
  disabled?: boolean;

}
const SendButton = ({ onSend, disabled }: SendButtonProps) => {
  const { t } = useTranslation();

  return (
    <IconButton icon={<BsSend />} className={styles["send-btn"]} disabled={disabled} onClick={onSend} title={t("chat.sendPrompt")} />
  )
}

export default SendButton;