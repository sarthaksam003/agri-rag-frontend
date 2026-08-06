import AttachButton from "@/features/conversation/components/Composer/ComposerToolbar/AttachButton";
import styles from "./ComposerToolbar.module.css"

interface ComposerToolbarProps {

  disabled: boolean;
  onAttach(): void;

  onVoice(): void;

  onSend(): void;
}

const ComposerToolbar = ({ onAttach, disabled }: ComposerToolbarProps) => {

  return (
    <div className={styles["composer-toolbar"]}>
      <div className={styles["toolbar-left"]}>
        <AttachButton onAttach={onAttach} />
      </div>
      <div className={styles["composer-hint"]} id="composerHint">Simple RAG · Enter to send · Shift+Enter for new line</div>
    </div>
  )
}

export default ComposerToolbar