import type { DocumentFile } from "@/features/documents/types/document";
import styles from "./DocumentCard.module.css";
import { FaRegFilePdf } from "react-icons/fa6";
import { FiTrash2 } from "react-icons/fi";
import { useDocumentPreview } from "@/features/documents/hooks/useDocumentPreview";
import { useTranslation } from "@/features/localization/useTranslation";

interface DocumentCardProps {
    document: DocumentFile;
    onDelete: (document: DocumentFile) => void;
}

const DocumentCard = ({
    document,
    onDelete,
}: DocumentCardProps) => {
    const { openPreview } = useDocumentPreview();
    const { t } = useTranslation();

    const handleDelete = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();

        onDelete(document);
    };

    return (
        <div
            className={styles["doc-row"]}
            onClick={() => openPreview(document)}
        >
            <div className={styles["row-icon"]}>
                <FaRegFilePdf />
            </div>

            <div className={styles.info}>
                <div className={styles.name}>
                    <span className={styles.nameText}>
                        {document.filename}
                    </span>
                </div>

                <div className={styles.meta}>
                    {document.chunkCount}{" "}
                    {t("documents.chunks")}
                </div>
            </div>

            <button
                type="button"
                className={styles["deleteButton"]}
                onClick={handleDelete}
                aria-label={t("documents.deleteDocumentAriaLabel", {
                    filename: document.filename,
                })}
                title={t("documents.deleteDocumentTooltip")}
            >
                <FiTrash2 />
            </button>
        </div>
    );
};

export default DocumentCard;