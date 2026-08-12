import DocumentCard from "@/features/documents/components/DocumentCard/DocumentCard";
import type { DocumentFile } from "@/features/documents/types/document";
import styles from "./DocumentList.module.css";

interface DocumentListProps {
    fileList: DocumentFile[];
    onDelete: (document: DocumentFile) => void;
}

const DocumentList = ({
    fileList,
    onDelete,
}: DocumentListProps) => {
    return (
        <div
            id="docsList"
            className={styles.list}
        >
            {fileList.map((document) => (
                <DocumentCard
                    key={document.id}
                    document={document}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default DocumentList;