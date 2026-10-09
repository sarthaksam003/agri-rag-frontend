import { IoCloseOutline, IoDocumentTextOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDocumentStore } from "@/features/documents/store/document.store";
import type { SourceReference } from "@/features/conversation/types/source";
import { getDocuments } from "@/features/documents/services/documents.service";
import styles from "./SourceInspector.module.css";
import { useTranslation } from "@/features/localization/useTranslation";
interface SourceInspectorProps {
    sources: SourceReference[];
    onClose: () => void;
}

const SourceInspector = ({
    sources,
    onClose,
}: SourceInspectorProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const documents = useDocumentStore(
        (state) => state.documents
    );

    const openPreview = useDocumentStore(
        (state) => state.openPreview
    );
    return (
        <aside
            className={styles.panel}
            aria-label={t("sourceInspector.title")}
        >
            <header className={styles.header}>
                <div>

                    <h2 className={styles.title}>
                        {t("sourceInspector.title")}
                    </h2>

                    <p className={styles.subtitle}>
                        {t("sourceInspector.subtitle")}
                    </p>
                </div>

                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label={t("sourceInspector.close")}
                >
                    <IoCloseOutline />
                </button>
            </header>

            <div className={styles.content}>
                <div className={styles.sourceCount}>
                    {sources.length}{" "}
                    {sources.length === 1
                        ? t("sourceInspector.source")
                        : t("sourceInspector.sources")}
                </div>

                <div className={styles.sourceList}>
                    {sources.map((source) => {
                        console.log("[SourceInspector] source:", source);

                        return (
                            <article
                                key={source.id}
                                className={styles.sourceCard}
                            >
                                <div className={styles.sourceHeader}>
                                    <div className="flex justify-between">

                                        <div className={styles.metadata}>
                                            <h3 className={styles.documentName}>
                                                {source.documentName}
                                            </h3>
                                            <span>
                                                {t("sourceInspector.page")} {source.pageNumber}
                                            </span>

                                            <span
                                                className={
                                                    styles.metadataSeparator
                                                }
                                            >
                                                ·
                                            </span>

                                            <span>
                                                {source.chunkId}
                                            </span>
                                        </div>
                                        {source.documentId && (
                                            <button
                                                type="button"
                                                className={styles.viewDocumentButton}
                                                onClick={async () => {
                                                    let document = documents.find(
                                                        (document) => document.id === source.documentId
                                                    );

                                                    if (!document && source.documentId) {
                                                        try {
                                                            const loadedDocuments = await getDocuments();

                                                            document = loadedDocuments.find(
                                                                (document) => document.id === source.documentId
                                                            );
                                                        } catch (error) {
                                                            console.error(
                                                                "[SourceInspector] Failed to load documents:",
                                                                error
                                                            );
                                                            return;
                                                        }
                                                    }

                                                    if (!document) {
                                                        console.error(
                                                            "[SourceInspector] Document not found:",
                                                            source.documentId
                                                        );
                                                        return;
                                                    }

                                                    openPreview(
                                                        document,
                                                        source.pageNumber
                                                    );
                                                    navigate("/documents");
                                                }}
                                            >
                                                <IoDocumentTextOutline />
                                                View PDF
                                            </button>
                                        )}
                                    </div>

                                    <div className={styles.score}>
                                        {t("sourceInspector.relevance")}:{" "}
                                        <strong>
                                            {source.score.toFixed(3)}
                                        </strong>
                                    </div>
                                </div>
                                <blockquote className={styles.snippet}>
                                    {source.snippet}
                                </blockquote>

                            </article>
                        )
                    })}
                </div>
            </div>
        </aside>
    );
};

export default SourceInspector;