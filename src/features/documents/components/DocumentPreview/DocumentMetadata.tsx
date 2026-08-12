import styles from "./DocumentMetadata.module.css";
import { useDocumentPreview } from "../../hooks/useDocumentPreview";

const DocumentMetadata = () => {

    const { selectedDocument } = useDocumentPreview();

    if (!selectedDocument)
        return null;

    return (

        <section className={styles.metadata}>

            <h2>

                {selectedDocument.filename}

            </h2>

            <div className={styles.grid}>

                <div>

                    <label>Type</label>

                    <span>

                        {selectedDocument.fileType.toUpperCase()}

                    </span>

                </div>

                <div>

                    <label>Chunks</label>

                    <span>

                        {selectedDocument.chunkCount}

                    </span>

                </div>

                <div>

                    <label>Uploaded</label>

                    <span>

                        {selectedDocument.uploadedAt.toLocaleDateString()}

                    </span>

                </div>

            </div>

        </section>

    );

};

export default DocumentMetadata;