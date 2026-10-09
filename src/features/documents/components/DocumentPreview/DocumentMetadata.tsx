import styles from "./DocumentMetadata.module.css";
import { useDocumentPreview } from "../../hooks/useDocumentPreview";
import { useTranslation } from "@/features/localization/useTranslation";
const DocumentMetadata = () => {

    const { selectedDocument } = useDocumentPreview();

    const { t } = useTranslation();
    if (!selectedDocument)
        return null;
    return (

        <section className={styles.metadata}>

            <h2>

                {selectedDocument.filename}

            </h2>

            <div className={styles.grid}>

                <div>

                    <label>{t("documents.type")}</label>
                    <span>

                        {selectedDocument.fileType.toUpperCase()}

                    </span>

                </div>

                <div>

                    <label>{t("documents.chunks")}</label>
                    <span>

                        {selectedDocument.chunkCount}

                    </span>

                </div>

                <div>

                    <label>{t("documents.uploaded")}</label>
                    <span>

                        {selectedDocument.uploadedAt.toLocaleDateString()}

                    </span>

                </div>

            </div>

        </section>

    );

};

export default DocumentMetadata;