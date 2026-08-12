import type { DocumentFile } from "@/features/documents/types/document";
import styles from "./UploadItem.module.css";

interface UploadItemProps {
    document: DocumentFile;
}

const UploadItem = ({ document }: UploadItemProps) => {

    return (

        <div className={styles["doc-row"]}>

            <div className={`${styles["row-icon"]} ${styles["spin-icon"]}`}>

                <div className={styles.spinner} />

            </div>

            <div className={styles["row-main"]}>

                <div className={styles["row-title"]}>
                    {document.filename}
                </div>


                <div className={styles["row-sub"]}>
                    Parsing & embedding...
                </div>

            </div>

        </div>

    );

};

export default UploadItem;