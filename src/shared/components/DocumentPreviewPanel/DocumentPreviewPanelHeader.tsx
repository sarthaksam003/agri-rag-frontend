import { IoClose } from "react-icons/io5";
import styles from "./DocumentPreviewPanelHeader.module.css";

interface DocumentPreviewPanelHeaderProps {
  title?: string;
  onClose: () => void;
}

const DocumentPreviewPanelHeader = ({
  title,
  onClose,
}: DocumentPreviewPanelHeaderProps) => {

  return (

    <header className={styles.header}>

      <h2>{title}</h2>

      <button
        onClick={onClose}
        className={styles.close}
        type="button"
      >

        <IoClose />

      </button>

    </header>

  );

};

export default DocumentPreviewPanelHeader;