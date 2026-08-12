import type { DocumentFile } from "@/features/documents/types/document";
import styles from "./DocumentCard.module.css";
import { FaRegFilePdf } from "react-icons/fa6";
import { FiTrash2 } from "react-icons/fi";
import { useDocumentPreview } from "@/features/documents/hooks/useDocumentPreview";

interface DocumentCardProps {
    document: DocumentFile;
    onDelete: (document: DocumentFile) => void;
}

const DocumentCard = ({
    document,
    onDelete,
}: DocumentCardProps) => {
    const { openPreview } = useDocumentPreview();

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
                    {document.filename}
                </div>

                <div className={styles.meta}>
                    {document.chunkCount} chunks
                </div>
            </div>

            <button
                type="button"
                className={styles["deleteButton"]}
                onClick={handleDelete}
                aria-label={`Delete ${document.filename}`}
                title="Delete document"
            >
                <FiTrash2 />
            </button>
        </div>
    );
};

export default DocumentCard;