import { IoCloseOutline } from "react-icons/io5";

import type { SourceReference } from "@/features/conversation/types/source";

import styles from "./SourceInspector.module.css";

interface SourceInspectorProps {
    sources: SourceReference[];
    onClose: () => void;
}

const SourceInspector = ({
    sources,
    onClose,
}: SourceInspectorProps) => {
    return (
        <aside
            className={styles.panel}
            aria-label="Source Inspector"
        >
            <header className={styles.header}>
                <div>
                    <h2 className={styles.title}>
                        Source Inspector
                    </h2>

                    <p className={styles.subtitle}>
                        Sources used to generate this response.
                    </p>
                </div>

                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close source inspector"
                >
                    <IoCloseOutline />
                </button>
            </header>

            <div className={styles.content}>
                <div className={styles.sourceCount}>
                    {sources.length}{" "}
                    {sources.length === 1 ? "source" : "sources"}
                </div>

                <div className={styles.sourceList}>
                    {sources.map((source) => (
                        <article
                            key={source.id}
                            className={styles.sourceCard}
                        >
                            <div className={styles.sourceHeader}>
                                <h3 className={styles.documentName}>
                                    {source.documentName}
                                </h3>

                                <div className={styles.metadata}>
                                    <span>
                                        Page {source.pageNumber}
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
                            </div>

                            <div className={styles.score}>
                                Relevance:{" "}
                                <strong>
                                    {source.score.toFixed(3)}
                                </strong>
                            </div>

                            <blockquote className={styles.snippet}>
                                {source.snippet}
                            </blockquote>
                        </article>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default SourceInspector;