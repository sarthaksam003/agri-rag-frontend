import styles from "./ComposerToolbar.module.css"
import { GrAttachment } from "react-icons/gr";

interface ComposerToolbarProps {

  onAttach(): void;
}

const AttachButton = ({ onAttach }: ComposerToolbarProps) => {
  return (
    <button className={styles["chip-btn"]} data-toast="info|Attach file|File picker would open here." onClick={onAttach}>
      <GrAttachment />
      Attach
    </button>
  )
}

export default AttachButton