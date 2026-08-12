import AttachButton from "@/features/conversation/components/Composer/ComposerToolbar/AttachButton";
import styles from "./ComposerToolbar.module.css"
import { useSettingsStore } from "@/features/settings/store/settings.store";

interface ComposerToolbarProps {

  disabled: boolean;
  onAttach(): void;

  onVoice(): void;

  onSend(): void;
}

const ComposerToolbar = ({ onAttach, disabled }: ComposerToolbarProps) => {
  const {ragMode, maxQueries} = useSettingsStore();
  return (
    <div className={styles["composer-toolbar"]}>
      <div className={styles["toolbar-left"]}>
        <AttachButton onAttach={onAttach} />
      </div>
      <div className={styles["composer-hint"]} id="composerHint">{ragMode == "multi"? `Multi-query RAG mode (${maxQueries} queries)`:"Simple RAG mode"} · Enter to send · Shift+Enter for new line</div>
    </div>
  )
}

export default ComposerToolbar