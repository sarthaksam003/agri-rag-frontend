import { IconButton } from '@/shared/components/ui/IconButton/IconButton';
import { BsSend } from "react-icons/bs";
import styles from "./ComposerToolbar.module.css";

interface SendButtonProps {

  onSend(): void;
  disabled?: boolean;

}
const SendButton = ({ onSend, disabled }: SendButtonProps) => {
  return (
    <IconButton icon={<BsSend />} className={styles["send-btn"]} disabled={disabled} onClick={onSend} />
  )
}

export default SendButton;