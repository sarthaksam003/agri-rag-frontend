import styles from "./ComposerToolbar.module.css"
import { GrAttachment } from "react-icons/gr";
import { useTranslation } from "@/features/localization/useTranslation";
interface ComposerToolbarProps {

  onAttach(): void;
}

const AttachButton = ({ onAttach }: ComposerToolbarProps) => {
  const { t } = useTranslation();
  return (
    <button className={styles["chip-btn"]} data-toast="info|Attach file|File picker would open here." onClick={onAttach}>
      <GrAttachment />
      {t("actions.attach")}
    </button>
  )
}

export default AttachButton