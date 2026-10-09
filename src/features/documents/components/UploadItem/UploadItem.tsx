import type { DocumentFile } from "@/features/documents/types/document";
import styles from "./UploadItem.module.css";
import { useTranslation } from "@/features/localization/useTranslation";
import { FiClock } from "react-icons/fi";
interface UploadItemProps {
    document: DocumentFile;
}

const UploadItem = ({ document }: UploadItemProps) => {
    const { t } = useTranslation();
    const isQueued = document.status === "queued";
    const isUploading = document.status === "uploading";
    return (

        <div className={styles["doc-row"]}>

            <div className={`${styles["row-icon"]} ${styles[isQueued ? "queue-icon" : "spin-icon"]}`}>
                {isQueued ? <FiClock aria-hidden="true" /> : <div className={styles.spinner} />}

            </div>

            <div className={styles["row-main"]}>

                <div className={styles["row-title"]}>
                    {document.filename}
                </div>


                <div className={styles["row-sub"]}>
                    {isQueued
                        ? t("documents.waitingInQueue")
                        : isUploading && document.progress !== undefined
                            ? `${t("documents.uploading")} ${document.progress}%`
                            : t("documents.parsingAndEmbedding")}
                </div>

                {!isQueued && (
                    <div className={styles["progress-track"]} aria-hidden="true">
                        <div
                            className={document.progress === undefined
                                ? styles["progress-indeterminate"]
                                : styles["progress-fill"]}
                            style={document.progress === undefined
                                ? undefined
                                : { width: `${document.progress}%` }}
                        />
                    </div>
                )}

            </div>

        </div>

    );

};

export default UploadItem;
