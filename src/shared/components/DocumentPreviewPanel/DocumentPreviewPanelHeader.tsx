import { IoClose, IoDownloadOutline } from "react-icons/io5";
import { useTranslation } from "@/features/localization/useTranslation";

import styles from "./DocumentPreviewPanelHeader.module.css";

interface DocumentPreviewPanelHeaderProps {
  title?: string;
  onClose: () => void;
  onDownload?: () => void;
}

const DocumentPreviewPanelHeader = ({
  title,
  onClose,
  onDownload,
}: DocumentPreviewPanelHeaderProps) => {

  const { t } = useTranslation();

  return (
    <header className={styles.header}>

      <h2>{title}</h2>

      <div className={styles.actions}>

        {onDownload && (
          <button
            type="button"
            onClick={onDownload}
            className={styles.action}
            aria-label={t("actions.download")}
            title={t("actions.download")}
          >
            <IoDownloadOutline />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className={styles.action}
          aria-label="Close"
        >
          <IoClose />
        </button>

      </div>

    </header>
  );
};

export default DocumentPreviewPanelHeader;